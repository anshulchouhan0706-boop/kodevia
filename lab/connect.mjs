import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
await p.screenshot({ path: 'lab/hero-now.png' });
// pick two services on the rail, then open Connect With Us
await p.evaluate(() => { document.querySelector('[data-pick="Websites"]').click(); document.querySelector('[data-pick="Mobile apps"]').click(); });
await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1500);
await p.click('.connect__btn'); await p.waitForTimeout(500);
const links = await p.evaluate(() => [...document.querySelectorAll('.connect__opt')].map(a => a.dataset.kind + ' -> ' + decodeURIComponent(a.href)));
const exp = await p.evaluate(() => document.querySelector('.connect__btn').getAttribute('aria-expanded'));
await p.screenshot({ path: 'lab/connect-open.png' });
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
const closed = await p.evaluate(() => document.querySelector('.connect__btn').getAttribute('aria-expanded') === 'false' && document.activeElement.classList.contains('connect__btn'));
console.log('expanded:', exp); console.log(links.join('\n')); console.log('Esc closes, focus back on button:', closed);
console.log(errs.length ? errs.join('\n') : 'no page errors');
await b.close();
