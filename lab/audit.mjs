// Full audit: requests, links, console (4 modes), overflow (6 widths), DOM checks, keyboard, axe.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const URL = 'http://localhost:4500/';
const PAGES = ['', 'work/websites.html', 'work/apps.html', 'work/design.html', 'blog/', 'blog/website-or-mobile-app-first.html', 'blog/what-decides-website-app-cost.html', 'blog/before-you-hire-a-web-development-company.html', 'blog/website-maintenance-explained.html'];
const axeSrc = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const out = [];
const log = (...a) => { out.push(a.join(' ')); console.log(...a); };
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });

async function run(name, ctxOpts, launchArgs) {
  const b = launchArgs ? await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: launchArgs }) : browser;
  const ctx = await b.newContext(ctxOpts);
  await ctx.addInitScript(() => { Element.prototype.requestPointerLock = () => {}; Element.prototype.setPointerCapture = () => {}; });
  const p = await ctx.newPage();
  const msgs = [], bad = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => msgs.push('pageerror: ' + e.message));
  p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  p.on('requestfailed', r => { if (!r.url().startsWith('mailto')) bad.push('failed ' + r.url()); });
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const H = await p.evaluate(() => document.documentElement.scrollHeight / innerHeight);
  let maxOverflow = 0;
  for (let v = 0; v <= H; v += 0.5) {
    await p.evaluate(y => scrollTo(0, y * innerHeight), v);
    await p.waitForTimeout(120);
    maxOverflow = Math.max(maxOverflow, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  }
  log(`[${name}] length ${H.toFixed(1)}vh | horizontal overflow ${maxOverflow}px | bad requests ${bad.length ? bad.join(', ') : 'none'} | console ${msgs.length ? '\n   ' + [...new Set(msgs)].join('\n   ') : 'clean'}`);
  return { p, ctx, b };
}

