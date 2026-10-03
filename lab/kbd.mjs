import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const out = [];
for (let i = 0; i < 30; i++) {
  await p.keyboard.press('Tab'); await p.waitForTimeout(700);
  const f = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null;
    const r = a.getBoundingClientRect(); let op = 1; for (let e = a; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    const label = (a.getAttribute('aria-label') || a.innerText || a.value || a.name || a.tagName).trim().replace(/\s+/g,' ').slice(0, 24);
    return { label, ok: r.width > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth && op > 0.6, op: op.toFixed(2) }; });
  if (!f) break; out.push(f.ok ? f.label : `${f.label} [NOT VISIBLE op=${f.op}]`);
}
console.log(out.join(' > '));
await b.close();
