import { test, expect } from '@playwright/test';
import { ROUTES } from './routes.js';

/**
 * Visual regression. Each route × viewport gets a baseline screenshot
 * checked into git. Subsequent runs diff against the baseline; a >2%
 * pixel-ratio change fails the test (threshold set in playwright.config.js).
 *
 * Update baselines after intentional UI changes:
 *   npm run test:visual:update
 *
 * Animations and the caret are disabled at the project level so screenshots
 * are deterministic.
 */

/** Freeze every <video> on the page to its first frame so reel previews
 *  produce identical screenshots across runs. */
async function freezeVideos(page) {
  await page.evaluate(() => {
    document.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.currentTime = 0;
      v.removeAttribute('autoplay');
    });
  });
}

for (const route of ROUTES) {
  test(`visual: ${route.path}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await freezeVideos(page);
    // Give layout one frame to settle after pausing media.
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
}
