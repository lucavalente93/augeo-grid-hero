import { test, expect } from '@playwright/test';
import { ARTWORK_WARP, approach, artworkShiftTargets, constrainArtworkShifts, MATRIX_MOTION, createPulseProgressThresholds, steppedProgress } from '../lib/matrix-motion';

test('landing: canvas draws, reduced motion freezes it, pointer works, triangles are present without EXPLORE', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Presença digital com direção.');
  const canvas = page.locator('.kinetic-matrix > canvas');
  await expect.poll(() => canvas.evaluate((node) => node.width)).toBeGreaterThan(0);
  const snapshot = () => canvas.evaluate((node) => node.toDataURL());
  const initial = await snapshot();
  await expect.poll(snapshot).not.toBe(initial);
  await expect(page.locator('.kinetic-matrix button')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(100);
  const frozen = await snapshot();
  await page.screenshot({ path: 'test-results/landing-desktop.png', fullPage: true });
  await page.waitForTimeout(200);
  expect(await snapshot()).toBe(frozen);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(snapshot).not.toBe(frozen);
  const bounds = await canvas.boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await page.mouse.move(10, 110);
  await page.waitForTimeout(800);
  const settled = await snapshot();
  await page.waitForTimeout(350);
  expect(await snapshot()).not.toBe(settled);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await page.screenshot({ path: 'test-results/landing-desktop.png', fullPage: true });
  await expect(page.locator('.explore')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Explore' })).toHaveCount(0);
  await expect(page.locator('.scroll-cue')).toBeVisible();
  await expect(page.getByText('EXPLORE', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.fonts.check('620 20px "Hanken Grotesk"'))).toBe(true);
  await expect(page.getByRole('button', { name: 'Falar com a Augeo' })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('symbol and copy align with the triangles at their existing lateral position', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const [width, height] of [[1440, 900], [900, 600], [768, 600], [844, 390]]) {
    await page.setViewportSize({ width, height });
    const cue = (await page.locator('.scroll-cue').boundingBox())!;
    const heading = (await page.locator('#hero-title').boundingBox())!;
    expect(cue.width).toBe(36);
    expect(cue.height).toBe(63);
    expect(cue.y + cue.height).toBeLessThanOrEqual(height);
    const brand = (await page.locator('.brand').boundingBox())!;
    const descriptionBounds = (await page.locator('.hero-description').boundingBox())!;
    const cta = (await page.locator('.hero-cta').boundingBox())!;
    expect(heading.x).toBeCloseTo(cue.x, 1);
    expect(descriptionBounds.x).toBeCloseTo(cue.x, 1);
    expect(brand.x).toBeCloseTo(cue.x, 1);
    expect(cta.x).toBeCloseTo(cue.x, 1);
    await expect(page.locator('.scroll-cue path')).toHaveCount(2);
    await expect(page.locator('.explore')).toHaveCount(0);
  }
});

test('hero typography fits mobile with enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  expect((await heading.boundingBox())!.width).toBeLessThanOrEqual(280);
  const descriptionBounds = (await page.locator('.hero-description').boundingBox())!;
  const matrix = (await page.locator('.hero-matrix-panel').boundingBox())!;
  expect(matrix.y).toBeGreaterThan(descriptionBounds.y + descriptionBounds.height);
});

test('mobile matrix spans the lower panel below the CTA and shows the whole signature above the fold', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    for (const [width, height] of [[390, 844], [320, 740], [320, 600]]) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.matrix-artwork')).toHaveJSProperty('complete', true);
      const matrixPanel = (await page.locator('.hero-matrix-panel').boundingBox())!;
      const artwork = (await page.locator('.matrix-artwork').boundingBox())!;
      const descriptionBounds = (await page.locator('.hero-description').boundingBox())!;
      const cta = (await page.locator('.hero-cta').boundingBox())!;
      expect(matrixPanel.x).toBe(0);
      expect(cta.y).toBeGreaterThan(descriptionBounds.y + descriptionBounds.height);
      expect(matrixPanel.y).toBeGreaterThan(cta.y + cta.height);
      expect(artwork.y + artwork.height).toBeLessThanOrEqual(height);
      expect(artwork.x).toBeGreaterThanOrEqual(matrixPanel.x);
      expect(artwork.x + artwork.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
  }
});

