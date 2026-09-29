import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const dir = 'reference';
await mkdir(dir + '/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('https://www.fritzkeene.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: dir + '/screenshots/original-desktop.png', fullPage: true });
  await writeFile(dir + '/original.html', await page.content());
  const inventory = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    text: document.body.innerText,
    headings: [...document.querySelectorAll('h1,h2,h3')].map(el => ({ text: el.textContent.trim(), tag: el.tagName, font: getComputedStyle(el).fontFamily, size: getComputedStyle(el).fontSize, color: getComputedStyle(el).color })),
    links: [...document.querySelectorAll('a[href]')].map(el => ({ text: el.textContent.trim(), href: el.href })),
    images: [...document.images].map(el => ({ src: el.currentSrc || el.src || el.getAttribute('data-src'), alt: el.alt, width: el.naturalWidth, height: el.naturalHeight })),
    bodyStyle: { font: getComputedStyle(document.body).fontFamily, background: getComputedStyle(document.body).backgroundColor, color: getComputedStyle(document.body).color }
  }));
  await writeFile(dir + '/inventory.json', JSON.stringify(inventory, null, 2));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: dir + '/screenshots/original-mobile.png', fullPage: true });
} finally { await browser.close(); }
