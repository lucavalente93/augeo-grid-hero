// Seconds and CSS pixels. Shared tuning for every container proportion.
export const MATRIX_MOTION = {
  spacing: 58,
  simulationStepSeconds: 1 / 120,
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

export interface MotionPoint { x: number; y: number }
export interface MotionWave extends MotionPoint { age: number; radius: number }

export const ARTWORK_WARP = {
  sampleSpacingPx: 8,
  scale: 0.10,
  maxShift: 6,
  maxNeighborDelta: 2,
} as const;

// One field drives both the lattice and the lettering. Each renderer chooses its
// own scale, so the letterforms remain readable while following the same wave.
export function displacementAt(
  point: MotionPoint,
  pointer: MotionPoint,
  waves: readonly MotionWave[],
  pointerRadius: number,
) {
  const dx = point.x - pointer.x, dy = point.y - pointer.y;
  const distance = Math.hypot(dx, dy);
  const influence = Math.max(0, 1 - distance / pointerRadius);
  let x = (distance ? dx / distance : 0) * MATRIX_MOTION.displacement * influence * influence;
  let y = (distance ? dy / distance : 0) * MATRIX_MOTION.displacement * influence * influence;
  let waveTension = 0;
  for (const wave of waves) {
    const wx = point.x - wave.x, wy = point.y - wave.y;
    const wd = Math.hypot(wx, wy);
    const waveProgress = wave.age / MATRIX_MOTION.impulseDuration;
    const band = Math.max(0, 1 - Math.abs(wd - wave.radius * waveProgress) / 80);
    const strength = Math.sin(band * Math.PI / 2) ** 2 *
      Math.min(1, wave.age / 0.16) * (1 - waveProgress * 0.65);
    x += (wd ? wx / wd : 0) * MATRIX_MOTION.impulseDisplacement * strength;
    y += (wd ? wy / wd : 0) * MATRIX_MOTION.impulseDisplacement * strength;
    waveTension = Math.max(waveTension, strength);
  }
  return { x, y, influence, waveTension };
}

// Sample the shared field once across the artwork's middle. Every scanline
// then uses the same horizontal map, so the letterforms cannot split by row.
export function artworkShiftTargets(
  artwork: { x: number; y: number; width: number; height: number },
  pointer: MotionPoint,
  waves: readonly MotionWave[],
  pointerRadius: number,
) {
  const shifts = new Float32Array(Math.ceil(artwork.width / ARTWORK_WARP.sampleSpacingPx) + 1);
  const sampleY = artwork.y + artwork.height / 2;
  for (let sampleIndex = 0; sampleIndex < shifts.length; sampleIndex++) {
    const field = displacementAt(
      { x: artwork.x + sampleIndex * ARTWORK_WARP.sampleSpacingPx, y: sampleY }, pointer, waves, pointerRadius,
    );
    shifts[sampleIndex] = field.x * ARTWORK_WARP.scale;
  }
  return constrainArtworkShifts(shifts);
}

// A two pixel limit over each eight pixel interval keeps x - shift(x)
// strictly increasing. Apply this to both targets and animated frames.
export function constrainArtworkShifts(shifts: Float32Array) {
  const { maxShift, maxNeighborDelta } = ARTWORK_WARP;
  for (let i = 0; i < shifts.length; i++) {
    shifts[i] = Math.max(-maxShift, Math.min(maxShift, shifts[i]));
  }
  for (let i = 1; i < shifts.length; i++) {
    shifts[i] = Math.max(shifts[i - 1] - maxNeighborDelta,
      Math.min(shifts[i - 1] + maxNeighborDelta, shifts[i]));
  }
  for (let i = shifts.length - 2; i >= 0; i--) {
    shifts[i] = Math.max(shifts[i + 1] - maxNeighborDelta,
      Math.min(shifts[i + 1] + maxNeighborDelta, shifts[i]));
  }
  return shifts;
}

// Monotonic convergence: no velocity to carry a point beyond its target.
export function approach(value: number, target: number, rate: number, dt: number) {
  const next = target + (value - target) * Math.exp(-rate * dt);
  return Math.abs(next - target) < 0.12 ? target : next;
}

export function randomBetween(range: readonly [number, number]) {
  return range[0] + Math.random() * (range[1] - range[0]);
}

// Unequal dwell times, generated once per pulse, keep its travel ordered.
export function createPulseProgressThresholds() {
  const weights = Array.from({ length: 12 }, () => 0.45 + Math.random() * 1.3);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let time = 0;
  return weights.map((weight) => (time += weight / total));
}

export function steppedProgress(progress: number, progressThresholds: number[]) {
  return progressThresholds.filter((stop) => progress >= stop).length / progressThresholds.length;
}
