import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const errs = [];
const ctx = await b.newContext({ viewport: { width: 1440, height: 800 } });
const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => (m.type()==='error'||m.type()==='warning') && errs.push(m.text()));
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const bb = await (await p.$('.hero .demo__btn')).boundingBox();
await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 5 }); await p.waitForTimeout(700);
const menu = await p.evaluate(() => { const r = document.querySelector('#demo-hero').getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, open: document.querySelector('.hero .demo').classList.contains('is-open') }; });
await p.screenshot({ path: 'lab/r9-hover.png' });
console.log('hero menu on hover:', JSON.stringify(menu));
await p.mouse.move(700, 100); await p.waitForTimeout(600);
console.log('closes on leave:', !(await p.evaluate(() => document.querySelector('.hero .demo').classList.contains('is-open'))));
// wire at end of rail
await p.evaluate(() => { const a = document.getElementById('services'); scrollTo({ top: a.getBoundingClientRect().top + scrollY + a.offsetHeight - innerHeight - 5, behavior: 'instant' }); }); await p.waitForTimeout(1600);
await p.screenshot({ path: 'lab/r9-wire.png' });
// form dark
await p.evaluate(() => { const a = document.getElementById('start'); scrollTo({ top: a.getBoundingClientRect().top + scrollY - 40, behavior: 'instant' }); }); await p.waitForTimeout(1500);
await p.screenshot({ path: 'lab/r9-form-dark.png' });
// validation
await p.click('.lead__submit'); await p.waitForTimeout(300);
console.log('validation:', await p.evaluate(() => [...document.querySelectorAll('.lf__err')].map(e => e.textContent).filter(Boolean)));
// light
await p.click('.bar [data-theme-toggle]'); await p.waitForTimeout(700);
await p.screenshot({ path: 'lab/r9-form-light.png' });
await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.waitForTimeout(1500);
await p.screenshot({ path: 'lab/r9-home-light.png' });
// blog default light (fresh context = no saved choice)
const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
const q = await ctx2.newPage(); q.on('pageerror', e => errs.push(e.message));
await q.goto('http://localhost:4500/blog/', { waitUntil: 'networkidle' }); await q.waitForTimeout(900);
await q.screenshot({ path: 'lab/r9-blog.png' });
await q.goto('http://localhost:4500/blog/why-is-my-website-slow.html', { waitUntil: 'networkidle' }); await q.waitForTimeout(900);
await q.evaluate(() => scrollTo({ top: 700, behavior: 'instant' })); await q.waitForTimeout(800);
await q.screenshot({ path: 'lab/r9-post.png' });
console.log(errs.length ? errs.join('\n') : 'no errors');
await b.close();
