import { test, expect } from '@playwright/test';

test('cue keeps contrasting after the introduction and becomes static with reduced motion', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/');
  const cue=page.locator('.scroll-cue');
  const states=()=>cue.evaluate(n=>n.getAnimations({subtree:true}).map(a=>a.playState));
  await expect.poll(states).toEqual(['running','running']);
  const timing=await cue.evaluate(n=>n.getAnimations({subtree:true}).map(a=>a.effect!.getTiming()));
  expect(timing.map(t=>[t.duration,t.delay,t.iterations])).toEqual([[5600,300,Infinity],[5600,1280,Infinity]]);
  const before=await cue.boundingBox();
  await cue.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>a.currentTime=840));
  expect(await cue.boundingBox()).toEqual(before);
  expect(await cue.locator('path').first().evaluate(n=>getComputedStyle(n).transform)).toBe('none');
  await cue.evaluate(n=>n.getAnimations({subtree:true}).forEach(a=>{a.currentTime=3600;a.play();}));
  await expect.poll(states).toEqual(['running','running']);
  const fills = () => cue.locator('path').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fill));
  const ongoing = await fills();
  await expect.poll(fills).not.toEqual(ongoing);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(states).toEqual([]);
  await expect(cue.locator('path').first()).toHaveCSS('fill','rgb(97, 97, 93)');
  await expect(cue.locator('path').last()).toHaveCSS('fill','rgb(97, 97, 93)');
});

test('offscreen and hidden-document suspension resumes elapsed animation time', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await page.addStyleTag({content:'body {padding-bottom:200vh;}'});
  const cue=page.locator('.scroll-cue');
  const states=()=>cue.evaluate(n=>n.getAnimations({subtree:true}).map(a=>a.playState));
  await expect.poll(states).toEqual(['running','running']);
  await page.evaluate(()=>window.scrollTo(0,1200));
  await expect.poll(states).toEqual(['paused','paused']);
  const times=()=>cue.evaluate(n=>n.getAnimations({subtree:true}).map(a=>Number(a.currentTime)));
  const paused=await times(); await page.waitForTimeout(150);
  expect(await times()).toEqual(paused);
  await page.evaluate(()=>window.scrollTo(0,0));
  await expect.poll(states).toEqual(['running','running']);
  expect((await times())[0]).toBeGreaterThanOrEqual(paused[0]);
  // Test the visibility handler deterministically; real OS tab switching is a
  // separate manual verification, not implied by this synthetic state.
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(states).toEqual(['paused','paused']);
  const hidden=await times(); await page.waitForTimeout(150); expect(await times()).toEqual(hidden);
  await page.evaluate(()=>{Reflect.deleteProperty(document,'hidden');document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(states).toEqual(['running','running']);
  expect((await times())[0]).toBeGreaterThanOrEqual(hidden[0]);
});

for (const colorScheme of ['light', 'dark'] as const) {
  for (const [width, height] of [[1440, 900], [900, 600], [768, 600], [844, 390]]) {
    test(`overlapping cue contrast descends and rests: ${colorScheme} ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme, reducedMotion: 'no-preference' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      const cue = page.locator('.scroll-cue');
      await expect.poll(() => cue.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(2);
      await expect(cue).toHaveAttribute('aria-hidden', 'true');
      expect(await cue.evaluate(node => node.tabIndex)).toBe(-1);
      await expect(cue.locator('a, button, [tabindex]')).toHaveCount(0);
      const bounds = (await cue.boundingBox())!;
      const triangles = await cue.locator('path').evaluateAll(nodes => nodes.map(node => {
        const box = (node as SVGGraphicsElement).getBBox();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      }));
      expect(triangles).toEqual([
        { x: 0, y: 6, width: 24, height: 18 },
        { x: 0, y: 18, width: 24, height: 18 },
      ]);
      expect(triangles[0].y + triangles[0].height - triangles[1].y).toBe(6);
      expect((42 - (triangles[1].y + triangles[1].height - triangles[0].y)) / 2).toBe(6);
      const lightPeak = 'rgb(226, 226, 223)';
      const darkPeak = 'rgb(32, 32, 31)';
      const rest = colorScheme === 'light' ? 'rgb(97, 97, 93)' : 'rgb(158, 158, 162)';
      for (const [phase, time, leading, peak] of [
        ['upper', 860, 0, lightPeak], ['lower', 1840, 1, darkPeak],
        ['rest', 2700, -1, rest],
        ['alternate-upper', 3660, 0, darkPeak], ['alternate-lower', 4640, 1, lightPeak],
        ['repeat-upper', 6460, 0, lightPeak], ['repeat-lower', 7440, 1, darkPeak],
      ] as const) {
        await cue.evaluate((node, time) => node.getAnimations({ subtree: true }).forEach(animation => {
          animation.pause();
          animation.currentTime = time;
        }), time);
        const fills = await cue.locator('path').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fill));
        if (leading === -1) expect(fills).toEqual([rest, rest]);
        else {
          expect(fills[leading]).toBe(peak);
          expect(fills[1 - leading]).toBe(rest);
          // The upper tip lies inside the lower triangle. Hit testing that
          // shared ink proves the active triangle is painted above its sibling.
          const paintedTriangle = await cue.evaluate(node => {
            const bounds = node.getBoundingClientRect();
            const hit = document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + 32);
            return Array.from(node.querySelectorAll('path')).indexOf(hit as SVGPathElement);
          });
          expect(paintedTriangle).toBe(leading);
        }
        expect(bounds.width).toBe(36);
        expect(bounds.height).toBe(63);
        expect(await cue.boundingBox()).toEqual(bounds);
        for (const path of await cue.locator('path').all()) await expect(path).toHaveCSS('transform', 'none');
        await page.screenshot({ path: `test-results/scroll-cue/${colorScheme}-${width}x${height}-${phase}.png` });
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect.poll(() => cue.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
      for (const path of await cue.locator('path').all()) await expect(path).toHaveCSS('fill', rest);
      const staticCue = await cue.screenshot();
      await cue.click();
      await page.waitForTimeout(150);
      expect((await cue.screenshot()).equals(staticCue)).toBe(true);
      expect(await page.evaluate(() => location.hash)).toBe('');
      expect(errors).toEqual([]);
    });
  }
  test(`mobile cue remains hidden: ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    for (const [width, height] of [[390, 844], [320, 740], [320, 600]]) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await expect(page.locator('.scroll-cue')).toBeHidden();
      expect(await page.locator('.scroll-cue').evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
      await page.screenshot({ path: `test-results/scroll-cue/${colorScheme}-${width}x${height}-mobile.png` });
    }
  });
}
