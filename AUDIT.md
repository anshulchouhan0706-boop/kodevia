# Kodevia site audit · 2026-10-03

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
