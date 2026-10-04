// Hover and viewer checks on the work pages.
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
const shots = [];
for (const [pg, sel] of [['websites', '.proj-card:nth-child(2) .proj'], ['apps', '.proj-card:nth-child(2) .proj']]) {
  await p.goto(`http://localhost:4500/work/${pg}.html`, { waitUntil: 'networkidle' });
  const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
  const box = await el.boundingBox();
  await p.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3, { steps: 10 }); await p.waitForTimeout(800);
  await p.screenshot({ path: `lab/hover-${pg}.png`, clip: { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 40), width: Math.min(1440, box.width + 80), height: Math.min(900, box.height + 80) } });
  await el.click(); await p.waitForTimeout(600);
  const st = await p.evaluate(() => ({ open: document.querySelector('.lb').open, title: document.querySelector('.lb__title').textContent, count: document.querySelector('.lb__count').textContent }));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  const st2 = await p.evaluate(() => document.querySelector('.lb__title').textContent);
  await p.screenshot({ path: `lab/lb-${pg}.png` });
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const closed = await p.evaluate(() => !document.querySelector('.lb').open && document.activeElement.classList.contains('proj'));
  console.log(pg, JSON.stringify(st), '-> next:', st2, '| esc closes + focus returns:', closed);
}
// design palette copy
await p.goto('http://localhost:4500/work/design.html', { waitUntil: 'networkidle' });
await p.context().grantPermissions(['clipboard-read', 'clipboard-write']);
const chip = await p.$('.chipc'); await chip.scrollIntoViewIfNeeded(); await chip.click(); await p.waitForTimeout(300);
console.log('design toast:', await p.evaluate(() => document.querySelector('.toast').textContent));
console.log(errs.length ? errs.join('\n') : 'no page errors');
await b.close();