test('reduced motion stays static, survives resize, and follows explicit/system themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('/?demo=matrix');
  await expect(page.locator('.kinetic-matrix button')).toHaveCount(0);
  const canvas = page.locator('.kinetic-matrix > canvas');
  const background = () => canvas.evaluate((node) => Array.from(node.getContext('2d')!.getImageData(5, 5, 1, 1).data));
  await expect.poll(background).toEqual([247, 247, 245, 255]);
  const lightTitleColor = await page.getByRole('heading', { name: 'TOPOLOGY' }).evaluate((node) => getComputedStyle(node).color);
  const frozen = await canvas.evaluate((node) => node.toDataURL());
  await page.waitForTimeout(200);
  expect(await canvas.evaluate((node) => node.toDataURL())).toBe(frozen);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => canvas.evaluate((node) => node.width)).toBeLessThan(400);
  await expect.poll(background).toEqual([247, 247, 245, 255]);
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect.poll(background).toEqual([6, 7, 10, 255]);
  await expect(page.getByRole('heading', { name: 'TOPOLOGY' })).toHaveCSS('color', 'rgb(255, 255, 255)');
  await page.screenshot({ path: 'test-results/demo-dark-mobile.png', fullPage: true });
  await page.evaluate(() => document.documentElement.classList.add('light'));
  await expect.poll(background).toEqual([247, 247, 245, 255]);
  await expect(page.getByRole('heading', { name: 'TOPOLOGY' })).toHaveCSS('color', lightTitleColor);
});

test('return is monotonic without rebound; stepped pulses hold position', () => {
  for (const dt of [1 / 24, 1 / 60, 1 / 144]) {
    let position = 34;
    for (let i = 0; i < Math.ceil(2 / dt); i++) {
      const next = approach(position, 0, MATRIX_MOTION.recovery, dt);
      expect(next).toBeGreaterThanOrEqual(0);
      expect(next).toBeLessThanOrEqual(position);
      position = next;
    }
    expect(position).toBe(0);
  }
  const progressThresholds = createPulseProgressThresholds();
  expect(steppedProgress(0, progressThresholds)).toBe(0);
  expect(steppedProgress(progressThresholds[0] / 2, progressThresholds)).toBe(0);
  expect(steppedProgress(1.001, progressThresholds)).toBe(1);
});

test('lettering warp remains bounded and maps source x in increasing order', () => {
  const artwork = { x: 0, y: 0, width: 620, height: 134 };
  const expectBoundedMonotonicShifts = (shifts: Float32Array) => {
    for (let col = 0; col < shifts.length; col++) {
      expect(Math.abs(shifts[col])).toBeLessThanOrEqual(ARTWORK_WARP.maxShift);
      if (col === 0) continue;
      expect(Math.abs(shifts[col] - shifts[col - 1])).toBeLessThanOrEqual(ARTWORK_WARP.maxNeighborDelta + 0.00001);
      const previousSourceX = (col - 1) * ARTWORK_WARP.sampleSpacingPx - shifts[col - 1];
      const sourceX = col * ARTWORK_WARP.sampleSpacingPx - shifts[col];
      expect(sourceX).toBeGreaterThan(previousSourceX);
    }
  };
  const center = artworkShiftTargets(artwork, { x: 60, y: 67 }, [], MATRIX_MOTION.pointerRadius);
  const lower = artworkShiftTargets(artwork, { x: 60, y: 190 }, [], MATRIX_MOTION.pointerRadius);
  expect(Math.max(...center.map(Math.abs))).toBeGreaterThan(Math.max(...lower.map(Math.abs)));
  expectBoundedMonotonicShifts(center);
  expectBoundedMonotonicShifts(lower);
  expectBoundedMonotonicShifts(artworkShiftTargets(artwork, { x: -2000, y: -2000 },
    [{ x: 60, y: 67, age: 0.4, radius: MATRIX_MOTION.impulseRadius }], MATRIX_MOTION.pointerRadius));
  expectBoundedMonotonicShifts(constrainArtworkShifts(new Float32Array([20, -20, 20, -20])));
});

