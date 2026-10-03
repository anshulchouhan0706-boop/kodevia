import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-features=Vulkan'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
const r = await p.evaluate(async () => {
  const gl = document.createElement('canvas').getContext('webgl2'); const d = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?';
  const sample = (ms, fn) => new Promise(res => { const t = []; let last = performance.now(); const t0 = last; const f = (n) => { t.push(n - last); last = n; fn && fn(n - t0); if (n - t0 < ms) requestAnimationFrame(f); else { t.sort((a, b) => a - b); res({ fps: Math.round(1000 * t.length / ms), median: +t[t.length >> 1].toFixed(1), p95: +t[Math.floor(t.length * 0.95)].toFixed(1), worst: +t[t.length - 1].toFixed(1), over33ms: t.filter(x => x > 33).length }); } }; requestAnimationFrame(f); });
  const idle = await sample(3000);
  const H = document.documentElement.scrollHeight - innerHeight;
  const scroll = await sample(8000, (e) => scrollTo(0, (e / 8000) * H * 0.55));
  return { gpu, idle, scroll, quality: window.__kodevia && window.__kodevia.quality() };
});
console.log(JSON.stringify(r, null, 1));
await b.close();
