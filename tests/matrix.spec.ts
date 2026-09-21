import { test, expect } from '@playwright/test';
import { approach, MOTION, pulseStops, steppedProgress } from '../lib/matrix-motion';

test('landing: canvas draws, pause freezes, run resumes, pointer works, CTA is a placeholder', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ideias fortes, forma precisa.');
  const canvas = page.locator('canvas');
  await expect.poll(() => canvas.evaluate((node) => node.width)).toBeGreaterThan(0);
  const snapshot = () => canvas.evaluate((node) => node.toDataURL());
  const initial = await snapshot();
  await expect.poll(snapshot).not.toBe(initial);
  await page.getByRole('button', { name: 'Pausar animação' }).click();
  await expect(page.getByRole('button', { name: 'Iniciar animação' })).toBeVisible();
  await page.waitForTimeout(100);
  const frozen = await snapshot();
  await page.screenshot({ path: 'test-results/landing-desktop.png', fullPage: true });
  await page.waitForTimeout(200);
  expect(await snapshot()).toBe(frozen);
  await expect(page.getByRole('button', { name: 'Disparar onda' })).toBeDisabled();
  await page.getByRole('button', { name: 'Iniciar animação' }).click();
  await expect.poll(snapshot).not.toBe(frozen);
  await page.getByRole('button', { name: 'Disparar onda' }).click();
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
  await expect(page.getByRole('button', { name: 'Falar com a Augeo' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('reduced motion stays static, survives resize, and follows explicit/system themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.goto('/?demo=matrix');
  await expect(page.getByRole('button', { name: 'Iniciar animação' })).toBeVisible();
  const canvas = page.locator('canvas');
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

test('matrix fits wide, square, tall and short containers while running and paused', async ({ page }) => {
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
    }, [width, height]);
    await expect.poll(() => matrix.locator('canvas').evaluate((node) => node.width)).toBe(width);
    const bounds = await matrix.boundingBox();
    const title = await matrix.getByRole('heading').boundingBox();
    expect(title!.width).toBeLessThan(bounds!.width);
    expect(title!.height).toBeLessThan(bounds!.height);
    await matrix.hover();
    await page.getByRole('button', { name: 'Pausar animação' }).click();
    await page.screenshot({ path: 'test-results/proportion-' + width + 'x' + height + '.png' });
    await page.getByRole('button', { name: 'Iniciar animação' }).click();
  }
  await page.goto('/');
  const bounds = await page.locator('.matrix-deck').boundingBox();
  expect(Math.round(bounds!.x + bounds!.width)).toBe(1440);
  expect(bounds!.y).toBe(0);
  expect(bounds!.width / 1440).toBeCloseTo(0.6);
});

test('small screens: both pages fit and touch controls work', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 740 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  for (const path of ['/', '/?demo=matrix']) {
    await page.goto('http://127.0.0.1:5173' + path);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Pausar animação' }).tap();
    await expect(page.getByRole('button', { name: 'Iniciar animação' })).toBeVisible();
    if (path === '/') await page.screenshot({ path: 'test-results/landing-mobile.png', fullPage: true });
    await page.getByRole('button', { name: 'Iniciar animação' }).tap();
    const bounds = await page.locator('canvas').boundingBox();
    await page.touchscreen.tap(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  }
  await context.close();
});
