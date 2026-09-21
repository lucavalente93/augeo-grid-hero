// Seconds and CSS pixels. Shared tuning for every container proportion.
export const MOTION = {
  spacing: 58,
  step: 1 / 120,
  pointerRadius: 155,
  displacement: 32,
  response: 12,
  recovery: 6,
  maxPulses: 6,
  pulseInterval: [0.35, 0.8] as const,
  pulseDuration: [1.3, 2.1] as const,
  impulseRadius: 370,
  impulseDisplacement: 62,
  impulseDuration: 1.6,
  quietTime: 0.3,
};

// Monotonic convergence: no velocity to carry a point beyond its target.
export function approach(value: number, target: number, rate: number, dt: number) {
  const next = target + (value - target) * Math.exp(-rate * dt);
  return Math.abs(next - target) < 0.12 ? target : next;
}

export function randomBetween(range: readonly [number, number]) {
  return range[0] + Math.random() * (range[1] - range[0]);
}

// Unequal dwell times, generated once per pulse, keep its travel ordered.
export function pulseStops() {
  const weights = Array.from({ length: 12 }, () => 0.45 + Math.random() * 1.3);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let time = 0;
  return weights.map((weight) => (time += weight / total));
}

export function steppedProgress(progress: number, stops: number[]) {
  return stops.filter((stop) => progress >= stop).length / stops.length;
}
