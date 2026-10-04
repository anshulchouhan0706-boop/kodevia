import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.5 });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const r = await p.evaluate(async () => {
  const K = window.__kodevia; const gl = K.S.renderer.getContext();
  const times = []; const orig = K.S.render;
  K.S.render = function () { const t = performance.now(); orig.call(this); gl.finish(); times.push(performance.now() - t); };
  const frames = [];
  await new Promise(res => { let last = performance.now(); const t0 = last; const H = document.documentElement.scrollHeight * 0.4;
    const f = (n) => { frames.push(n - last); last = n; scrollTo(0, ((n - t0) / 6000) * H); if (n - t0 < 6000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
  times.sort((a, b) => a - b); frames.sort((a, b) => a - b);
  return { canvasPx: K.S.renderer.domElement.width + 'x' + K.S.renderer.domElement.height, renderMedianMs: +times[times.length >> 1].toFixed(2), renderP95Ms: +times[Math.floor(times.length * .95)].toFixed(2), frameP95: +frames[Math.floor(frames.length * .95)].toFixed(1), framesOver20ms: frames.filter(x => x > 20).length, frames: frames.length };
});
console.log(JSON.stringify(r));
await b.close();
