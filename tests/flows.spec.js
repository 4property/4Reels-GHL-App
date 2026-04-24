import { test, expect } from '@playwright/test';

/**
 * Critical user flows. These exercise the integration points we care most
 * about NOT breaking: routing into the editor overlay, the hamburguesa
 * drawer on mobile, theme toggling, tab switching inside the editor.
 *
 * Each test is intentionally short — heavy unit-style assertions don't
 * belong in an E2E pre-deploy gate.
 */

test.describe('navigation', () => {
  test('opens a reel editor from the dashboard grid', async ({ page }) => {
    await page.goto('/reels');
    await page.locator('.reel-card').first().click();
    await expect(page).toHaveURL(/\/reels\/r_/);
    await expect(page.locator('.editor-overlay')).toBeVisible();
    await expect(page.locator('.editor-header-title')).toBeVisible();
  });

  test('editor tabs switch the active panel', async ({ page }) => {
    await page.goto('/reels/r_8831');
    await expect(page.locator('.editor-overlay')).toBeVisible();
    // Photos panel is the default
    await expect(page.getByText('Property photos')).toBeVisible();
    // Switch to Subtitles
    await page.locator('.editor-tabs .subtab', { hasText: 'Subtitles' }).click();
    await expect(page.getByText('AI-generated. Edit text and timing')).toBeVisible();
    // Switch to Voiceover
    await page.locator('.editor-tabs .subtab', { hasText: 'Voiceover' }).click();
    await expect(page.getByText('Record yourself narrating')).toBeVisible();
  });
});

test.describe('mobile hamburguesa', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('hamburguesa opens the drawer and navigates', async ({ page }) => {
    await page.goto('/reels');
    await page.locator('.topbar-burger').click();
    const drawer = page.locator('.mnav-panel');
    await expect(drawer).toBeVisible();
    // Page list contains all visible nav entries
    await expect(drawer.locator('.mnav-item', { hasText: 'Music' })).toBeVisible();
    // Navigate
    await drawer.locator('.mnav-item', { hasText: 'Music' }).click();
    await expect(drawer).toBeHidden();
    await expect(page).toHaveURL(/\/music$/);
  });

  test('escape closes the drawer', async ({ page }) => {
    await page.goto('/reels');
    await page.locator('.topbar-burger').click();
    await expect(page.locator('.mnav-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mnav-panel')).toBeHidden();
  });
});

test.describe('theme', () => {
  // The inline theme button is desktop-only; on tablet/mobile the toggle
  // moved to the drawer. Skip there — the drawer flow already covers that
  // path implicitly via mnav-item rendering.
  test('toggling theme flips the data-theme attribute', async ({ page, viewport }) => {
    test.skip(viewport.width <= 900, 'theme toggle lives inside the mobile drawer');
    await page.goto('/reels');
    const html = page.locator('html');
    const initial = await html.getAttribute('data-theme');
    await page.locator('button[title="Theme"]').first().click();
    const after = await html.getAttribute('data-theme');
    expect(after).not.toBe(initial);
  });
});

test.describe('permissions', () => {
  test('admin tab is reachable for the default Admin user', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
    await expect(page.getByText('Super-admin view over all agencies')).toBeVisible();
  });
});
