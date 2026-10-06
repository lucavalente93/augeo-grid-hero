import { test, expect } from '@playwright/test';
import { ARTWORK_WARP, approach, artworkShiftTargets, constrainArtworkShifts, MOTION, pulseStops, steppedProgress } from '../lib/matrix-motion';

test('landing: canvas draws, reduced motion freezes it, pointer works, explore cue is present', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ideias fortes, forma precisa.');
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
  await expect(page.getByRole('button', { name: 'Explore aqui' })).toBeVisible();
  await expect(page.locator('.explore svg')).toHaveCount(0);
  await expect(page.locator('.explore-label .explore-word')).toHaveText(['EXPLORE', 'AQUI']);
  expect(await page.evaluate(() => document.fonts.check('16px "Share Tech Mono"'))).toBe(true);
  await expect(page.getByRole('button', { name: 'Falar com a Augeo' })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('hero typography fits a short viewport and enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 600 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const intro = await page.locator('.intro').boundingBox();
  const explore = await page.locator('.explore').boundingBox();
  expect(explore!.y).toBeGreaterThan(intro!.y + intro!.height);

  await page.setViewportSize({ width: 320, height: 740 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  expect((await heading.boundingBox())!.height).toBeLessThan(350);
});

test('explore cue reaches the next section by keyboard and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const explore = page.getByRole('button', { name: 'Explore aqui' });
  await expect(explore.locator('.explore-scan')).toBeHidden();
  await page.evaluate(() => {
    const section = document.createElement('section');
    section.id = 'next-content';
    section.style.height = '500px';
    document.querySelector('main')!.append(section);
  });
  await explore.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(page.locator('#next-content')).toBeInViewport();
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
      const next = approach(position, 0, MOTION.recovery, dt);
      expect(next).toBeGreaterThanOrEqual(0);
      expect(next).toBeLessThanOrEqual(position);
      position = next;
    }
    expect(position).toBe(0);
  }
  const stops = pulseStops();
  expect(steppedProgress(0, stops)).toBe(0);
  expect(steppedProgress(stops[0] / 2, stops)).toBe(0);
  expect(steppedProgress(1.001, stops)).toBe(1);
});

test('lettering warp remains bounded and maps source x in increasing order', () => {
  const artwork = { x: 0, y: 0, width: 620, height: 134 };
  const check = (shifts: Float32Array) => {
    for (let col = 0; col < shifts.length; col++) {
      expect(Math.abs(shifts[col])).toBeLessThanOrEqual(ARTWORK_WARP.maxShift);
      if (col === 0) continue;
      expect(Math.abs(shifts[col] - shifts[col - 1])).toBeLessThanOrEqual(ARTWORK_WARP.maxNeighborDelta + 0.00001);
      const previousSourceX = (col - 1) * ARTWORK_WARP.step - shifts[col - 1];
      const sourceX = col * ARTWORK_WARP.step - shifts[col];
      expect(sourceX).toBeGreaterThan(previousSourceX);
    }
  };
  const center = artworkShiftTargets(artwork, { x: 60, y: 67 }, [], MOTION.pointerRadius);
  const lower = artworkShiftTargets(artwork, { x: 60, y: 190 }, [], MOTION.pointerRadius);
  expect(Math.max(...center.map(Math.abs))).toBeGreaterThan(Math.max(...lower.map(Math.abs)));
  check(center);
  check(lower);
  check(artworkShiftTargets(artwork, { x: -2000, y: -2000 },
    [{ x: 60, y: 67, age: 0.4, radius: MOTION.impulseRadius }], MOTION.pointerRadius));
  check(constrainArtworkShifts(new Float32Array([20, -20, 20, -20])));
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
  const bounds = await page.locator('.matrix-deck').boundingBox();
  expect(Math.round(bounds!.x + bounds!.width)).toBe(1440);
  expect(bounds!.y).toBe(0);
  expect(bounds!.width / 1440).toBeCloseTo(0.6);
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
    }
  }
  await context.close();
});

