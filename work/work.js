/* Kodevia project pages: reveal on scroll, pointer tilt on project frames,
   a full-screen viewer, and copy-to-clipboard palette chips. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Reveal on scroll, once.
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.rv').forEach((el) => io.observe(el));

// Tilt and light follow the pointer, smoothed per frame.
if (fine && !reduce) {
  document.querySelectorAll('.proj').forEach((el) => {
    const tilt = el.querySelector('.proj__tilt');
    const max = parseFloat(el.dataset.tilt || '6');
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const step = () => {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      tilt.style.setProperty('--rx', (-cy * max).toFixed(2) + 'deg');
      tilt.style.setProperty('--ry', (cx * max).toFixed(2) + 'deg');
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      tx = x * 2 - 1; ty = y * 2 - 1;
      tilt.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      tilt.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      if (!raf) raf = requestAnimationFrame(step);
    });
    el.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(step); });
  });
}

// Viewer: one <dialog> per page, stepping through every project on it.
const lb = document.querySelector('.lb');
if (lb) {
  const items = [...document.querySelectorAll('.proj[data-full]')];
  const img = lb.querySelector('.lb__body img');
  const body = lb.querySelector('.lb__body');
  const title = lb.querySelector('.lb__title');
  let at = 0, opener = null;
  const show = (i) => {
    at = (i + items.length) % items.length;
    const it = items[at];
    img.src = it.dataset.full; img.alt = it.dataset.alt || '';
    body.classList.toggle('is-tall', it.dataset.shape === 'tall');
    body.scrollTop = 0;
    title.textContent = it.dataset.title;
  };
  items.forEach((it, i) => it.addEventListener('click', (e) => { e.preventDefault(); opener = it; show(i); lb.showModal(); }));
  lb.querySelector('[data-lb="prev"]').addEventListener('click', () => show(at - 1));
  lb.querySelector('[data-lb="next"]').addEventListener('click', () => show(at + 1));
  lb.querySelector('[data-lb="close"]').addEventListener('click', () => lb.close());
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(at + 1); if (e.key === 'ArrowLeft') show(at - 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('close', () => { if (opener) opener.focus(); });
}

// Palette chips copy their hex value.
const toast = document.querySelector('.toast');
document.querySelectorAll('.chipc').forEach((c) => c.addEventListener('click', async () => {
  const hex = c.dataset.hex;
  let ok = false;
  try { await navigator.clipboard.writeText(hex); ok = true; } catch (e) { /* clipboard blocked */ }
  if (toast) {
    toast.textContent = ok ? 'Copied ' + hex : hex;
    toast.classList.add('on');
    clearTimeout(toast._t); toast._t = setTimeout(() => toast.classList.remove('on'), 1600);
  }
}));

/* ---------------------------------------------------------------- demo -- */
// Every "Book a free demo" button opens the same three options: call,
// WhatsApp, email. Contact details live on <body> as data attributes.
(function demo() {
  const { phone, whatsapp, email } = document.body.dataset;
  const msg = 'Hi Kodevia, I would like to book a free demo.';
  const boxes = [...document.querySelectorAll('[data-demo]')];
  const close = (box, focus) => {
    if (!box.classList.contains('is-open')) return;
    box.classList.remove('is-open');
    box.querySelector('.demo__btn').setAttribute('aria-expanded', 'false');
    if (focus) box.querySelector('.demo__btn').focus();
  };
  boxes.forEach((box) => {
    const btn = box.querySelector('.demo__btn');
    const opts = [...box.querySelectorAll('.demo__opt')];
    box.querySelector('[data-kind="call"]').href = 'tel:' + phone;
    box.querySelector('[data-kind="whatsapp"]').href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(msg);
    box.querySelector('[data-kind="email"]').href = 'mailto:' + email + '?subject=' + encodeURIComponent('Free demo request') + '&body=' + encodeURIComponent(msg);
    box.classList.add('is-ready');
    btn.setAttribute('role', 'button');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !box.classList.contains('is-open');
      boxes.forEach((o) => o !== box && close(o));
      box.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    box.addEventListener('keydown', (e) => {
      const i = opts.indexOf(document.activeElement);
      if (e.key === 'Escape') close(box, true);
      else if (e.key === 'ArrowDown' && box.classList.contains('is-open')) { e.preventDefault(); (opts[i + 1] || opts[0]).focus(); }
      else if (e.key === 'ArrowUp' && box.classList.contains('is-open')) { e.preventDefault(); (opts[i - 1] || opts[opts.length - 1]).focus(); }
    });
    box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget)) close(box); });
  });
  document.addEventListener('click', (e) => boxes.forEach((b) => !b.contains(e.target) && close(b)));
  document.querySelectorAll('[data-contact]').forEach((a) => {
    const k = a.dataset.contact;
    if (k === 'email') { a.href = 'mailto:' + email; a.textContent = email; }
    if (k === 'call') a.href = 'tel:' + phone;
    if (k === 'whatsapp') a.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(msg);
  });
})();

