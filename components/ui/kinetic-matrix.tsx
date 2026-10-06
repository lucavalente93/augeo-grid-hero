'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { MOTION, approach, randomBetween, pulseStops, steppedProgress } from '@/lib/matrix-motion';

interface MatrixNode {
  x: number; y: number; baseX: number; baseY: number;
  tension: number; label: string;
}
interface Pulse {
  from: number; to: number; age: number; duration: number; stops: number[];
}
interface Wave { x: number; y: number; age: number; radius: number }
export interface KineticMatrixProps {
  title?: string;
  titleArtwork?: string;
  animateArtwork?: boolean;
  className?: string;
}

export function KineticMatrix({ title = 'TOPOLOGY', titleArtwork, animateArtwork = false, className = '' }: KineticMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    let nodes: MatrixNode[] = [];
    let pulses: Pulse[] = [];
    let waves: Wave[] = [];
    let width = 0, height = 0, rows = 0, cols = 0, spacing = MOTION.spacing;
    let clock = 0, nextPulse = randomBetween(MOTION.pulseInterval), quietUntil = 0;
    let lastImpulse = -Infinity;
    let inspected = -1, inspectedSince = 0;
    let dark = false, visible = true;
    let frame = 0, accumulator = 0, lastTime = 0;
    const theme = window.matchMedia('(prefers-color-scheme: dark)');

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
        const dx = node.baseX - pointer.x, dy = node.baseY - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / Math.min(MOTION.pointerRadius, Math.min(width, height) * 0.3));
        const displacement = MOTION.displacement * influence * influence;
        let tx = node.baseX + (distance ? dx / distance : 0) * displacement;
        let ty = node.baseY + (distance ? dy / distance : 0) * displacement;
        let waveTension = 0;
        for (const wave of waves) {
          const wx = node.baseX - wave.x, wy = node.baseY - wave.y;
          const wd = Math.hypot(wx, wy);
          const age = wave.age / MOTION.impulseDuration;
          const band = Math.max(0, 1 - Math.abs(wd - wave.radius * age) / 80);
          const strength = Math.sin(band * Math.PI / 2) ** 2 *
            Math.min(1, wave.age / 0.16) * (1 - age * 0.65);
          tx += (wd ? wx / wd : 0) * MOTION.impulseDisplacement * strength;
          ty += (wd ? wy / wd : 0) * MOTION.impulseDisplacement * strength;
          waveTension = Math.max(waveTension, strength);
        }
        node.x = approach(node.x, tx, influence || waveTension ? MOTION.response : MOTION.recovery, dt);
        node.y = approach(node.y, ty, influence || waveTension ? MOTION.response : MOTION.recovery, dt);
        node.tension = Math.min(1, Math.max(influence * 0.9, waveTension, node.tension - dt * 1.2));
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
      accumulator += Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      let changed = false;
      while (accumulator >= MOTION.step) {
        step(MOTION.step);
        accumulator -= MOTION.step;
        changed = true;
      }
      if (changed) draw();
      frame = requestAnimationFrame(animate);
    }

    function syncLoop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = performance.now();
      accumulator = 0;
      if (runningRef.current && visible && !document.hidden) frame = requestAnimationFrame(animate);
    }

    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
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
      syncLoop();
    });
    resize.observe(container);

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
      visibility.disconnect();
      themeObserver.disconnect();
      theme.removeEventListener('change', updateTheme);
      document.removeEventListener('visibilitychange', syncLoop);
      container.removeEventListener('matrix-running-change', syncLoop);
      impulseRef.current = () => {};
    };
  }, []);

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
            <span className="matrix-artwork-stack">
              <img className="matrix-artwork" src={titleArtwork} alt="" aria-hidden="true" />
              {animateArtwork && (
                <>
                  <img className="matrix-artwork-echo matrix-artwork-echo--top" src={titleArtwork} alt="" aria-hidden="true" />
                  <img className="matrix-artwork-echo matrix-artwork-echo--middle" src={titleArtwork} alt="" aria-hidden="true" />
                  <img className="matrix-artwork-echo matrix-artwork-echo--bottom" src={titleArtwork} alt="" aria-hidden="true" />
                </>
              )}
            </span>
          ) : title}
        </h2>
      </div>
    </div>
  );
}
export default KineticMatrix;