test('AUGEO artwork stays centered and follows light and dark themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  for (const [width, height] of [[1440, 900], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const deck = page.locator('.matrix-deck');
    const artwork = page.locator('.matrix-artwork');
    await expect(page.getByRole('heading', { name: 'AUGEO' })).toBeVisible();
    await expect(artwork).toHaveJSProperty('complete', true);
    const { deckBounds, artBounds, naturalWidth } = await artwork.evaluate((image) => ({
      deckBounds: image.closest('.matrix-deck')!.getBoundingClientRect().toJSON(),
      artBounds: image.getBoundingClientRect().toJSON(),
      naturalWidth: image.naturalWidth,
    }));
    expect(naturalWidth).toBeGreaterThan(0);
    expect(artBounds.width).toBeGreaterThan(width === 320 ? 250 : 600);
    expect(Math.abs((artBounds.x + artBounds.width / 2) - (deckBounds.x + deckBounds.width / 2))).toBeLessThan(1);
    expect(Math.abs((artBounds.y + artBounds.height / 2) - (deckBounds.y + deckBounds.height / 2))).toBeLessThan(1);
    await expect(artwork).toHaveCSS('filter', 'none');
    const lightCrt = await deck.locator('.kinetic-matrix').evaluate((element) => {
      const style = getComputedStyle(element, '::after');
      return { background: style.backgroundImage, pointerEvents: style.pointerEvents };
    });
    expect(lightCrt.background).toContain('repeating-linear-gradient');
    expect(lightCrt.pointerEvents).toBe('none');
    await page.screenshot({ path: `test-results/lettering-light-${width}.png`, fullPage: true });
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(artwork).toHaveCSS('filter', 'invert(1)');
    const darkCrt = await deck.locator('.kinetic-matrix').evaluate((element) => getComputedStyle(element, '::after').backgroundImage);
    expect(darkCrt).not.toBe(lightCrt.background);
    await page.screenshot({ path: `test-results/lettering-dark-${width}.png`, fullPage: true });
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(deck).toBeVisible();
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
  const rowInk = () => overlay.evaluate((canvas) => {
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
  const restingRows = await rowInk();
  expect(restingRows.filter((count) => count > 0).length).toBeGreaterThan(restingRows.length / 2);
  await page.screenshot({ path: 'test-results/lettering-reactive-rest.png', fullPage: true });
  const frame = () => overlay.evaluate((canvas) => canvas.toDataURL());
  const resting = await frame();
  await page.waitForTimeout(350);
  expect(await frame()).toBe(resting);

  const bounds = await stack.boundingBox();
  const x = bounds!.x + bounds!.width / 2;
  const y = bounds!.y + bounds!.height / 2;
  await page.mouse.move(x, y);
  await expect.poll(async () => (await frame()) === resting).toBe(false);
  expect((await rowInk()).map((count) => count > 0)).toEqual(restingRows.map((count) => count > 0));
  await page.screenshot({ path: 'test-results/lettering-reactive-hover.png', fullPage: true });
  await page.mouse.move(10, 110);
  await expect.poll(async () => (await frame()) === resting, { timeout: 3000 }).toBe(true);

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.up();
  await page.mouse.move(10, 110);
  await expect.poll(async () => (await frame()) === resting).toBe(false);
  expect((await rowInk()).map((count) => count > 0)).toEqual(restingRows.map((count) => count > 0));
  await expect.poll(async () => (await frame()) === resting, { timeout: 4000 }).toBe(true);

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(overlay).toHaveCSS('filter', 'invert(1)');
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

  const opening = () => overlay.evaluate((canvas) => {
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
  const restOpening = await opening();
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
    expect(await opening()).toEqual(restOpening);
    isolation = await page.addStyleTag({ content: isolationCSS });
    await stack.screenshot({ path: `test-results/lettering-a-${name}-dark.png` });
    await isolation.evaluate((style) => style.remove());
    await page.screenshot({ path: `test-results/hero-a-${name}-dark.png`, fullPage: true });
  }
  await page.mouse.move(10, 110);
  await expect.poll(async () => (await overlay.evaluate((canvas) => canvas.toDataURL())) === rest,
    { timeout: 3000 }).toBe(true);
});