test('matrix fits wide, square, tall and short containers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?demo=matrix');
  const matrix = page.locator('.kinetic-matrix');
  for (const [width, height] of [[1000, 260], [500, 500], [280, 720], [600, 140]]) {
    await matrix.evaluate((element, size) => {
      const parent = element.parentElement!;
      parent.style.width = size[0] + 'px';
      parent.style.height = size[1] + 'px';
      parent.style.maxWidth = 'none';
      parent.style.border = '0';
      parent.style.flexShrink = '0';
    }, [width, height]);
    await expect.poll(() => matrix.evaluate((element) => {
      const canvas = element.querySelector(':scope > canvas')!;
      return Math.abs(canvas.width - Math.round(element.getBoundingClientRect().width * Math.min(devicePixelRatio || 1, 2)));
    })).toBe(0);
    const bounds = await matrix.boundingBox();
    const title = await matrix.getByRole('heading').boundingBox();
    expect(title!.width).toBeLessThan(bounds!.width);
    expect(title!.height).toBeLessThan(bounds!.height);
    await page.screenshot({ path: 'test-results/proportion-' + width + 'x' + height + '.png' });
  }
  await page.goto('/');
  const bounds = await page.locator('.hero-matrix-panel').boundingBox();
  expect(Math.round(bounds!.x + bounds!.width)).toBe(1440);
  expect(bounds!.y).toBe(0);
  expect(bounds!.width / 1440).toBeCloseTo(0.56);
});

test('small screens: both pages fit and touch interaction works', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  for (const path of ['/', '/?demo=matrix']) {
    await page.goto('http://127.0.0.1:5173' + path);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator('.kinetic-matrix button')).toHaveCount(0);
    if (path === '/') await page.screenshot({ path: 'test-results/landing-mobile.png', fullPage: true });
    await page.locator('.kinetic-matrix').scrollIntoViewIfNeeded();
    const bounds = await page.locator('.kinetic-matrix > canvas').boundingBox();
    const artwork = path === '/' ? page.locator('.matrix-artwork-reactive') : null;
    if (artwork) await expect(page.locator('.matrix-artwork-stack')).toHaveClass(/is-reactive/);
    const resting = artwork ? await artwork.evaluate((canvas) => canvas.toDataURL()) : null;
    let tapX = bounds!.x + bounds!.width / 2;
    let tapY = bounds!.y + bounds!.height / 2;
    if (artwork) {
      const artBounds = await page.locator('.matrix-artwork-stack').boundingBox();
      tapX = artBounds!.x + artBounds!.width * 62 / 584;
      tapY = artBounds!.y + artBounds!.height * (116 - 11) / 126;
      await page.mouse.move(tapX, tapY);
      await expect.poll(async () => (await artwork.evaluate((canvas) => canvas.toDataURL())) === resting).toBe(false);
      await page.locator('.matrix-artwork-stack').screenshot({ path: 'test-results/lettering-a-mobile-hover.png' });
      await page.mouse.move(0, 0);
      await expect.poll(async () => (await artwork.evaluate((canvas) => canvas.toDataURL())) === resting,
        { timeout: 3000 }).toBe(true);
    }
    await page.touchscreen.tap(tapX, tapY);
    if (artwork) {
      await expect.poll(async () => (await artwork.evaluate((canvas) => canvas.toDataURL())) === resting).toBe(false);
      await page.locator('.matrix-artwork-stack').screenshot({ path: 'test-results/lettering-a-mobile-tap.png' });
      await expect.poll(async () => (await artwork.evaluate((canvas) => canvas.toDataURL())) === resting,
        { timeout: 4000 }).toBe(true);
      await page.emulateMedia({ colorScheme: 'dark' });
      await expect(artwork).toHaveCSS('opacity', '0.88');
      await page.touchscreen.tap(tapX, tapY);
      await expect.poll(async () => (await artwork.evaluate((canvas) => canvas.toDataURL())) === resting).toBe(false);
      await page.screenshot({ path: 'test-results/lettering-dark-mobile-tap.png', fullPage: true });
    }
  }
  await context.close();
});