// 1. desktop: also DOM, links, keyboard, axe
{
  const { p, ctx } = await run('desktop 1440', { viewport: { width: 1440, height: 900 } });
  const dom = await p.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
    const dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);
    const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
    const brokenHash = links.filter(h => h.startsWith('#') && h.length > 1 && !document.getElementById(h.slice(1)));
    const imgsNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).map(i => i.src);
    const imgsNoSize = [...document.querySelectorAll('img')].filter(i => !i.getAttribute('width') || !i.getAttribute('height')).map(i => i.src);
    const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
    const skips = heads.filter((l, i) => i && l - heads[i - 1] > 1).length;
    const h1s = heads.filter(l => l === 1).length;
    const unlabeled = [...document.querySelectorAll('input,textarea,select')].filter(el => !(el.labels && el.labels.length) && !el.getAttribute('aria-label')).map(el => el.name);
    const btnNoType = [...document.querySelectorAll('button:not([type])')].length;
    const emDash = /—/.test(document.body.innerText);
    const ext = [...document.querySelectorAll('script[src],link[href],img[src]')].map(e => e.src || e.href).filter(u => u && !u.startsWith(location.origin) && !u.startsWith('data:'));
    return { dupIds, links: [...new Set(links)], brokenHash, imgsNoAlt, imgsNoSize, h1s, skips, unlabeled, btnNoType, emDash, ext, title: document.title, desc: document.querySelector('meta[name=description]')?.content, lang: document.documentElement.lang };
  });
  log('[dom]', JSON.stringify(dom, null, 1));
  // keyboard order from top
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const order = [];
  for (let i = 0; i < 40; i++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; const r = a.getBoundingClientRect(); const cs = getComputedStyle(a); const label = (a.getAttribute('aria-label') || a.innerText || a.value || a.name || a.tagName).trim().replace(/\s+/g, ' ').slice(0, 26); return { label, visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && cs.visibility !== 'hidden' && +cs.opacity > 0.05, outline: cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' }; });
    if (!f) break;
    order.push(`${f.label}${f.visible ? '' : ' [OFFSCREEN/INVISIBLE]'}`);
  }
  log('[keyboard]', order.join(' > '));
  // FAQ keyboard toggle
  const faq = await p.evaluate(async () => { const s = document.querySelector('.faq summary'); s.focus(); return true; });
  await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  const opened = await p.evaluate(() => document.querySelector('.faq details').open);
  await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const closed = await p.evaluate(() => !document.querySelector('.faq details').open);
  log('[faq keyboard] opens:', opened, 'closes:', closed);
  log('[demo]', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('[data-demo]')].length)));
  // axe at several positions (content is scroll-revealed)
  await p.addScriptTag({ content: axeSrc });
  const H = await p.evaluate(() => document.documentElement.scrollHeight / innerHeight);
  const seen = new Map();
  for (let v = 0; v <= H; v += 1) {
    await p.evaluate(y => scrollTo(0, y * innerHeight), v); await p.waitForTimeout(500);
    const res = await p.evaluate(async () => { const r = await axe.run(document, { resultTypes: ['violations'] }); return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]) })); });
    for (const v of res) if (!seen.has(v.id)) seen.set(v.id, { ...v, at: v });
  }
  log('[axe]', seen.size ? JSON.stringify([...seen.values()], null, 1) : 'no violations');
  await ctx.close();
}
// 1b. every work page: requests, console, overflow, links, axe
for (const pg of PAGES.slice(1)) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const msgs = [], bad = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(m.text()); });
  p.on('pageerror', e => msgs.push('pageerror: ' + e.message));
  p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
  await p.goto(URL + pg, { waitUntil: 'networkidle' });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  let ov = 0; for (let y = 0; y < H; y += 450) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(90); ov = Math.max(ov, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
  await p.waitForTimeout(600);
  const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin)));
  const broken = [];
  for (const l of [...new Set(links)]) { const r = await p.request.get(l.split('#')[0]); if (r.status() >= 400) broken.push(r.status() + ' ' + l); }
  const dom = await p.evaluate(() => ({ h1: document.querySelectorAll('h1').length, imgsNoAlt: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length, dupIds: (() => { const ids = [...document.querySelectorAll('[id]')].map(e => e.id); return ids.filter((x, i) => ids.indexOf(x) !== i); })(), home: !!document.querySelector('.nav__home') }));
  await p.addScriptTag({ content: axeSrc });
  const v = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => v.id + ' x' + v.nodes.length + ' :: ' + v.nodes[0].target.join(' ')));
  log(`[${pg}] overflow ${ov}px | bad requests ${bad.length ? bad.join(', ') : 'none'} | broken links ${broken.length ? broken.join(', ') : 'none'} | console ${msgs.length ? msgs.join(' / ') : 'clean'} | dom ${JSON.stringify(dom)} | axe ${v.length ? v.join(' ; ') : 'clean'}`);
  await ctx.close();
}
for (const pg of PAGES.slice(1)) { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); await p.goto(URL + pg, { waitUntil: 'networkidle' });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  let ov = 0; for (let y = 0; y < H; y += 450) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(60); ov = Math.max(ov, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)); }
  log(`[${pg} phone 390] overflow ${ov}px`); await ctx.close(); }

// 2. other modes
for (const [w, h] of [[1920, 1080], [1280, 720], [1024, 768], [768, 1024]]) { const r = await run(`desktop ${w}x${h}`, { viewport: { width: w, height: h } }); await r.ctx.close(); }
{ const r = await run('phone 390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }); await r.ctx.close(); }
{ const r = await run('phone 360x640', { viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true }); await r.ctx.close(); }
{ const r = await run('reduced motion', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await r.ctx.close(); }
{ const r = await run('no WebGL', { viewport: { width: 1440, height: 900 } }, ['--disable-webgl', '--disable-3d-apis']);
  log('[no WebGL] fallback class:', await r.p.evaluate(() => document.documentElement.className)); await r.ctx.close(); await r.b.close(); }
// 3. no JavaScript: content and form must survive
{ const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage(); await p.goto(URL); await p.waitForTimeout(500);
  log('[no JS]', JSON.stringify(await p.evaluate(() => ({ demoOptions: [...document.querySelectorAll('#start .demo__opt')].map(a => a.getAttribute('href')), h1: document.querySelector('h1').innerText, faqItems: document.querySelectorAll('details').length, workLinks: document.querySelectorAll('.wrow').length }))));
  await ctx.close(); }
await browser.close();
fs.writeFileSync('lab/audit.txt', out.join('\n'));
