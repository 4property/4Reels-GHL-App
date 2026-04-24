import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';

const BASE = 'http://localhost:5173';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'screenshots');

await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

const ROUTES = [
  { name: 'reels', path: '/reels' },
  { name: 'editor', path: '/reels/r_8831' },
  { name: 'music', path: '/music' },
  { name: 'social', path: '/social' },
  { name: 'brand', path: '/brand' },
  { name: 'defaults', path: '/defaults' },
  { name: 'automation', path: '/automation' },
];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const file = path.join(OUT, `${vp.name}-${route.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`captured ${file}`);
  }
  await ctx.close();
}

await browser.close();
