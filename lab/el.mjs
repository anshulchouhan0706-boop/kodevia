// node lab/el.mjs out.png selector [W H] [scrollIntoView offset vh]
import { chromium } from 'playwright-core';
const [out, sel, W = '1440', H = '900', off = '0'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +W, height: +H } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:4500/' + (process.env.PAGE || ''), { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
await p.evaluate(([s, o]) => { const e = document.querySelector(s); scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * +o); }, [sel, off]);
await p.waitForTimeout(1600);
if (process.env.HOVER) { const r = await p.evaluate(s => { const e = document.querySelector(s).getBoundingClientRect(); return [e.x + e.width / 2, e.y + e.height / 2]; }, process.env.HOVER); await p.mouse.move(r[0], r[1], { steps: 8 }); await p.waitForTimeout(900); }
await p.screenshot({ path: out });
console.log(errs.length ? errs.join('\n') : 'ok');
await b.close();
