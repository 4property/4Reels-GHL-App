import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * Tests run against `vite preview` by default (the built production bundle
 * served from /dist) so we exercise what actually ships. To iterate on tests
 * against the dev server with HMR, run with PW_DEV=1.
 *
 *   npm run test:e2e            # against `vite preview` (built bundle)
 *   PW_DEV=1 npm run test:e2e   # against `vite` dev server
 */

const useDev = process.env.PW_DEV === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // One project per viewport. Each spec opts in via `test.describe` / project tags.
  // Chromium across all viewports keeps the install footprint small and the
  // suite fast. Add WebKit / Firefox projects later if cross-browser parity
  // becomes a goal — none of the styles are vendor-specific today.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 667 } } },
  ],

  // Visual diffs: be tolerant of subtle font-rendering noise across machines.
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },

  webServer: {
    command: useDev ? 'npm run dev -- --port 4173' : 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
