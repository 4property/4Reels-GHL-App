import { test, expect } from '@playwright/test';
import { ROUTES } from './routes.js';

/**
 * Smoke tests — for every route, in every viewport project:
 *  - the page loads (no navigation error)
 *  - no console errors are emitted during initial render
 *  - no failed network requests for same-origin assets
 *  - the hamburguesa is visible on tablet/mobile, hidden on desktop
 */

const isMobileViewport = (project) => project === 'tablet' || project === 'mobile';

for (const route of ROUTES) {
  test.describe(`smoke: ${route.path}`, () => {
    test('renders without console errors or 404s', async ({ page }, testInfo) => {
      const consoleErrors = [];
      const failedRequests = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));
      page.on('requestfailed', (req) => {
        // Ignore beacons / analytics / aborted nav (harness can cancel them)
        if (req.failure()?.errorText.match(/aborted|cancelled/i)) return;
        failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
      });

      const response = await page.goto(route.path, { waitUntil: 'networkidle' });
      expect(response?.status(), 'navigation status').toBeLessThan(400);

      // Wait a beat for any post-mount async (useApi for /me, /reels, etc.)
      await page.waitForTimeout(300);

      expect(consoleErrors, 'console errors').toEqual([]);
      expect(failedRequests, 'failed requests').toEqual([]);

      // Topbar present
      await expect(page.locator('.topbar')).toBeVisible();

      // Hamburguesa visibility matches viewport
      const burger = page.locator('.topbar-burger');
      if (isMobileViewport(testInfo.project.name)) {
        await expect(burger).toBeVisible();
      } else {
        await expect(burger).toBeHidden();
      }
    });
  });
}
