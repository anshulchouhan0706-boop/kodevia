import { chromium } from 'playwright-core';
import fs from 'node:fs';
const axe = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const pages = ['', 'work/websites.html', 'work/apps.html', 'work/design.html', 'blog/', 'blog/why-is-my-website-slow.html', '404.html'];
for (const theme of ['dark', 'light']) for (const pg of pages) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(t => { try { localStorage.setItem('kodevia-theme', t); } catch (e) {} }, theme);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:4500/' + pg, { waitUntil: 'networkidle' });
  const H = await p.evaluate(() => document.documentElement.scrollHeight / innerHeight);
  await p.addScriptTag({ content: axe });
  const seen = new Map();
  for (let v = 0; v <= H; v += 1) {
    await p.evaluate(y => scrollTo({ top: y * innerHeight, behavior: 'instant' }), v); await p.waitForTimeout(450);
    const res = await p.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'] })).violations.map(v => [v.id, v.nodes.slice(0, 2).map(n => n.target.join(' ') + ' ' + (n.failureSummary || '').split('\n')[1]).join(' | ')]));
    res.forEach(([id, ex]) => { if (!seen.has(id)) seen.set(id, ex); });
  }
  console.log(`[${theme}] ${pg || 'home'}: ${seen.size ? [...seen].map(([i, e]) => i + ' :: ' + e).join(' || ') : 'clean'}${errs.length ? ' | errors: ' + errs.join(' / ') : ''}`);
  await ctx.close();
}
await b.close();
