import { test, expect } from '@playwright/test';

const desktopViewports = [
  [768, 600], [900, 600], [1024, 768], [1280, 720], [1366, 768],
  [1440, 900], [1920, 1080], [1920, 600], [2560, 720],
  [844, 390], [1440, 500], [1440, 501], [1440, 700], [1440, 701],
];

for (const colorScheme of ['light', 'dark'] as const) {
  test(`desktop continuation stays separate from the CTA as content and cue grow: ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    for (const [width, height] of desktopViewports) {
      await page.setViewportSize({ width, height });
      for (const variant of ['current', 'larger', 'replacement', 'expanded-copy'] as const) {
        await page.evaluate(variant => {
          document.getElementById('cue-layout-variant')?.remove();
          const style = document.createElement('style');
          style.id = 'cue-layout-variant';
          style.textContent = variant === 'larger'
            ? '.hero-page .scroll-cue { width: 80px; height: 160px; }'
            : variant === 'replacement'
              ? '.hero-page .scroll-cue { width: auto; height: auto; } .scroll-cue svg { display: none; } .scroll-cue::before { content: "Continue exploring the next chapter"; display: block; max-width: 12ch; padding: 24px 0; font-size: 24px; }'
              : variant === 'expanded-copy'
                ? ':root { font-size: 24px; } .hero-description { max-width: 22ch; }'
                : '';
          document.head.append(style);
        }, variant);
        const cta = (await page.locator('.hero-cta').boundingBox())!;
        const cue = (await page.locator('.scroll-cue').boundingBox())!;
        const hero = (await page.locator('.hero').boundingBox())!;
        const matrix = (await page.locator('.hero-matrix-panel').boundingBox())!;
        const context = `${width}x${height}, ${variant}`;
        expect(cue.y - (cta.y + cta.height), context).toBeGreaterThanOrEqual(32);
        expect(cue.x, context).toBe(cta.x);
        expect(cue.y + cue.height, context).toBeLessThanOrEqual(hero.y + hero.height);
        expect(cue.x + cue.width, context).toBeLessThanOrEqual(matrix.x);
        expect(matrix.height, context).toBeCloseTo(hero.height, 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth), context).toBe(width);
        if (variant === 'current' && [[1440, 900], [1920, 600], [844, 390]].some(size => size[0] === width && size[1] === height)) {
          await page.screenshot({ path: `test-results/hero-layout/${colorScheme}-${width}x${height}.png`, fullPage: true });
        }
      }
    }
  });
}
