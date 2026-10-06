'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { ARTWORK_WARP, MOTION, approach, artworkShiftTargets, constrainArtworkShifts, displacementAt, randomBetween, pulseStops, steppedProgress, type MotionWave } from '@/lib/matrix-motion';

interface MatrixNode {
  x: number; y: number; baseX: number; baseY: number;
  tension: number; label: string;
}
interface Pulse {
  from: number; to: number; age: number; duration: number; stops: number[];
}
export interface KineticMatrixProps {
  title?: string;
  titleArtwork?: string;
  reactiveArtwork?: boolean;
  className?: string;
}

export function KineticMatrix({ title = 'TOPOLOGY', titleArtwork, reactiveArtwork = false, className = '' }: KineticMatrixProps) {
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
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setIsRunning(!preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const artworkImage = reactiveArtwork ? artworkRef.current : null;
    const artworkCanvas = reactiveArtwork ? artworkCanvasRef.current : null;
    const artworkCtx = artworkCanvas?.getContext('2d') ?? null;
    const artworkSource = artworkCtx ? document.createElement('canvas') : null;
    const artworkSourceCtx = artworkSource?.getContext('2d') ?? null;

    let nodes: MatrixNode[] = [];
    let pulses: Pulse[] = [];
    let waves: MotionWave[] = [];
    let width = 0, height = 0, rows = 0, cols = 0, spacing = MOTION.spacing;
    let artworkWidth = 0, artworkHeight = 0, artworkX = 0, artworkY = 0;
    let artworkSourcePixels: ImageData | null = null;
    let artworkFrame: ImageData | null = null;
    let warpShifts = new Float32Array(0);
    let artworkIdle = true, artworkElapsed = 0;
    let clock = 0, nextPulse = randomBetween(MOTION.pulseInterval), quietUntil = 0;
    let lastImpulse = -Infinity;
    let inspected = -1, inspectedSince = 0;
    let dark = false, visible = true;
    let frame = 0, accumulator = 0, lastTime = 0;
    const theme = window.matchMedia('(prefers-color-scheme: dark)');

    function drawArtwork(dt: number, force = false) {
      if (!artworkCtx || !artworkSourcePixels || !artworkFrame || !artworkWidth || !artworkHeight) return;
      const pointer = pointerRef.current;
      const radius = Math.min(MOTION.pointerRadius, Math.min(width, height) * 0.3);
      const nearArtwork = pointer.x >= artworkX - radius && pointer.x <= artworkX + artworkWidth + radius &&
        pointer.y >= artworkY - radius && pointer.y <= artworkY + artworkHeight + radius;
      if (artworkIdle && !nearArtwork && !waves.length && !force) return;
      if (artworkIdle && !nearArtwork && !waves.length) {
        artworkCtx.putImageData(artworkSourcePixels, 0, 0);
        return;
      }

      // One horizontal map serves every scanline. The pointer's vertical
      // distance still changes its strength through the shared motion field.
      const targets = artworkShiftTargets(
        { x: artworkX, y: artworkY, width: artworkWidth, height: artworkHeight },
        pointer, waves, radius,
      );
      for (let col = 0; col < warpShifts.length; col++) {
        warpShifts[col] = approach(warpShifts[col], targets[col],
          targets[col] || waves.length ? MOTION.response : MOTION.recovery, dt);
      }
      constrainArtworkShifts(warpShifts);
      const moving = warpShifts.some((shift) => shift !== 0);

      artworkIdle = !moving && !waves.length;
      if (artworkIdle) {
        artworkCtx.putImageData(artworkSourcePixels, 0, 0);
        return;
      }

      const source = artworkSourcePixels.data;
      const output = artworkFrame.data;
      const bitmapWidth = artworkSourcePixels.width;
      const bitmapHeight = artworkSourcePixels.height;
      const scaleX = bitmapWidth / artworkWidth;
      for (let y = 0; y < bitmapHeight; y++) {
        const pixelRowStart = y * bitmapWidth;
        for (let x = 0; x < bitmapWidth; x++) {
          const cssX = (x + 0.5) / scaleX;
          const col = Math.min(warpShifts.length - 2, Math.floor(cssX / ARTWORK_WARP.step));
          const colMix = Math.min(1, (cssX - col * ARTWORK_WARP.step) / ARTWORK_WARP.step);
          const shift = warpShifts[col] * (1 - colMix) + warpShifts[col + 1] * colMix;
          const sourceX = x - shift * scaleX;
          const left = Math.floor(sourceX);
          const mix = sourceX - left;
          const leftIndex = left >= 0 && left < bitmapWidth ? (pixelRowStart + left) * 4 : -1;
          const rightIndex = left + 1 >= 0 && left + 1 < bitmapWidth ? (pixelRowStart + left + 1) * 4 : -1;
          const leftAlpha = leftIndex < 0 ? 0 : source[leftIndex + 3] * (1 - mix);
          const rightAlpha = rightIndex < 0 ? 0 : source[rightIndex + 3] * mix;
          const alpha = leftAlpha + rightAlpha;
          const target = (pixelRowStart + x) * 4;
          output[target + 3] = alpha;
          if (alpha) {
            // Interpolate premultiplied color to avoid light or dark fringes at
            // the transparent edge of a scanline.
            for (let channel = 0; channel < 3; channel++) {
              output[target + channel] = ((leftIndex < 0 ? 0 : source[leftIndex + channel] * leftAlpha) +
                (rightIndex < 0 ? 0 : source[rightIndex + channel] * rightAlpha)) / alpha;
            }
          } else {
            output[target] = output[target + 1] = output[target + 2] = 0;
          }
        }
      }
      artworkCtx.putImageData(artworkFrame, 0, 0);
    }

    function sizeArtwork() {
      if (!artworkCtx || !artworkCanvas || !artworkSource || !artworkSourceCtx || !artworkImage || !container ||
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
      artworkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      artworkSource.width = artworkCanvas.width;
      artworkSource.height = artworkCanvas.height;
      artworkSourceCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      artworkSourceCtx.drawImage(artworkImage, 0, 0, artworkWidth, artworkHeight);
      artworkSourcePixels = artworkSourceCtx.getImageData(0, 0, artworkSource.width, artworkSource.height);
      artworkFrame = artworkCtx.createImageData(artworkSource.width, artworkSource.height);
      warpShifts = new Float32Array(Math.ceil(artworkWidth / ARTWORK_WARP.step) + 1);
      artworkIdle = true;
      drawArtwork(0, true);
      setArtworkReady(true);
    }

    function draw() {
      if (!ctx) return;
      const ink = dark ? '255,255,255' : '17,17,17';
      ctx.fillStyle = dark ? '#06070a' : '#f7f7f5';
      ctx.fillRect(0, 0, width, height);
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
            ctx.strokeStyle = 'rgba(' + ink + ',' + ((dark ? 0.12 : 0.095) + stress * 0.72) + ')';
            ctx.lineWidth = (0.85 + stress * 1.65) * weight;
            ctx.beginPath();
            ctx.moveTo(pixel(node.x), pixel(node.y));
            ctx.lineTo(pixel(next.x), pixel(next.y));
            ctx.stroke();
          }
        }
      }
      for (const node of nodes) {
        const active = node.tension > 0.16;
        if (node.tension > 0.25) {
          ctx.fillStyle = 'rgba(' + ink + ',' + node.tension * 0.13 + ')';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3 + node.tension * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(' + ink + ',' + (active ? 0.9 : 0.23) + ')';
        ctx.beginPath();
        ctx.arc(pixel(node.x), pixel(node.y), active ? 1.5 + node.tension * 1.8 : 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const pulse of pulses) {
        const a = nodes[pulse.from], b = nodes[pulse.to];
        if (!a || !b) continue;
        const travel = pulse.age / pulse.duration;
        const progress = travel * 0.88 + steppedProgress(travel, pulse.stops) * 0.12;
        const trail = Math.max(0, progress - 0.16);
        ctx.strokeStyle = 'rgba(' + ink + ',0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(a.x + (b.x - a.x) * trail, a.y + (b.y - a.y) * trail);
        ctx.lineTo(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
        ctx.stroke();
        ctx.fillStyle = dark ? '#fff' : '#111';
        ctx.beginPath();
        ctx.arc(pixel(a.x + (b.x - a.x) * progress), pixel(a.y + (b.y - a.y) * progress), 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (inspected >= 0 && clock - inspectedSince > 0.35) {
        const node = nodes[inspected];
        if (node) {
          ctx.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
          ctx.fillStyle = dark ? '#fff' : '#111';
          ctx.fillText(node.label, Math.max(6, Math.min(width - 40, node.x + 10)), Math.max(12, node.y - 10));
        }
      }
    }

    function step(dt: number) {
      clock += dt;
      waves = waves.filter((wave) => {
        wave.age += dt;
        return wave.age < MOTION.impulseDuration;
      });
      const pointer = pointerRef.current;
      let nearest = -1, nearestDistance = 18;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // Rest positions avoid feedback between the cursor and displaced points.
        const field = displacementAt({ x: node.baseX, y: node.baseY }, pointer, waves,
          Math.min(MOTION.pointerRadius, Math.min(width, height) * 0.3));
        node.x = approach(node.x, node.baseX + field.x, field.influence || field.waveTension ? MOTION.response : MOTION.recovery, dt);
        node.y = approach(node.y, node.baseY + field.y, field.influence || field.waveTension ? MOTION.response : MOTION.recovery, dt);
        node.tension = Math.min(1, Math.max(field.influence * 0.9, field.waveTension, node.tension - dt * 1.2));
        const visualDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
        if (visualDistance < nearestDistance) { nearest = i; nearestDistance = visualDistance; }
      }
      if (nearest !== inspected) { inspected = nearest; inspectedSince = clock; }
      pulses = pulses.filter((pulse) => {
        pulse.age += dt;
        if (pulse.age >= pulse.duration && nodes[pulse.to]) {
          nodes[pulse.to].tension = Math.max(nodes[pulse.to].tension, 0.3);
        }
        return pulse.age < pulse.duration;
      });
      if (clock >= nextPulse && clock >= quietUntil) {
        nextPulse = clock + randomBetween(MOTION.pulseInterval);
        if (pulses.length < MOTION.maxPulses && cols > 1 && rows > 1) {
          // Only choose links with both endpoints inside the visible canvas.
          const visibleCols = Math.max(1, Math.floor(width / spacing));
          const visibleRows = Math.max(1, Math.floor(height / spacing));
          const c = Math.floor(Math.random() * visibleCols);
          const r = Math.floor(Math.random() * visibleRows);
          const from = c * rows + r;
          const to = Math.random() < 0.5 ? from + rows : from + 1;
          if (nodes[to]) pulses.push({ from, to, age: 0, duration: randomBetween(MOTION.pulseDuration), stops: pulseStops() });
        }
      }
    }

    function animate(now: number) {
      frame = 0;
      if (!runningRef.current || !visible || document.hidden) return;
      const elapsed = Math.min((now - lastTime) / 1000, 0.1);
      accumulator += elapsed;
      artworkElapsed += elapsed;
      lastTime = now;
      let changed = false;
      while (accumulator >= MOTION.step) {
        step(MOTION.step);
        accumulator -= MOTION.step;
        changed = true;
      }
      if (changed) {
        draw();
        if (artworkElapsed >= 1 / 30) {
          drawArtwork(artworkElapsed);
          artworkElapsed = 0;
        }
      }
      frame = requestAnimationFrame(animate);
    }

    function syncLoop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = performance.now();
      accumulator = 0;
      artworkElapsed = 0;
      if (runningRef.current && visible && !document.hidden) frame = requestAnimationFrame(animate);
    }

    const resize = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spacing = Math.max(32, Math.min(MOTION.spacing, Math.min(width, height) / 4));
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
      nodes = Array.from({ length: cols * rows }, (_, i) => {
        const c = Math.floor(i / rows), r = i % rows;
        return { x: c * spacing, y: r * spacing, baseX: c * spacing, baseY: r * spacing,
          tension: 0, label: '0x' + ((c * 17 + r * 31) % 256).toString(16).padStart(2, '0').toUpperCase() };
      });
      pulses = [];
      waves = [];
      inspected = -1;
      nextPulse = clock + randomBetween(MOTION.pulseInterval);
      draw();
      sizeArtwork();
      syncLoop();
    });
    resize.observe(container);
    if (artworkImage) {
      resize.observe(artworkImage);
      artworkImage.addEventListener('load', sizeArtwork);
      if (artworkImage.complete) sizeArtwork();
    }

    function updateTheme() {
      const classes = document.documentElement.classList;
      dark = classes.contains('dark') || (!classes.contains('light') && theme.matches);
      draw();
    }
    theme.addEventListener('change', updateTheme);
    const themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    updateTheme();

    impulseRef.current = (x = width / 2, y = height / 2) => {
      if (!runningRef.current || clock - lastImpulse < 0.4) return;
      lastImpulse = clock;
      const radius = Math.min(MOTION.impulseRadius, Math.hypot(width, height) * 0.6);
      if (waves.length >= 3) waves.shift();
      waves.push({ x, y, age: 0, radius });
      quietUntil = clock + MOTION.quietTime;
      nextPulse = quietUntil + randomBetween(MOTION.pulseInterval);
    };

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncLoop();
    });
    visibility.observe(container);
    document.addEventListener('visibilitychange', syncLoop);
    // React state changes notify this effect without rebuilding the lattice.
    container.addEventListener('matrix-running-change', syncLoop);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      artworkImage?.removeEventListener('load', sizeArtwork);
      visibility.disconnect();
      themeObserver.disconnect();
      theme.removeEventListener('change', updateTheme);
      document.removeEventListener('visibilitychange', syncLoop);
      container.removeEventListener('matrix-running-change', syncLoop);
      impulseRef.current = () => {};
    };
  }, [reactiveArtwork]);

  useEffect(() => {
    containerRef.current?.dispatchEvent(new Event('matrix-running-change'));
  }, [isRunning]);

  function leave() { pointerRef.current = { x: -2000, y: -2000 }; }
  function move(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  return (
    <div ref={containerRef} className={cn('kinetic-matrix', className)}
      onPointerMove={move}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        move(event);
        impulseRef.current(pointerRef.current.x, pointerRef.current.y);
      }}
      onPointerUp={(event) => { if (event.pointerType !== 'mouse') leave(); }}
      onPointerLeave={leave} onPointerCancel={leave}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full cursor-crosshair" />
      <div className="matrix-title">
        <h2 className={cn('font-mono font-black tracking-tighter uppercase text-neutral-900 dark:text-white', titleArtwork && 'matrix-artwork-title')}
          aria-label={titleArtwork ? title : undefined}>
          {titleArtwork ? (
            <span className={cn('matrix-artwork-stack', reactiveArtwork && isRunning && artworkReady && 'is-reactive')}>
              <img ref={artworkRef} className="matrix-artwork" src={titleArtwork} alt="" aria-hidden="true" />
              {reactiveArtwork && <canvas ref={artworkCanvasRef} className="matrix-artwork-reactive" aria-hidden="true" />}
            </span>
          ) : title}
        </h2>
      </div>
    </div>
  );
}
export default KineticMatrix;