test('AUGEO artwork aligns with the desktop headline, centers on mobile, and follows themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  for (const [width, height] of [[1440, 900], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const matrixPanel = page.locator('.hero-matrix-panel');
    const artwork = page.locator('.matrix-artwork');
    await expect(page.getByRole('heading', { name: 'AUGEO' })).toBeVisible();
    await expect(artwork).toHaveJSProperty('complete', true);
    const { matrixPanelBounds, artBounds, naturalWidth } = await artwork.evaluate((image) => ({
      matrixPanelBounds: image.closest('.hero-matrix-panel')!.getBoundingClientRect().toJSON(),
      artBounds: image.getBoundingClientRect().toJSON(),
      naturalWidth: image.naturalWidth,
    }));
    expect(naturalWidth).toBeGreaterThan(0);
    expect(artBounds.width).toBeGreaterThan(width === 320 ? 190 : 630);
    expect(Math.abs((artBounds.x + artBounds.width / 2) - (matrixPanelBounds.x + matrixPanelBounds.width / 2))).toBeLessThan(1);
    await expect.poll(async () => {
      const currentArt = (await artwork.boundingBox())!;
      const alignmentBounds = width === 320 ? (await matrixPanel.boundingBox())! : (await page.locator('#hero-title').boundingBox())!;
      return Math.abs(currentArt.y + currentArt.height / 2 - alignmentBounds.y - alignmentBounds.height / 2);
    }).toBeLessThan(1);
    await expect(artwork).toHaveCSS('filter', 'none');
    await expect(artwork).toHaveCSS('opacity', '1');
    const lightCrt = await matrixPanel.locator('.kinetic-matrix').evaluate((element) => {
      const style = getComputedStyle(element, '::after');
      return { background: style.backgroundImage, pointerEvents: style.pointerEvents };
    });
    expect(lightCrt.background).toContain('repeating-linear-gradient');
    expect(lightCrt.pointerEvents).toBe('none');
    await page.screenshot({ path: `test-results/lettering-light-${width}.png`, fullPage: true });
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(artwork).toHaveCSS('filter', 'invert(1)');
    await expect(artwork).toHaveCSS('opacity', '0.88');
    const darkCrt = await matrixPanel.locator('.kinetic-matrix').evaluate((element) => getComputedStyle(element, '::after').backgroundImage);
    expect(darkCrt).not.toBe(lightCrt.background);
    await page.screenshot({ path: `test-results/lettering-dark-${width}.png`, fullPage: true });
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(matrixPanel).toBeVisible();
  }
});

test('AUGEO lettering shares pointer and click motion, then returns to rest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.addStyleTag({ content: '.kinetic-matrix > canvas, .kinetic-matrix::after { visibility: hidden !important; }' });
  const stack = page.locator('.matrix-artwork-stack');
  const overlay = page.locator('.matrix-artwork-reactive');
  await expect(stack).toHaveClass(/is-reactive/);
  await expect(overlay).toBeVisible();
  await expect(page.locator('.matrix-artwork')).toBeHidden();
  const countOpaquePixelsByRow = () => overlay.evaluate((canvas) => {
    const { width, height } = canvas;
    const data = canvas.getContext('2d')!.getImageData(0, 0, width, height).data;
    const rows: number[] = [];
    for (let y = 0; y < height; y++) {
      let count = 0;
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 128) count++;
      }
      rows.push(count);
    }
    return rows;
  });
  const restingRows = await countOpaquePixelsByRow();
  expect(restingRows.filter((count) => count > 0).length).toBeGreaterThanOrEqual(restingRows.length / 2);
  await page.screenshot({ path: 'test-results/lettering-reactive-rest.png', fullPage: true });
  const readArtworkFrame = () => overlay.evaluate((canvas) => canvas.toDataURL());
  const resting = await readArtworkFrame();
  await page.waitForTimeout(350);
  expect(await readArtworkFrame()).toBe(resting);

  const bounds = await stack.boundingBox();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;
  await page.mouse.move(x, y);
  await expect.poll(async () => (await readArtworkFrame()) === resting).toBe(false);
  expect((await countOpaquePixelsByRow()).map((count) => count > 0)).toEqual(restingRows.map((count) => count > 0));
  await page.screenshot({ path: 'test-results/lettering-reactive-hover.png', fullPage: true });
  await page.mouse.move(10, 110);
  await expect.poll(async () => (await readArtworkFrame()) === resting, { timeout: 3000 }).toBe(true);

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.up();
  await page.mouse.move(10, 110);
  await expect.poll(async () => (await readArtworkFrame()) === resting).toBe(false);
  expect((await countOpaquePixelsByRow()).map((count) => count > 0)).toEqual(restingRows.map((count) => count > 0));
  await expect.poll(async () => (await readArtworkFrame()) === resting, { timeout: 4000 }).toBe(true);

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(overlay).toHaveCSS('filter', 'invert(1)');
  await expect(overlay).toHaveCSS('opacity', '0.88');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(overlay).toBeHidden();
  await expect(page.locator('.matrix-artwork')).toBeVisible();
  const staticFrame = await stack.screenshot();
  await page.mouse.move(x, y);
  await page.mouse.click(x, y);
  await page.waitForTimeout(300);
  expect((await stack.screenshot()).equals(staticFrame)).toBe(true);
});

