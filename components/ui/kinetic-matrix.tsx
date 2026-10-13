'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { ARTWORK_WARP, MATRIX_MOTION, approach, artworkShiftTargets, constrainArtworkShifts, displacementAt, randomBetween, createPulseProgressThresholds, steppedProgress, type MotionWave } from '@/lib/matrix-motion';

interface MatrixNode {
  x: number; y: number; baseX: number; baseY: number;
  tension: number; label: string;
}
interface Pulse {
  fromNodeIndex: number; toNodeIndex: number; age: number; duration: number; progressThresholds: number[];
}
export interface KineticMatrixProps {
  title?: string;
  titleArtworkSrc?: string;
  enableArtworkMotion?: boolean;
  gridSpacing?: number;
  className?: string;
}

export function KineticMatrix({ title = 'TOPOLOGY', titleArtworkSrc, enableArtworkMotion = false, gridSpacing = MATRIX_MOTION.spacing, className = '' }: KineticMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artworkRef = useRef<HTMLImageElement>(null);
  const artworkCanvasRef = useRef<HTMLCanvasElement>(null);
  const [artworkReady, setArtworkReady] = useState(false);
  const [isRunning, setIsRunning] = useState(() =>
    typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const runningRef = useRef(isRunning);
  const impulseRef = useRef<(x?: number, y?: number) => void>(() => {});
  const pointerRef = useRef({ x: -2000, y: -2000 });

  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setIsRunning(!reducedMotionQuery.matches);
    reducedMotionQuery.addEventListener('change', updateMotionPreference);
    return () => reducedMotionQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const gridContext = canvas.getContext('2d', { alpha: false });
    if (!gridContext) return;
    const artworkImage = enableArtworkMotion ? artworkRef.current : null;
    const artworkCanvas = enableArtworkMotion ? artworkCanvasRef.current : null;
    const artworkContext = artworkCanvas?.getContext('2d') ?? null;
    const artworkSource = artworkContext ? document.createElement('canvas') : null;
    const artworkSourceContext = artworkSource?.getContext('2d') ?? null;

    let nodes: MatrixNode[] = [];
    let pulses: Pulse[] = [];
    let waves: MotionWave[] = [];
    let width = 0, height = 0, rows = 0, cols = 0, spacing = MATRIX_MOTION.spacing;
    let artworkWidth = 0, artworkHeight = 0, artworkX = 0, artworkY = 0;
    let artworkSourcePixels: ImageData | null = null;
    let artworkFrame: ImageData | null = null;
    let warpShifts = new Float32Array(0);
    let artworkIdle = true, pendingArtworkRenderSeconds = 0;
    let simulationTimeSeconds = 0, nextPulseAtSeconds = randomBetween(MATRIX_MOTION.pulseInterval), pulsesResumeAtSeconds = 0;
    let lastImpulseAtSeconds = -Infinity;
    let hoveredNodeIndex = -1, nodeHoverStartedAtSeconds = 0;
    let isDarkTheme = false, isMatrixInViewport = true;
    let animationFrameId = 0, pendingSimulationSeconds = 0, lastFrameTimeMs = 0;
    const darkSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function drawArtwork(dt: number, force = false) {
      if (!artworkContext || !artworkSourcePixels || !artworkFrame || !artworkWidth || !artworkHeight) return;
      const pointer = pointerRef.current;
      const radius = Math.min(MATRIX_MOTION.pointerRadius, Math.min(width, height) * 0.3);
      const nearArtwork = pointer.x >= artworkX - radius && pointer.x <= artworkX + artworkWidth + radius &&
        pointer.y >= artworkY - radius && pointer.y <= artworkY + artworkHeight + radius;
      if (artworkIdle && !nearArtwork && !waves.length && !force) return;
      if (artworkIdle && !nearArtwork && !waves.length) {
        artworkContext.putImageData(artworkSourcePixels, 0, 0);
        return;
      }

      // One horizontal map serves every scanline. The pointer's vertical
      // distance still changes its strength through the shared motion field.
      const targets = artworkShiftTargets(
        { x: artworkX, y: artworkY, width: artworkWidth, height: artworkHeight },
        pointer, waves, radius,
      );
      for (let sampleIndex = 0; sampleIndex < warpShifts.length; sampleIndex++) {
        warpShifts[sampleIndex] = approach(warpShifts[sampleIndex], targets[sampleIndex],
          targets[sampleIndex] || waves.length ? MATRIX_MOTION.response : MATRIX_MOTION.recovery, dt);
      }
      constrainArtworkShifts(warpShifts);
      const moving = warpShifts.some((shift) => shift !== 0);

      artworkIdle = !moving && !waves.length;
      if (artworkIdle) {
        artworkContext.putImageData(artworkSourcePixels, 0, 0);
        return;
      }

      const sourceRgba = artworkSourcePixels.data;
      const outputRgba = artworkFrame.data;
      const bitmapWidth = artworkSourcePixels.width;
      const bitmapHeight = artworkSourcePixels.height;
      const scaleX = bitmapWidth / artworkWidth;
      for (let y = 0; y < bitmapHeight; y++) {
        const pixelRowStart = y * bitmapWidth;
        for (let x = 0; x < bitmapWidth; x++) {
          const cssX = (x + 0.5) / scaleX;
          const sampleIndex = Math.min(warpShifts.length - 2, Math.floor(cssX / ARTWORK_WARP.sampleSpacingPx));
          const sampleBlend = Math.min(1, (cssX - sampleIndex * ARTWORK_WARP.sampleSpacingPx) / ARTWORK_WARP.sampleSpacingPx);
          const shift = warpShifts[sampleIndex] * (1 - sampleBlend) + warpShifts[sampleIndex + 1] * sampleBlend;
          const sourceX = x - shift * scaleX;
          const leftSourcePixelX = Math.floor(sourceX);
          const pixelBlend = sourceX - leftSourcePixelX;
          const leftIndex = leftSourcePixelX >= 0 && leftSourcePixelX < bitmapWidth ? (pixelRowStart + leftSourcePixelX) * 4 : -1;
          const rightIndex = leftSourcePixelX + 1 >= 0 && leftSourcePixelX + 1 < bitmapWidth ? (pixelRowStart + leftSourcePixelX + 1) * 4 : -1;
          const leftAlpha = leftIndex < 0 ? 0 : sourceRgba[leftIndex + 3] * (1 - pixelBlend);
          const rightAlpha = rightIndex < 0 ? 0 : sourceRgba[rightIndex + 3] * pixelBlend;
          const alpha = leftAlpha + rightAlpha;
          const outputPixelOffset = (pixelRowStart + x) * 4;
          outputRgba[outputPixelOffset + 3] = alpha;
          if (alpha) {
            // Interpolate premultiplied color to avoid light or dark fringes at
            // the transparent edge of a scanline.
            for (let channel = 0; channel < 3; channel++) {
              outputRgba[outputPixelOffset + channel] = ((leftIndex < 0 ? 0 : sourceRgba[leftIndex + channel] * leftAlpha) +
                (rightIndex < 0 ? 0 : sourceRgba[rightIndex + channel] * rightAlpha)) / alpha;
            }
          } else {
            outputRgba[outputPixelOffset] = outputRgba[outputPixelOffset + 1] = outputRgba[outputPixelOffset + 2] = 0;
          }
        }
      }
      artworkContext.putImageData(artworkFrame, 0, 0);
    }

    function sizeArtwork() {
      if (!artworkContext || !artworkCanvas || !artworkSource || !artworkSourceContext || !artworkImage || !container ||
        !artworkImage.complete || !artworkImage.naturalWidth) return;
      const rect = artworkImage.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      artworkWidth = rect.width;
      artworkHeight = rect.height;
      artworkX = rect.x - containerRect.x;
      artworkY = rect.y - containerRect.y;
      if (!artworkWidth || !artworkHeight) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      artworkCanvas.width = Math.round(artworkWidth * dpr);
      artworkCanvas.height = Math.round(artworkHeight * dpr);
      artworkContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      artworkSource.width = artworkCanvas.width;
      artworkSource.height = artworkCanvas.height;
      artworkSourceContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      artworkSourceContext.drawImage(artworkImage, 0, 0, artworkWidth, artworkHeight);
      artworkSourcePixels = artworkSourceContext.getImageData(0, 0, artworkSource.width, artworkSource.height);
      artworkFrame = artworkContext.createImageData(artworkSource.width, artworkSource.height);
      warpShifts = new Float32Array(Math.ceil(artworkWidth / ARTWORK_WARP.sampleSpacingPx) + 1);
      artworkIdle = true;
      drawArtwork(0, true);
      setArtworkReady(true);
    }

    function draw() {
      if (!gridContext) return;
      const ink = isDarkTheme ? '255,255,255' : '17,17,17';
      gridContext.fillStyle = isDarkTheme ? '#06070a' : '#f7f7f5';
      gridContext.fillRect(0, 0, width, height);
      const pixel = (value: number) => value;
      const weight = Math.min(1.4, Math.max(1, width / 1000));
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const node = nodes[c * rows + r];
          for (const next of [c + 1 < cols ? nodes[(c + 1) * rows + r] : null,
            r + 1 < rows ? nodes[c * rows + r + 1] : null]) {
            if (!next) continue;
            const stretch = Math.abs(Math.hypot(node.x - next.x, node.y - next.y) - spacing) / spacing;
            const stress = Math.min(1, Math.max(node.tension, next.tension, stretch * 2));
            gridContext.strokeStyle = 'rgba(' + ink + ',' + ((isDarkTheme ? 0.12 : 0.095) + stress * 0.72) + ')';
            gridContext.lineWidth = (0.85 + stress * 1.65) * weight;
            gridContext.beginPath();
            gridContext.moveTo(pixel(node.x), pixel(node.y));
            gridContext.lineTo(pixel(next.x), pixel(next.y));
            gridContext.stroke();
          }
        }
      }
      for (const node of nodes) {
        const active = node.tension > 0.16;
        if (node.tension > 0.25) {
          gridContext.fillStyle = 'rgba(' + ink + ',' + node.tension * 0.13 + ')';
          gridContext.beginPath();
          gridContext.arc(node.x, node.y, 3 + node.tension * 5, 0, Math.PI * 2);
          gridContext.fill();
        }
        gridContext.fillStyle = 'rgba(' + ink + ',' + (active ? 0.9 : 0.23) + ')';
        gridContext.beginPath();
        gridContext.arc(pixel(node.x), pixel(node.y), active ? 1.5 + node.tension * 1.8 : 1.3, 0, Math.PI * 2);
        gridContext.fill();
      }
      for (const pulse of pulses) {
        const startNode = nodes[pulse.fromNodeIndex], endNode = nodes[pulse.toNodeIndex];
        if (!startNode || !endNode) continue;
        const travel = pulse.age / pulse.duration;
        const progress = travel * 0.88 + steppedProgress(travel, pulse.progressThresholds) * 0.12;
        const trail = Math.max(0, progress - 0.16);
        gridContext.strokeStyle = 'rgba(' + ink + ',0.25)';
        gridContext.lineWidth = 2;
        gridContext.beginPath();
        gridContext.moveTo(startNode.x + (endNode.x - startNode.x) * trail, startNode.y + (endNode.y - startNode.y) * trail);
        gridContext.lineTo(startNode.x + (endNode.x - startNode.x) * progress, startNode.y + (endNode.y - startNode.y) * progress);
        gridContext.stroke();
        gridContext.fillStyle = isDarkTheme ? '#fff' : '#111';
        gridContext.beginPath();
        gridContext.arc(pixel(startNode.x + (endNode.x - startNode.x) * progress), pixel(startNode.y + (endNode.y - startNode.y) * progress), 2.2, 0, Math.PI * 2);
        gridContext.fill();
      }
      if (hoveredNodeIndex >= 0 && simulationTimeSeconds - nodeHoverStartedAtSeconds > 0.35) {
        const node = nodes[hoveredNodeIndex];
        if (node) {
          gridContext.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
          gridContext.fillStyle = isDarkTheme ? '#fff' : '#111';
          gridContext.fillText(node.label, Math.max(6, Math.min(width - 40, node.x + 10)), Math.max(12, node.y - 10));
        }
      }
    }

    function advanceSimulation(dt: number) {
      simulationTimeSeconds += dt;
      waves = waves.filter((wave) => {
        wave.age += dt;
        return wave.age < MATRIX_MOTION.impulseDuration;
      });
      const pointer = pointerRef.current;
      let nearestNodeIndex = -1, nearestDistance = 18;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Rest positions avoid feedback between the cursor and displaced points.
        const field = displacementAt({ x: node.baseX, y: node.baseY }, pointer, waves,
          Math.min(MATRIX_MOTION.pointerRadius, Math.min(width, height) * 0.3));
        node.x = approach(node.x, node.baseX + field.x, field.influence || field.waveTension ? MATRIX_MOTION.response : MATRIX_MOTION.recovery, dt);
        node.y = approach(node.y, node.baseY + field.y, field.influence || field.waveTension ? MATRIX_MOTION.response : MATRIX_MOTION.recovery, dt);
        node.tension = Math.min(1, Math.max(field.influence * 0.9, field.waveTension, node.tension - dt * 1.2));
        const visualDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
        if (visualDistance < nearestDistance) { nearestNodeIndex = i; nearestDistance = visualDistance; }
      }
      if (nearestNodeIndex !== hoveredNodeIndex) { hoveredNodeIndex = nearestNodeIndex; nodeHoverStartedAtSeconds = simulationTimeSeconds; }
      pulses = pulses.filter((pulse) => {
        pulse.age += dt;
        if (pulse.age >= pulse.duration && nodes[pulse.toNodeIndex]) {
          nodes[pulse.toNodeIndex].tension = Math.max(nodes[pulse.toNodeIndex].tension, 0.3);
        }
        return pulse.age < pulse.duration;
      });
      if (simulationTimeSeconds >= nextPulseAtSeconds && simulationTimeSeconds >= pulsesResumeAtSeconds) {
        nextPulseAtSeconds = simulationTimeSeconds + randomBetween(MATRIX_MOTION.pulseInterval);
        if (pulses.length < MATRIX_MOTION.maxPulses && cols > 1 && rows > 1) {
          // Only choose links with both endpoints inside the visible canvas.
          const visibleCols = Math.max(1, Math.floor(width / spacing));
          const visibleRows = Math.max(1, Math.floor(height / spacing));
          const c = Math.floor(Math.random() * visibleCols);
          const r = Math.floor(Math.random() * visibleRows);
          const fromNodeIndex = c * rows + r;
          const toNodeIndex = Math.random() < 0.5 ? fromNodeIndex + rows : fromNodeIndex + 1;
          if (nodes[toNodeIndex]) pulses.push({ fromNodeIndex, toNodeIndex, age: 0, duration: randomBetween(MATRIX_MOTION.pulseDuration), progressThresholds: createPulseProgressThresholds() });
        }
      }
    }

    function animate(now: number) {
      animationFrameId = 0;
      if (!runningRef.current || !isMatrixInViewport || document.hidden) return;
      const elapsed = Math.min((now - lastFrameTimeMs) / 1000, 0.1);
      pendingSimulationSeconds += elapsed;
      pendingArtworkRenderSeconds += elapsed;
      lastFrameTimeMs = now;
      let changed = false;
      while (pendingSimulationSeconds >= MATRIX_MOTION.simulationStepSeconds) {
        advanceSimulation(MATRIX_MOTION.simulationStepSeconds);
        pendingSimulationSeconds -= MATRIX_MOTION.simulationStepSeconds;
        changed = true;
      }
      if (changed) {
        draw();
        if (pendingArtworkRenderSeconds >= 1 / 30) {
          drawArtwork(pendingArtworkRenderSeconds);
          pendingArtworkRenderSeconds = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    function syncAnimationLoop() {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
      lastFrameTimeMs = performance.now();
      pendingSimulationSeconds = 0;
      pendingArtworkRenderSeconds = 0;
      if (runningRef.current && isMatrixInViewport && !document.hidden) animationFrameId = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gridContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      spacing = Math.max(32, Math.min(gridSpacing, Math.min(width, height) / 4));
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      nodes = Array.from({ length: cols * rows }, (_, i) => {
        const c = Math.floor(i / rows), r = i % rows;
        return { x: c * spacing, y: r * spacing, baseX: c * spacing, baseY: r * spacing,
          tension: 0, label: '0x' + ((c * 17 + r * 31) % 256).toString(16).padStart(2, '0').toUpperCase() };
      });
      pulses = [];
      waves = [];
      hoveredNodeIndex = -1;
      nextPulseAtSeconds = simulationTimeSeconds + randomBetween(MATRIX_MOTION.pulseInterval);
      draw();
      sizeArtwork();
      syncAnimationLoop();
    });
    resizeObserver.observe(container);
    if (artworkImage) {
      resizeObserver.observe(artworkImage);
      // The hero aligns the artwork to its heading; observe that positioning
      // frame too so the shared pointer field uses the current artwork origin.
      const artworkLayout = artworkImage.closest('.matrix-title');
      if (artworkLayout) resizeObserver.observe(artworkLayout);
      artworkImage.addEventListener('load', sizeArtwork);
      if (artworkImage.complete) sizeArtwork();
    }

    function updateTheme() {
      const classes = document.documentElement.classList;
      isDarkTheme = classes.contains('dark') || (!classes.contains('light') && darkSchemeQuery.matches);
      draw();
    }
    darkSchemeQuery.addEventListener('change', updateTheme);
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    updateTheme();

    impulseRef.current = (x = width / 2, y = height / 2) => {
      if (!runningRef.current || simulationTimeSeconds - lastImpulseAtSeconds < 0.4) return;
      lastImpulseAtSeconds = simulationTimeSeconds;
      const radius = Math.min(MATRIX_MOTION.impulseRadius, Math.hypot(width, height) * 0.6);
      if (waves.length >= 3) waves.shift();
      waves.push({ x, y, age: 0, radius });
      pulsesResumeAtSeconds = simulationTimeSeconds + MATRIX_MOTION.quietTime;
      nextPulseAtSeconds = pulsesResumeAtSeconds + randomBetween(MATRIX_MOTION.pulseInterval);
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isMatrixInViewport = entry.isIntersecting;
      syncAnimationLoop();
    });
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', syncAnimationLoop);
    // React state changes notify this effect without rebuilding the lattice.
    container.addEventListener('matrix-running-change', syncAnimationLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      artworkImage?.removeEventListener('load', sizeArtwork);
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      darkSchemeQuery.removeEventListener('change', updateTheme);
      document.removeEventListener('visibilitychange', syncAnimationLoop);
      container.removeEventListener('matrix-running-change', syncAnimationLoop);
      impulseRef.current = () => {};
    };
  }, [enableArtworkMotion, gridSpacing]);

  useEffect(() => {
    containerRef.current?.dispatchEvent(new Event('matrix-running-change'));
  }, [isRunning]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hero = container.closest('.hero');
    if (!hero) return;

    const handlePointerMove = (e: globalThis.PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerLeave = () => {
      pointerRef.current = { x: -2000, y: -2000 };
    };

    hero.addEventListener('pointermove', handlePointerMove as EventListener);
    hero.addEventListener('pointerleave', handlePointerLeave as EventListener);
    return () => {
      hero.removeEventListener('pointermove', handlePointerMove as EventListener);
      hero.removeEventListener('pointerleave', handlePointerLeave as EventListener);
    };
  }, []);

  function clearPointerPosition() { pointerRef.current = { x: -2000, y: -2000 }; }
  function updatePointerPosition(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  return (
    <div ref={containerRef} className={cn('kinetic-matrix', className)}
      onPointerMove={updatePointerPosition}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        updatePointerPosition(event);
        impulseRef.current(pointerRef.current.x, pointerRef.current.y);
      }}
      onPointerUp={(event) => { if (event.pointerType !== 'mouse') clearPointerPosition(); }}
      onPointerLeave={clearPointerPosition} onPointerCancel={clearPointerPosition}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full cursor-crosshair" />
      <div className="matrix-title">
        <h2 className={cn('font-mono font-black tracking-tighter uppercase text-neutral-900 dark:text-white', titleArtworkSrc && 'matrix-artwork-title')}
          aria-label={titleArtworkSrc ? title : undefined}>
          {titleArtworkSrc ? (
            <span className={cn('matrix-artwork-stack', enableArtworkMotion && isRunning && artworkReady && 'is-reactive')}>
              <img ref={artworkRef} className="matrix-artwork" src={titleArtworkSrc} alt="" aria-hidden="true" />
              {enableArtworkMotion && <canvas ref={artworkCanvasRef} className="matrix-artwork-reactive" aria-hidden="true" />}
            </span>
          ) : title}
        </h2>
      </div>
    </div>
  );
}
export default KineticMatrix;
