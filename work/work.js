/* Kodevia project pages: reveal on scroll, pointer tilt on project frames,
   a full-screen viewer, and copy-to-clipboard palette chips. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Reveal on scroll, once.
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px 15% 0px' });
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
  // Phones: each menu is a bottom sheet. It lives directly under <body>, so no
  // animated (transformed) ancestor can trap or clip its fixed position.
  const phoneMQ = matchMedia('(max-width: 860px)');
  const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const menuOf = new Map(boxes.map((b) => [b, b.querySelector('.demo__menu')]));
  const inBox = (box, n) => !!n && (box.contains(n) || menuOf.get(box).contains(n));
  const place = () => menuOf.forEach((m, b) => {
    if (phoneMQ.matches) { if (m.parentElement !== document.body) document.body.appendChild(m); }
    else if (m.parentElement !== b) b.appendChild(m);
  });
  const setOpen = (box, open) => {
    box.classList.toggle('is-open', open);
    menuOf.get(box).classList.toggle('is-open', open);
    box.querySelector('.demo__btn').setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  const close = (box, focus) => {
    if (!box.classList.contains('is-open')) return;
    setOpen(box, false);
    if (focus) box.querySelector('.demo__btn').focus();
  };
  boxes.forEach((box) => {
    const btn = box.querySelector('.demo__btn');
    const menu = menuOf.get(box);
    const opts = [...menu.querySelectorAll('.demo__opt')];
    const wa = menu.querySelector('[data-kind="whatsapp"]');
    menu.querySelector('[data-kind="call"]').href = 'tel:' + phone;
    wa.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(msg);
    // On phones, open WhatsApp in place: a new tab often stalls on a blank
    // page instead of handing over to the app.
    if (touch) wa.removeAttribute('target');
    menu.querySelector('[data-kind="email"]').href = 'mailto:' + email + '?subject=' + encodeURIComponent('Free demo request') + '&body=' + encodeURIComponent(msg);
    // Let the tap go through, then put the sheet away for when they return.
    opts.forEach((o) => o.addEventListener('click', () => setTimeout(() => close(box), 300)));
    box.classList.add('is-ready');
    btn.setAttribute('role', 'button');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !box.classList.contains('is-open');
      boxes.forEach((o) => o !== box && close(o));
      setOpen(box, open);
    });
    // Mouse users: the options pop out on hover, and stay while the pointer
    // is over the button or the menu. Click still works everywhere.
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let t = 0;
      const show = () => { clearTimeout(t); boxes.forEach((o) => o !== box && close(o)); setOpen(box, true); };
      box.addEventListener('pointerenter', show);
      box.addEventListener('pointerleave', () => { clearTimeout(t); t = setTimeout(() => close(box), 260); });
    }
    const keys = (e) => {
      const i = opts.indexOf(document.activeElement);
      if (e.key === 'Escape') close(box, true);
      else if (e.key === 'ArrowDown' && box.classList.contains('is-open')) { e.preventDefault(); (opts[i + 1] || opts[0]).focus(); }
      else if (e.key === 'ArrowUp' && box.classList.contains('is-open')) { e.preventDefault(); (opts[i - 1] || opts[opts.length - 1]).focus(); }
    };
    box.addEventListener('keydown', keys);
    menu.addEventListener('keydown', keys);
    // Close when keyboard focus moves elsewhere. A tap on a phone blurs the
    // button with no new focus target; that is not leaving, so it must not
    // close the sheet under the finger (outside taps are handled below).
    const out = (e) => { if (e.relatedTarget && !inBox(box, e.relatedTarget)) close(box); };
    box.addEventListener('focusout', out);
    menu.addEventListener('focusout', out);
  });
  document.addEventListener('click', (e) => boxes.forEach((b) => !inBox(b, e.target) && close(b)));
  place();
  phoneMQ.addEventListener('change', place);
  document.querySelectorAll('[data-contact]').forEach((a) => {
    const k = a.dataset.contact;
    if (k === 'email') { a.href = 'mailto:' + email; a.textContent = email; }
    if (k === 'call') a.href = 'tel:' + phone;
    if (k === 'whatsapp') { a.href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(msg); if (touch) a.removeAttribute('target'); }
  });
})();


// Blog topic filter: shows matching articles; "All topics" resets.
(function blogFilter() {
  const bar = document.querySelector('.blog-filter');
  if (!bar) return;
  const btns = [...bar.querySelectorAll('.blog-filter__btn')];
  const posts = [...document.querySelectorAll('.blog-list [data-tag]')];
  btns.forEach((b) => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    btns.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    posts.forEach((p) => {
      const show = f === 'all' || p.dataset.tag === f;
      p.hidden = !show;
      if (show) { p.classList.remove('is-shown'); void p.offsetWidth; p.classList.add('is-shown'); }
    });
  }));
})();

// Light / dark switch in the header. The choice is remembered across pages.
(function themeToggle() {
  const root = document.documentElement;
  const sync = () => {
    const light = root.getAttribute('data-theme') === 'light';
    document.querySelectorAll('[data-theme-toggle]').forEach((b) => {
      b.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      b.setAttribute('aria-pressed', light ? 'true' : 'false');
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#F8F7FB' : '#0A0A0B');
  };
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('kodevia-theme', next); } catch (e) { /* storage blocked */ }
    sync();
    setTimeout(() => root.classList.remove('theme-anim'), 450);
  }));
  sync();
})();
