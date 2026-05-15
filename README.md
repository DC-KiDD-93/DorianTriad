# Dorian Triad — Hyperion CSS Handoff

Drop-in replacement for `app.css` and `dt-app.css`. **No markup changes
required** — every existing class name is preserved; only tokens and a
handful of component rules changed.

## What's in this folder

| File | Replaces | Required? |
|---|---|---|
| `app.css` | `app.css` (loaded by `index.html`) | **Yes** |
| `dt-app.css` | `dt-app.css` (loaded by legacy `dorian_triad_guide.html`) | Optional — only if you still use the guide page |

## Install

1. Copy `handoff/app.css` over your existing `app.css` (and `handoff/dt-app.css`
   over `dt-app.css` if you use it).
2. Update the Google Fonts link in `index.html`. **Replace this line:**

   ```html
   <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
   ```

   **with this:**

   ```html
   <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
   ```

That's it. Reload the app.

## What changed

### Tokens (`:root`)

| Variable | Before | After | Why |
|---|---|---|---|
| `--bg` | `#090909` | `#0F1012` | Warmer graphite vs flat black |
| `--surf` | `#111311` | `#1A1D21` → `#21252A` gradient | Cards feel raised, not flat |
| `--gold` | `#C9A84C` | `#D9B873` | Softer, less yellow |
| `--atlas/hades/apollo` | saturated | sage/coral/lapis | Pastel-shifted for premium feel |
| `--text` | `#EDE8E0` | `#F4F1EC` | Warmer cream |
| `--fn-head` | Barlow Condensed | **Instrument Serif** | Editorial display |
| `--fn-body` | DM Sans | **Inter Tight** | Crisp, modern body |
| Radii | 5/9/14/20 | 10/14/18/22 | More deliberate corners |
| Shadows | flat | ambient + inset highlight | Dimensional cards |

### Component-level changes
- **Cards** — gradient background, soft inset highlight + ambient drop-shadow, larger radius
- **Bottom nav** — segmented pill inside a raised pillow (was flat with top accent stripe)
- **Buttons** — pill-shaped (border-radius 100px) instead of squared
- **Stat numbers** — render in Instrument Serif at larger sizes for editorial weight
- **Exercise cards** — left-stripe accent replaced with soft radial glow from session colour on the current card
- **Session colours** — pastel-shifted, used as gradients + glows instead of solid blocks
- **Rest timer** — bigger numerals (60px serif), pill controls, glowing fill bar
- **Progress bars** — pill shape, glowing gradient fill instead of solid
- **Weekly grid** — pillow squares with glowing centred dots instead of filled circles
- **Guide section icons** — square card chips instead of background-colour roundels
- **Sleep quality buttons** — gold pill when active

### What you may want to tune

- **Tab labels.** Original is Home/Workout/Log/Guide/Stats. Hyperion mockup
  renamed them to Today/Sessions/Log/Body/Plan — but **the CSS doesn't
  change labels**, so they'll stay as you have them in `index.html`. Change
  in markup if you want the rename.
- **Top bar eyebrow.** The CSS injects "Cycle 06 · Week 04" under the
  `#topbar-title` via `::after`. If you'd rather drive that from JS or
  remove it, delete the `#topbar-title::after` rule near the top of the
  file.
- **Bodyweight log button.** Now full pill-gradient gold (was flat gold).
  If you want it ghosted, swap `.bw-log-btn` for the `.btn-ghost` style.

### Browser support
- Uses `color-mix(in oklch, …)` — Chrome 111+, Safari 16.4+, Firefox 113+
  (May 2023+). If you need older support, replace those rules with hex
  fallbacks (search the file for `color-mix`).

### Trying it out
Use the canvas mockup at `index.html` (in this design project) as your
visual reference. The CSS targets the same DOM your existing `app.js`
produces, so the live app should match the mockup closely — with the
caveat that anything I drew as bespoke SVG (ring gauges, sparklines)
isn't in the CSS handoff: those would need small additions to `app.js`
to render. The non-SVG screens (Workout select, Log, Stats table, Guide)
will look essentially identical.

If anything looks off when you load it, send me a screenshot and I'll
patch the specific rules.