test('A opening stays clear while its stem and counter react in the dark hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference', colorScheme: 'dark' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const stack = page.locator('.matrix-artwork-stack');
  const overlay = page.locator('.matrix-artwork-reactive');
  await expect(stack).toHaveClass(/is-reactive/);

  const measureAOpening = () => overlay.evaluate((canvas) => {
    const { width, height } = canvas;
    const data = canvas.getContext('2d')!.getImageData(0, 0, width, height).data;
    let rows = 0, openRows = 0;
    for (let y = Math.ceil((104 - 11) / 126 * height); y < Math.floor((126 - 11) / 126 * height); y++) {
      let runs = 0, inInk = false;
      for (let x = Math.floor(10 / 584 * width); x < Math.ceil(115 / 584 * width); x++) {
        const ink = data[(y * width + x) * 4 + 3] > 128;
        if (ink && !inInk) runs++;
        inInk = ink;
      }
      if (runs) {
        rows++;
        if (runs === 2) openRows++;
      }
    }
    return { rows, openRows };
  });

  const rest = await overlay.evaluate((canvas) => canvas.toDataURL());
  const isolationCSS = '.kinetic-matrix { background: #06070a !important; } .kinetic-matrix > canvas, .kinetic-matrix::after { visibility: hidden !important; }';
  let isolation = await page.addStyleTag({ content: isolationCSS });
  await stack.screenshot({ path: 'test-results/lettering-a-rest-dark.png' });
  await isolation.evaluate((style) => style.remove());
  const restOpening = await measureAOpening();
  expect(restOpening.rows).toBeGreaterThan(8);
  expect(restOpening.openRows).toBe(restOpening.rows);
  const bounds = await stack.boundingBox();
  for (const [name, svgX, svgY] of [
    ['stem', 27, 116],
    ['counter', 62, 116],
  ] as const) {
    await page.mouse.move(bounds!.x + bounds!.width * svgX / 584,
      bounds!.y + bounds!.height * (svgY - 11) / 126);
    await expect.poll(async () => (await overlay.evaluate((canvas) => canvas.toDataURL())) === rest).toBe(false);
    await page.waitForTimeout(350);
    expect(await measureAOpening()).toEqual(restOpening);
    isolation = await page.addStyleTag({ content: isolationCSS });
    await stack.screenshot({ path: `test-results/lettering-a-${name}-dark.png` });
    await isolation.evaluate((style) => style.remove());
    await page.screenshot({ path: `test-results/hero-a-${name}-dark.png`, fullPage: true });
  }
  await page.mouse.move(10, 110);
  await expect.poll(async () => (await overlay.evaluate((canvas) => canvas.toDataURL())) === rest,
    { timeout: 3000 }).toBe(true);
});
