// Lab 1 — structural checks.
// These are FEEDBACK, not a grade. This lab is HTML + CSS only: no JS, no
// frameworks. So these check the structural things that are easy to forget —
// they say nothing about whether your page looks good.

import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const source = (file) => readFile(path.join(repoRoot, file), 'utf8');

test.describe('the rendered page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('has the viewport meta tag, so media queries work on a real phone', async ({ page }) => {
    await expect(page.locator('head meta[name="viewport"]')).toHaveAttribute(
      'content',
      /width\s*=\s*device-width/,
    );
  });

  test('links a stylesheet', async ({ page }) => {
    expect(await page.locator('head link[rel="stylesheet"]').count()).toBeGreaterThan(0);
  });

  test('uses semantic elements rather than divs for everything', async ({ page }) => {
    expect(await page.locator('nav').count()).toBeGreaterThan(0);
    expect(await page.locator('footer').count()).toBeGreaterThan(0);
    expect(await page.locator('header, main, section, article').count()).toBeGreaterThan(0);
  });

  test('has a nav with at least three links', async ({ page }) => {
    expect(await page.locator('nav a').count()).toBeGreaterThanOrEqual(3);
  });

  test('has a call to action and a text input', async ({ page }) => {
    const cta = page.locator(
      'button, input[type="submit"], [class*="cta"], [class*="btn"], [class*="button"]',
    );
    expect(await cta.count()).toBeGreaterThan(0);
    expect(await page.locator('input').count()).toBeGreaterThan(0);
  });

  test('shows at least one image, as an <img> or a CSS background', async ({ page }) => {
    const found = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img').length;
      const backgrounds = [...document.querySelectorAll('body *')].filter(
        (el) => getComputedStyle(el).backgroundImage !== 'none',
      ).length;
      return imgs + backgrounds;
    });
    expect(found).toBeGreaterThan(0);
  });

  test('lays things out with flexbox', async ({ page }) => {
    const flexed = await page.evaluate(
      () =>
        [...document.querySelectorAll('body *')].filter(
          (el) => getComputedStyle(el).display === 'flex',
        ).length,
    );
    expect(flexed).toBeGreaterThan(0);
  });
});

test.describe('the source files', () => {
  test('has no JavaScript — this one is HTML and CSS only', async () => {
    const html = await source('index.html');
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/\son[a-z]+\s*=/i);
  });

  test('has a mobile breakpoint and some hover polish in the CSS', async () => {
    const css = await source('style.css');
    expect(css).toMatch(/@media[^{]*max-width/);
    expect(css).toMatch(/:hover/);
  });
});
