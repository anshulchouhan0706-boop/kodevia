import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const [name, fn] of [['now', ''], ['noFrontLight', `const S = window.__kodevia.S; const l = S.scene.children.filter(c => c.isDirectionalLight)[1]; S.scene.remove(l);`], ['noFrontNoImgs', `const S = window.__kodevia.S; const l = S.scene.children.filter(c => c.isDirectionalLight)[1]; S.scene.remove(l); document.querySelectorAll('.svc__media img').forEach(i=>i.style.display='none');`], ['now2', '']]) {
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.5 });
  await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  if (fn) await p.evaluate(fn);
  const r = await p.evaluate(async () => { const frames = [];
    await new Promise(res => { let last = performance.now(); const t0 = last; const H = document.documentElement.scrollHeight * 0.4;
      const f = (n) => { frames.push(n - last); last = n; scrollTo(0, ((n - t0) / 5000) * H); if (n - t0 < 5000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
    frames.sort((a, b) => a - b); return { p95: +frames[Math.floor(frames.length * .95)].toFixed(1), over20: frames.filter(x => x > 20).length, n: frames.length }; });
  console.log(name.padEnd(14), JSON.stringify(r)); await p.close();
}
await b.close();
