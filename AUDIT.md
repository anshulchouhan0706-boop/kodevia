# Kodevia site audit · 2026-10-05 (revision 3)

Final state after the motion, content and audit pass. Every check below was
re-run against the final files at http://localhost:4500.

## Versions (all latest published today)
| Dependency | Installed | Latest |
|---|---|---|
| three (WebGL) | 0.186.1 (r186) | 0.186.1 |
| scroll-craft engine | upstream HEAD 75d81f7, unmodified | same |
| playwright-core (tests only) | 1.63.0 | 1.63.0 |
| axe-core (tests only) | 4.13.0 | 4.13.0 |
| Fonts | Outfit, Geist, Nunito, latin subsets from Google Fonts, self-hosted | current |

Deprecated API removed: `THREE.PCFSoftShadowMap` (removed in recent three, was
logging a warning) replaced with `PCFShadowMap` + `shadow.radius`.

## Endpoints and requests
- 23 requests on load and scroll, all 200, all same-origin. No third-party calls,
  no CDNs, no trackers.
- Links: `#main #top #services #process #faq #start` all resolve;
  `mailto:hello@kodevia.com` (placeholder address, replace before launch).
- Form: `method=post action=mailto:` with `enctype=text/plain`, so with JS off
  it never puts personal input in a URL query. With JS it composes an email;
  it never claims anything was sent.

## Console
Clean (no errors, no warnings) in: desktop 1440/1920/1280/1024, tablet 768,
phone 390 and 360x640, reduced motion, WebGL disabled.

## Layout
Zero horizontal overflow at every width above, sampled every half viewport
down the full page. Services rail reaches its last item at 1280, 1440, 1920
and 390.

## Accessibility
- axe-core 4.13: no violations, sampled at every viewport-height of the page.
- Fixed in this pass: white on brand purple #8B5CF6 was 4.23:1; fills now use
  #7340EA (5.75:1) and the button gradient #6A36E4 to #7A48EC (6.4 to 5.3:1).
  Tools strip text raised to 50% ink. Phone list no longer dims text below
  contrast and no longer overlaps the closing line.
- Keyboard: every control reachable in reading order and visible when focused
  (rail cards scroll into the middle; pending reveals open on focus). FAQ opens
  and closes with Enter. Visible focus ring on every control.
- One h1, no heading-level skips, every image has alt (decorative ones empty),
  width and height on every image, every field labelled, no duplicate ids.
- Reduced motion: no tumble, float, light orbit, marquee or fly-in; content
  complete. WebGL off: static rendered poster, labels as a list.
- No JavaScript: all copy, FAQ (native details) and the form still work.

## Motion and performance (Intel UHD 630, your GPU)
- 60 fps idle and while scrolling the 3D sections; worst frame 16.8 ms,
  zero frames over 33 ms; automatic quality fallback never triggered.
- What caused the jitter, fixed: style variables written to :root every frame
  (whole-page restyle), frame-rate-dependent smoothing, two always-on loops,
  live 70px blur filters on animated layers, render resolution 1.75x.
- Now: time-based smoothing, per-element writes only on change, loop sleeps
  when the scene is off screen, resolution cap 1.5x with automatic step-down
  (1x, then shadows off) if frames run slow.

## Scroll harness (scroll-craft shoot.mjs)
Desktop, phone 390 and reduced motion: no dead scroll, all text clears 4.5:1
on the composited frame.

## Not verified
- A real phone (Safari/Chrome on device). Headless cannot reproduce mobile GPU
  and touch scrolling.
- Real email delivery: the form opens the visitor's email app; nothing is
  sent by the site.

## Content to confirm (authored, not from you)
Tools list (React, Next.js, TypeScript, Node.js, Flutter, React Native, Swift,
Kotlin, Figma, PostgreSQL, Firebase, AWS), the four "Why" promises, the five FAQ
answers, the process steps, and the email address.


## Revision 3 (2026-10-05)

Changes: Web apps service removed; "What are you building" form replaced by
"Book a free demo" with Connect With Us (Call, WhatsApp, Email); Our Work
section with three category panels; three new project pages
(work/websites.html, work/apps.html, work/design.html) built from the real
project files in "kodevia projects"; curved, flowing leader lines; a wire
through the services rail; a process line that draws itself; Home icon in
every header; shadow and jitter fixes.

### Shadow fix
The "shadow over the content" was three things, all removed: the WebGL shadow
map (long streaks from floating capsules, now a small soft contact shadow under
the finished mark only), the blurred foreground capsule sitting under the hero
buttons (now kept to the right edge, hidden under 1100px), and the dark
gradient header that slid over content (now transparent over the hero, a clean
solid bar after scroll).

### Jitter, measured at 1920x1080 @1.5x on Intel UHD 630
| | slow frames (>20ms) | p95 frame |
|---|---|---|
| Before this pass | 58 of 302 (19%) | 33.4 ms |
| After | 11 of 349 (3%) | 16.8 ms |

Causes found by elimination: canvas at 2880x1620 (now capped at a ~1080p pixel
budget), the shadow map pass, a full-screen grain overlay with a blend mode
(grain now lives in the background layer), live backdrop blurs on the header
and tray, a live CSS blur on the foreground capsule (now a pre-blurred image),
and three half-screen background layers animating forever. Default size
(1440x900 @1x): 60 fps idle and scrolling, worst frame 16.8 ms.

### Checks re-run on all four pages
- No failed requests, no broken internal links, no console errors or warnings.
- No horizontal overflow: home at 360 to 1920; each work page at 1440 and 390.
- axe-core 4.13: no violations on any page.
- Keyboard: every control reachable and visible when focused; viewer opens,
  steps with arrow keys, closes with Esc and returns focus; Connect menu opens,
  arrow keys move through options, Esc closes and returns focus.
- Picks on the services rail carry into the demo chips, the tray, and the
  WhatsApp and email messages.
- No JavaScript: the three contact links are plain visible links.
- Palette chips copy their hex value.

### Placeholders to replace before launch
In index.html, on the element with id="connect":
`data-phone="+910000000000"`, `data-whatsapp="910000000000"`,
`data-email="hello@kodevia.com"`, and the matching visible text and fallback
hrefs inside it, plus the footer email link.
