# Kodevia website

Scroll-driven marketing site for Kodevia, web and app development. The brand's
capsule "K" is a real-time 3D model (three.js r186) that assembles itself as
you scroll.

## Run locally

It must be served over HTTP (ES modules do not load from `file://`):

```bash
npx serve -l 4500 .
```

Then open http://localhost:4500. Any static server works; there is no build step.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The page: semantic HTML, all copy |
| `site.css` | Brand tokens, layout, micro-interactions |
| `main.js` | Scroll and pointer choreography, brief form, interactions |
| `kscene.js` | The 3D scene: capsule K, lights, materials |
| `scrollcraft.js` / `.css` | Scroll engine (scroll-craft, unmodified) |
| `vendor/` | three.js 0.186.1 and RoomEnvironment (self-hosted) |
| `fonts/` | Outfit, Geist, Nunito (self-hosted latin subsets) |
| `assets/` | Stills rendered from the same 3D scene |
| `lab/` | Asset renderer and audit scripts |
| `BRIEF.md` | Creative brief and decisions |
| `AUDIT.md` | Latest audit results |

## Before launch

- Replace the placeholder `hello@kodevia.com` in `index.html` (form `action`
  and footer link).
- Confirm the authored content: tools list, "Why" promises, FAQ answers.

## Checks

```bash
npm install
npm run audit
```

Requires Google Chrome at `/usr/bin/google-chrome`.
