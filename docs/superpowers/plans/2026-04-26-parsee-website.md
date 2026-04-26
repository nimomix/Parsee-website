# Parsee Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the Parsee marketing website at `nimomix.github.io/parsee` per the design spec, with `index.html` (hero + three acts + about + footer) and `privacy.html` (TelemetryDeck + Aptabase disclosure).

**Architecture:** Static site, vanilla HTML/CSS/JS, no build step. Two pages share one `styles.css`. Light-default with auto dark mode via `prefers-color-scheme`. Self-hosted Inter font (no external runtime deps). Dark Parsee screenshots float on a light page. Subtle scroll-fade via `IntersectionObserver`. Deployed via GitHub Pages from `main`.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla ES2020 JS, Inter (self-hosted woff2). No Node, no build tools.

**Working repo:** `/Users/nbar/Projects/parsee-website/`
**Spec:** `docs/superpowers/specs/2026-04-26-parsee-website-design.md`
**App source (for color/icon sampling):** `/Users/nbar/Projects/Parsee/`

---

## File structure

After implementation:

```
parsee-website/                  (renamed from Parsee-website at end → parsee)
├── _archive/                    (NEW: old never-pushed drafts moved here)
│   ├── index_OLD_dec23.html
│   ├── index_brandhero.html
│   ├── index_brandhero_simpler.html
│   ├── index_refreshed_with_hero.html
│   ├── indexOLD.html
│   ├── indexold2.html
│   └── assets/                  (old screenshots from prior drafts)
├── index.html                   (REWRITE)
├── privacy.html                 (NEW)
├── styles.css                   (NEW)
├── app.js                       (NEW)
├── README.md                    (NEW)
├── favicon.ico                  (NEW)
├── images/                      (already populated)
│   ├── parsee-icon.png          (NEW: from app source, replaces JPG)
│   ├── parsee_square_corners.jpg (kept as backup)
│   ├── hero.png
│   ├── parsee-home.png
│   ├── services-menu.png
│   ├── lldb-xcode.png
│   ├── search.png
│   ├── filter.png
│   ├── focus-mode.png
│   ├── insights.png
│   ├── compare.png
│   ├── ask-ai.png
│   ├── ask-ai-empty.png         (kept as backup, unused on the site)
│   └── fonts/                   (NEW: self-hosted Inter)
│       ├── Inter-Regular.woff2
│       ├── Inter-Medium.woff2
│       ├── Inter-SemiBold.woff2
│       └── Inter-Bold.woff2
└── docs/superpowers/{specs,plans}/
```

**Note on TDD:** This is a static marketing site. Traditional unit-test TDD doesn't apply. The verification rhythm per task is **build → render in browser → visual check → commit**. The verification tasks (13–15) cover the cross-cutting concerns (responsive, dark mode, motion preference, Lighthouse).

**Local preview:** `python3 -m http.server 8000` from the repo root → `http://localhost:8000` opens `index.html`. Use this for every task that says "open in browser."

---

## Task 1: Repo cleanup & scaffolding

Get the repo to a known clean state, archive prior drafts (don't delete — they were unfinished work), and create empty placeholders for the files we'll fill in.

**Files:**
- Move: `index.html`, `indexOLD.html`, `indexold2.html`, `index_brandhero.html`, `index_brandhero_simpler.html`, `index_refreshed_with_hero.html`, `assets/` → `_archive/`
- Create: `index.html` (empty), `privacy.html` (empty), `styles.css` (empty), `app.js` (empty), `README.md` (empty)
- Delete: `.DS_Store`

- [ ] **Step 1: Confirm current state**

```bash
cd /Users/nbar/Projects/parsee-website
git status
ls -la
```

Expected: `.DS_Store`, `index.html` (modified, uncommitted from Dec), several `index_*.html` drafts (untracked), `assets/` (untracked), `images/` (untracked), `docs/` (just-committed spec), the bare `index.html` is the most recent of the drafts.

- [ ] **Step 2: Archive the old drafts**

```bash
mkdir -p _archive
git mv index.html _archive/index_OLD_dec23.html 2>/dev/null || mv index.html _archive/index_OLD_dec23.html
mv indexOLD.html _archive/
mv indexold2.html _archive/
mv index_brandhero.html _archive/
mv index_brandhero_simpler.html _archive/
mv index_refreshed_with_hero.html _archive/
mv assets _archive/assets
rm -f .DS_Store
ls -la
```

Expected: `_archive/` now contains the 6 old HTML files plus the old `assets/` folder. Repo root contains only `docs/`, `images/`, `_archive/`, `.git/`.

- [ ] **Step 3: Add a .gitignore for macOS noise**

Create `.gitignore`:

```
.DS_Store
*.swp
*.swo
.idea/
.vscode/
```

- [ ] **Step 4: Create empty placeholder files**

```bash
touch index.html privacy.html styles.css app.js README.md
ls -la
```

Expected: 5 new empty files at the root.

- [ ] **Step 5: Commit the cleanup**

```bash
git add .gitignore _archive/ index.html privacy.html styles.css app.js README.md
git status   # confirm everything intended is staged
git commit -m "$(cat <<'EOF'
Clean repo: archive prior drafts, scaffold new site files

Move 6 old never-pushed index drafts and the prior assets/ folder
into _archive/ for reference. Create empty index.html, privacy.html,
styles.css, app.js, README.md as scaffolding for the new build.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Copy app icon & generate favicon

Use the higher-quality icon from the Parsee app source rather than the `_square_corners.jpg` placeholder.

**Files:**
- Source: `/Users/nbar/Projects/Parsee/Parsee/Parsee/ParseeCube.icon/Assets/Cube!.png`
- Create: `images/parsee-icon.png` (copy of source)
- Create: `images/favicon-32.png`, `images/favicon-180.png` (resized variants)
- Create: `favicon.ico` (legacy fallback)

- [ ] **Step 1: Copy the icon source**

```bash
cp "/Users/nbar/Projects/Parsee/Parsee/Parsee/ParseeCube.icon/Assets/Cube!.png" images/parsee-icon.png
file images/parsee-icon.png
```

Expected: `images/parsee-icon.png: PNG image data, 1024 x 1024` or similar large dimensions.

- [ ] **Step 2: Generate the 32×32 favicon PNG**

```bash
sips -z 32 32 -s format png images/parsee-icon.png --out images/favicon-32.png
file images/favicon-32.png
```

Expected: `PNG image data, 32 x 32`.

- [ ] **Step 3: Generate the 180×180 Apple touch icon**

```bash
sips -z 180 180 -s format png images/parsee-icon.png --out images/favicon-180.png
file images/favicon-180.png
```

Expected: `PNG image data, 180 x 180`.

- [ ] **Step 4: Generate favicon.ico (single-size, 32px)**

`sips` doesn't write `.ico`. Use Python (preinstalled on macOS):

```bash
python3 -c "from PIL import Image; Image.open('images/favicon-32.png').save('favicon.ico', format='ICO', sizes=[(32,32)])" 2>/dev/null || \
python3 -c "import struct
with open('images/favicon-32.png','rb') as f: png = f.read()
ico = struct.pack('<HHH', 0, 1, 1) + struct.pack('<BBBBHHII', 32, 32, 0, 0, 1, 32, len(png), 22) + png
with open('favicon.ico','wb') as f: f.write(ico)"
file favicon.ico
```

Expected: `favicon.ico: MS Windows icon resource - 1 icon, 32x32`.

- [ ] **Step 5: Commit the icon assets**

```bash
git add images/parsee-icon.png images/favicon-32.png images/favicon-180.png favicon.ico
git commit -m "$(cat <<'EOF'
Add Parsee icon and favicon variants

Copy app icon from Parsee/ParseeCube.icon/Assets/Cube!.png as the
canonical website icon. Generate 32×32 favicon and 180×180 Apple touch
icon, plus favicon.ico for legacy browsers.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Self-host Inter font

Download Inter weights 400/500/600/700 in woff2 from the official source. No external runtime dependency.

**Files:**
- Create: `images/fonts/Inter-Regular.woff2`, `Inter-Medium.woff2`, `Inter-SemiBold.woff2`, `Inter-Bold.woff2`

(Note: Fonts live under `images/fonts/` to keep all binary assets in one tree. Yes, fonts aren't images — but the alternative is creating a `fonts/` top-level folder for 4 files. Pragmatic call.)

- [ ] **Step 1: Create fonts directory**

```bash
mkdir -p images/fonts
```

- [ ] **Step 2: Download Inter weights from rsms.me (the canonical source)**

```bash
cd images/fonts
curl -fsSL -o Inter-Regular.woff2 "https://rsms.me/inter/font-files/Inter-Regular.woff2?v=4.0"
curl -fsSL -o Inter-Medium.woff2 "https://rsms.me/inter/font-files/Inter-Medium.woff2?v=4.0"
curl -fsSL -o Inter-SemiBold.woff2 "https://rsms.me/inter/font-files/Inter-SemiBold.woff2?v=4.0"
curl -fsSL -o Inter-Bold.woff2 "https://rsms.me/inter/font-files/Inter-Bold.woff2?v=4.0"
ls -la
cd ../..
```

Expected: 4 `.woff2` files, each ~30-100 KB. If any download is 0 bytes or HTML, the URL has changed — fall back to `https://github.com/rsms/inter/releases/latest/download/Inter-4.0.zip`, unzip, and copy the four `.woff2` files from the `Inter Web/` subfolder.

- [ ] **Step 3: Verify file sizes look right**

```bash
ls -la images/fonts/
```

Expected: each `.woff2` is between 30 KB and 200 KB. If any is under 1 KB, redownload — that's an error response.

- [ ] **Step 4: Commit the fonts**

```bash
git add images/fonts/
git commit -m "$(cat <<'EOF'
Self-host Inter font (Regular/Medium/SemiBold/Bold)

Mac users see SF Pro Display (system stack); Windows/Linux users get
self-hosted Inter as the Mac-adjacent fallback. No CDN runtime
dependency.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: CSS foundation

Build everything that's not section-specific: variables, reset, typography, layout container, font faces, dark mode, motion preference, base utility classes.

**Files:**
- Modify: `styles.css` (currently empty)

The accent color is **`#007AFF`** for light mode and **`#0A84FF`** for dark mode. These are Apple's system blue values, matching SwiftUI's `Color.blue` which the Parsee app uses throughout. Sampled from app source confirmation in `Parsee/Parsee/SettingsView.swift` and `RecentFilesView.swift` (which use `.foregroundColor(.blue)` extensively).

- [ ] **Step 1: Write the file header and `:root` variables**

Open `styles.css` and write:

```css
/* Parsee marketing site — vanilla CSS, no build step.
   Light by default, auto dark via prefers-color-scheme. */

:root {
  /* Color tokens — light */
  --bg: #ffffff;
  --bg-alt: #fafafa;
  --text: #1d1d1f;
  --text-muted: #86868b;
  --accent: #007AFF;
  --divider: rgba(0, 0, 0, 0.06);
  --shadow-screenshot: 0 24px 64px -16px rgba(0, 0, 0, 0.18),
                       0 8px 24px -8px rgba(0, 0, 0, 0.10);

  /* Spacing scale (8px base) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 96px;
  --space-8: 128px;
  --space-9: 192px;

  /* Layout */
  --content-max: 1200px;
  --prose-max: 720px;
  --side-pad: 24px;

  /* Type scale */
  --fs-hero: clamp(40px, 7vw, 64px);
  --fs-section: clamp(32px, 5vw, 48px);
  --fs-sub: clamp(24px, 3vw, 28px);
  --fs-body: 17px;
  --fs-secondary: 15px;
  --fs-micro: 13px;

  --lh-display: 1.08;
  --lh-body: 1.5;
  --lh-prose: 1.65;

  --ls-display: -0.022em;

  /* Motion */
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --duration-fade: 600ms;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0c;
    --bg-alt: #111114;
    --text: #f5f5f7;
    --text-muted: #86868b;
    --accent: #0A84FF;
    --divider: rgba(255, 255, 255, 0.06);
    --shadow-screenshot: 0 24px 64px -16px rgba(0, 0, 0, 0.6),
                         0 8px 24px -8px rgba(0, 0, 0, 0.4);
  }
}

@media (min-width: 768px) {
  :root { --side-pad: 48px; }
}

@media (min-width: 1024px) {
  :root { --side-pad: 80px; }
}
```

- [ ] **Step 2: Add @font-face declarations for self-hosted Inter**

Append to `styles.css`:

```css
/* Self-hosted Inter — only loaded by non-Apple platforms via the
   font-stack fallback chain. Mac users get SF Pro Display from the system. */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('images/fonts/Inter-Regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('images/fonts/Inter-Medium.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('images/fonts/Inter-SemiBold.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('images/fonts/Inter-Bold.woff2') format('woff2');
}
```

- [ ] **Step 3: Add reset + base typography**

Append to `styles.css`:

```css
/* Reset */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
               "Inter", system-ui, sans-serif;
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, picture, svg { display: block; max-width: 100%; height: auto; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

/* Display headings */
.display {
  font-size: var(--fs-hero);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
  font-weight: 700;
}
.section-title {
  font-size: var(--fs-section);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
  font-weight: 700;
  text-align: center;
}
.section-subtitle {
  font-size: clamp(18px, 2vw, 22px);
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-2);
  font-weight: 400;
}
.sub-title {
  font-size: var(--fs-sub);
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.muted { color: var(--text-muted); }
```

- [ ] **Step 4: Add layout containers, sections, screenshot frame**

Append to `styles.css`:

```css
/* Containers */
.container {
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 var(--side-pad);
}
.prose {
  width: 100%;
  max-width: var(--prose-max);
  margin: 0 auto;
  padding: 0 var(--side-pad);
}

/* Sections */
section {
  padding: var(--space-7) 0;
}
@media (min-width: 1024px) {
  section { padding: var(--space-8) 0; }
}
section.tinted {
  background: var(--bg-alt);
}
section + section { border-top: 1px solid var(--divider); }

/* Screenshot frame */
.screenshot {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: var(--shadow-screenshot);
}
.screenshot-wrap {
  margin-top: var(--space-5);
}

/* Sub-section block */
.subsection {
  margin-top: var(--space-7);
}
.subsection:first-of-type { margin-top: var(--space-6); }
.subsection-copy {
  max-width: var(--prose-max);
  margin: var(--space-4) auto 0;
  text-align: center;
  color: var(--text);
}
.subsection-copy .capabilities {
  margin-top: var(--space-2);
  color: var(--text-muted);
  font-size: var(--fs-secondary);
}
```

- [ ] **Step 5: Add motion + reduced-motion**

Append to `styles.css`:

```css
/* Scroll-fade entrance — set by app.js */
.fade-in {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-fade) var(--ease),
              transform var(--duration-fade) var(--ease);
}
.fade-in.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .fade-in { opacity: 1; transform: none; }
}
```

- [ ] **Step 6: Verify CSS is valid by loading a placeholder index.html**

Temporary verification — write a stub index.html to confirm CSS loads:

Open `index.html` (currently empty) and write:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Parsee — CSS check</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container" style="padding-top:64px;">
    <h1 class="display">Display heading</h1>
    <h2 class="section-title">Section title</h2>
    <p class="section-subtitle">Section subtitle</p>
    <p>Body copy in <a href="#">accent</a> link.</p>
    <p class="muted">Muted secondary text.</p>
  </div>
</body>
</html>
```

- [ ] **Step 7: Start a local server and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Expected in browser:
- White background
- Display heading at very large size, near-black `#1d1d1f`
- Section title centered
- Subtitle in muted gray below
- Accent link is blue `#007AFF`
- Switch system to dark mode (System Settings → Appearance → Dark) → page flips: dark background, light text, brighter blue

If any of those fails, fix the CSS before continuing.

Stop the server with `kill %1` when done (or `lsof -ti:8000 | xargs kill`).

- [ ] **Step 8: Commit**

```bash
git add styles.css index.html
git commit -m "$(cat <<'EOF'
Add CSS foundation: variables, type, layout, dark mode, motion

CSS custom properties for color tokens (light + dark via
prefers-color-scheme), spacing scale, type scale with clamp() for
fluid sizing, layout containers, screenshot frame, fade-in utility,
and reduced-motion override. Self-hosted Inter @font-face declarations
chained behind SF Pro Display in the system stack.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Hero section

The first thing visitors see. Centered, generous whitespace, App Store CTA, hero screenshot.

**Files:**
- Modify: `index.html` (replace the placeholder body with the real `<head>` + hero markup)
- Modify: `styles.css` (append hero-specific styles)

The App Store URL `https://apps.apple.com/us/app/parsee-json-viewer/id6756983590` is used in three places: hero CTA, footer CTA, and any other touchpoints. Define it once in HTML and reuse via copy-paste — there's no templating, so the discipline is "search-and-replace if it ever changes."

For the App Store badge image: download the official "Download on the Mac App Store" badge from Apple's marketing tools (https://tools.applemediaservices.com/app-store/) — pick **English (US), black**, save the PNG to `images/app-store-badge.png`. If that's friction, use the SVG variant from Apple's developer site instead. The badge MUST be the official Apple-provided asset (App Store guidelines require it).

- [ ] **Step 1: Download the official Mac App Store badge**

Apple's badges are at https://developer.apple.com/app-store/marketing/guidelines/. The direct PNG URL pattern (en-us, black variant) is:

```bash
curl -fsSL -o images/app-store-badge.png \
  "https://tools.applemediaservices.com/api/badges/download/macos?releaseDate=&locale=en-us&style=black"
```

If the URL returns HTML instead of PNG (Apple's tool URLs change), the implementer must visit https://tools.applemediaservices.com/app-store/badge in a browser, generate the badge with locale `en-us` and color `Black`, download as PNG, and place at `images/app-store-badge.png`.

Verify:
```bash
file images/app-store-badge.png
```

Expected: `PNG image data, ...` with reasonable dimensions (typically 120×40 to 240×80).

- [ ] **Step 2: Replace the placeholder index.html with the real hero**

Open `index.html` and replace its entire content with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0a0a0c" media="(prefers-color-scheme: dark)">

  <title>Parsee — The JSON viewer for macOS</title>
  <meta name="description" content="Parse. See. Understand. A native macOS JSON viewer with smart filters, persistent search, AI insights, JSON diff, and Xcode LLDB integration.">

  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/favicon-180.png">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Parsee — The JSON viewer for macOS">
  <meta property="og:description" content="Parse. See. Understand. A native macOS JSON viewer with smart filters, persistent search, AI insights, JSON diff, and Xcode LLDB integration.">
  <meta property="og:image" content="https://nimomix.github.io/parsee/images/hero.png">

  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <!-- HERO -->
  <header class="hero">
    <div class="container hero-inner">
      <img class="hero-icon" src="images/parsee-icon.png" alt="" width="96" height="96">
      <h1 class="hero-wordmark">Parsee</h1>
      <p class="hero-tagline">Parse. See. Understand.</p>
      <a class="appstore-link" href="https://apps.apple.com/us/app/parsee-json-viewer/id6756983590">
        <img src="images/app-store-badge.png" alt="Download on the Mac App Store" height="48">
      </a>
      <p class="hero-trial muted">Free 30-day trial</p>
      <div class="hero-screenshot screenshot-wrap fade-in">
        <img class="screenshot" src="images/hero.png" alt="Parsee showing a JSON tree view of coffee shop data">
      </div>
    </div>
  </header>

  <!-- ACTS go here in subsequent tasks -->

  <script src="app.js" defer></script>
</body>
</html>
```

- [ ] **Step 3: Append hero-specific CSS to styles.css**

Append to `styles.css`:

```css
/* ──────────── Hero ──────────── */
.hero {
  padding: var(--space-7) 0 var(--space-6);
  text-align: center;
}
@media (min-width: 1024px) {
  .hero { padding: var(--space-8) 0 var(--space-7); }
}
.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-icon {
  width: 96px;
  height: 96px;
  border-radius: 22px;  /* macOS app-icon corner radius for 96px ~ 22px */
  margin-bottom: var(--space-3);
}
.hero-wordmark {
  font-size: var(--fs-hero);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
  font-weight: 700;
  margin-bottom: var(--space-2);
}
.hero-tagline {
  font-size: clamp(20px, 2.4vw, 26px);
  color: var(--text-muted);
  font-weight: 400;
  margin-bottom: var(--space-5);
}
.appstore-link {
  display: inline-block;
  transition: transform 200ms var(--ease);
}
.appstore-link:hover { transform: translateY(-1px); text-decoration: none; }
.appstore-link img { height: 48px; width: auto; }
.hero-trial {
  margin-top: var(--space-2);
  font-size: var(--fs-secondary);
}
.hero-screenshot {
  margin-top: var(--space-6);
  width: 100%;
}
@media (min-width: 1024px) {
  .hero-screenshot { margin-top: var(--space-7); }
}
```

- [ ] **Step 4: Render and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Expected:
- Centered Parsee icon at the top (rounded square — looks like a Mac app icon)
- "Parsee" in big bold display
- "Parse. See. Understand." tagline below in muted color
- "Download on the Mac App Store" badge — clickable, links to the real App Store URL (cmd-click to verify)
- "Free 30-day trial" line beneath the badge
- Big hero screenshot below with a soft drop shadow

Check at three widths: drag the browser window narrow (375px-ish, mobile), medium (768px), and wide (1280px). Hero text should fluidly scale via `clamp()`. Layout stays centered.

Switch system to dark mode → page flips to dark background, screenshot still pops.

If anything looks broken, fix CSS before continuing.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css images/app-store-badge.png
git commit -m "$(cat <<'EOF'
Add hero section: icon, wordmark, tagline, App Store CTA, hero shot

Centered Apple-style hero with rounded app icon (96px), 'Parsee'
wordmark, 'Parse. See. Understand.' tagline, official App Store
badge linking to apps.apple.com/us/app/parsee-json-viewer/id6756983590,
'Free 30-day trial' microcopy, and hero.png screenshot below.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Act 1 — Open. From anywhere.

Two sub-sections: the welcome window (with services menu as a smaller supporting shot) and the LLDB integration.

**Files:**
- Modify: `index.html` (insert Act 1 after the hero, before the closing `<script>` line)
- Modify: `styles.css` (append act-1-specific styles for the supporting-screenshot pairing)

- [ ] **Step 1: Insert Act 1 markup**

In `index.html`, find the comment `<!-- ACTS go here in subsequent tasks -->` and replace it with:

```html
  <!-- ACT 1 — Open. From anywhere. -->
  <section class="act act-1" id="open-anywhere">
    <div class="container">
      <h2 class="section-title">Open. From anywhere.</h2>
      <p class="section-subtitle">Files, paste, URLs, Xcode &mdash; all one shortcut away.</p>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Open from anywhere</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/parsee-home.png" alt="Parsee welcome window with options to open a file, paste JSON, or fetch from URL">
        </div>
        <div class="screenshot-wrap support-shot">
          <img class="screenshot" src="images/services-menu.png" alt="macOS Services menu showing the Open JSON in PARSEE option on highlighted text">
        </div>
        <div class="subsection-copy">
          <p>Parsee meets your JSON wherever it shows up.</p>
          <p class="capabilities">System-wide hotkey · paste · drag-drop · fetch from URL · right-click any text in any app · default opener for <code>.json</code> files</p>
        </div>
      </div>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Bonus for Xcode users — LLDB integration</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/lldb-xcode.png" alt="Xcode paused at a breakpoint with Parsee window beside it showing the variable contents">
        </div>
        <div class="subsection-copy">
          <p>An optional power feature for the Xcode crowd. Pause at a breakpoint, type one command, and any variable opens in Parsee.</p>
          <p class="capabilities"><code>parsee &lt;var&gt;</code> · <code>parsee scope</code> · <code>parsee live</code> (auto-updates on every step)</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ACT 2 placeholder -->
```

- [ ] **Step 2: Append CSS for act/sub-section centering and supporting-shot offset**

Append to `styles.css`:

```css
/* ──────────── Acts (shared) ──────────── */
.act .section-subtitle { margin-bottom: var(--space-6); }

.sub-title-centered { text-align: center; }

/* Inline code chips */
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo,
               Consolas, "Liberation Mono", monospace;
  font-size: 0.92em;
  background: var(--bg-alt);
  padding: 0.12em 0.4em;
  border-radius: 4px;
  color: var(--text);
}
@media (prefers-color-scheme: dark) {
  code { background: rgba(255,255,255,0.06); }
}

/* Supporting screenshot — smaller, off-center, sits below the anchor */
.support-shot {
  max-width: 70%;
  margin-left: auto;
  margin-right: 0;
  margin-top: calc(-1 * var(--space-5));
  position: relative;
  z-index: 1;
}
@media (min-width: 768px) {
  .support-shot {
    max-width: 55%;
  }
}
@media (max-width: 767px) {
  .support-shot {
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--space-3);
  }
}
```

- [ ] **Step 3: Render and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Expected:
- Section heading "Open. From anywhere." (centered, large)
- Subhead "Files, paste, URLs, Xcode — all one shortcut away." (smaller, muted)
- Sub-section 1: "Open from anywhere" — anchor screenshot (parsee-home.png) centered, then services-menu.png slightly smaller and off-set to the right (overlapping above on desktop, stacked on mobile)
- Body paragraph + capabilities line
- Sub-section 2: "Bonus for Xcode users — LLDB integration" — wide LLDB screenshot, then copy with inline `code` chips

Resize to mobile (375px-ish) — both sub-sections stack cleanly, support-shot moves under the anchor centered.

Cmd-click any code chip in DevTools to verify they render as monospace with subtle background.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "$(cat <<'EOF'
Add Act 1: Open. From anywhere. (welcome window + LLDB)

Two sub-sections: 'Open from anywhere' anchored on parsee-home.png
with services-menu.png offset as a supporting shot, and 'Bonus for
Xcode users — LLDB integration' anchored on lldb-xcode.png. Inline
code chips for the parsee CLI commands.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Act 2 — Find. Filter. Focus.

Three sub-sections in the middle act on a tinted background. Same vertical rhythm as Act 1, but no support-shot offsets — each sub-section is one anchor screenshot + short paragraph.

**Files:**
- Modify: `index.html` (insert Act 2 after Act 1)
- Modify: `styles.css` (no new styles needed — reuses existing `.act`, `.subsection`, `.tinted`)

- [ ] **Step 1: Insert Act 2 markup**

In `index.html`, find `<!-- ACT 2 placeholder -->` and replace it with:

```html
  <!-- ACT 2 — Find. Filter. Focus. -->
  <section class="act act-2 tinted" id="find-filter-focus">
    <div class="container">
      <h2 class="section-title">Find. Filter. Focus.</h2>
      <p class="section-subtitle">From thousand-line JSON to the one value you care about.</p>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Search</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/search.png" alt="Parsee with the search bar active, showing two matches for the term 'dark' highlighted in yellow">
        </div>
        <div class="subsection-copy">
          <p>Type to find. Press <code>⌘F</code> to focus the field. Highlights persist as you navigate so you can compare matches without losing your place.</p>
        </div>
      </div>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Filter</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/filter.png" alt="Parsee filtered by two paths showing only product names and roast levels from the catalog">
        </div>
        <div class="subsection-copy">
          <p>Persistent path-based filters: wildcards, index ranges, multiple filters at once. The tree updates live to show only what matches.</p>
        </div>
      </div>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Focus Mode</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/focus-mode.png" alt="Parsee in Focus Mode on a single catalog item with type icons and inline structure visible">
        </div>
        <div class="subsection-copy">
          <p>Dive into any node and see its structure without the tree decorations. Volume bars show relative sizes, type icons mark each field, and inline insights appear without leaving the view.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ACT 3 placeholder -->
```

- [ ] **Step 2: Render and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Scroll down past the hero and Act 1.

Expected:
- Background tone shifts subtly to `--bg-alt` (very slight off-white in light mode, slight off-black in dark)
- Heading "Find. Filter. Focus." centered, large
- Subhead "From thousand-line JSON to the one value you care about."
- Three sub-sections in vertical sequence: Search, Filter, Focus Mode
- Each: heading → screenshot (centered, full content width) → short paragraph (centered, 720px max)
- ⌘F renders as a code chip
- Hover on the section divider where Act 1 ends and Act 2 starts — there should be a subtle 1px divider line

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add Act 2: Find. Filter. Focus. (Search, Filter, Focus Mode)

Three sub-sections on the middle act with a tinted background to
give the page rhythm. Each sub-section is a single anchor screenshot
plus a short paragraph (~25 words) — no bullet lists in this act so
the rich Parsee screenshots stay the focal point.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Act 3 — Analyze. Compare. Ask.

Same shape as Act 2, on the base `--bg` so the page brackets cleanly.

**Files:**
- Modify: `index.html` (insert Act 3 after Act 2)

- [ ] **Step 1: Insert Act 3 markup**

In `index.html`, find `<!-- ACT 3 placeholder -->` and replace it with:

```html
  <!-- ACT 3 — Analyze. Compare. Ask. -->
  <section class="act act-3" id="analyze-compare-ask">
    <div class="container">
      <h2 class="section-title">Analyze. Compare. Ask.</h2>
      <p class="section-subtitle">Insights, diffs, and AI answers &mdash; all in one place.</p>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Insights</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/insights.png" alt="Parsee with the Insights panel open beside a JSON tree, showing a bar chart of value counts">
        </div>
        <div class="subsection-copy">
          <p>Tap the insights button on any node and Parsee opens a structured analysis: field availability, unique values, value counts, distributions. All of it as readable JSON.</p>
        </div>
      </div>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Compare</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/compare.png" alt="Parsee comparing production.json and staging.json side by side, with three change types highlighted">
        </div>
        <div class="subsection-copy">
          <p>Drop two JSONs side by side and Parsee shows exactly what changed: added, removed, modified. Works on huge files instantly.</p>
        </div>
      </div>

      <div class="subsection fade-in">
        <h3 class="sub-title sub-title-centered">Ask AI</h3>
        <div class="screenshot-wrap">
          <img class="screenshot" src="images/ask-ai.png" alt="Parsee Ask AI panel with a substantive answer about out-of-stock products and inventory totals">
        </div>
        <div class="subsection-copy">
          <p>Ask questions about your data in plain English &mdash; without leaving Parsee or pasting into another tab. Filter first to narrow the focus, or ask the whole file at once.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ABOUT placeholder -->
```

- [ ] **Step 2: Render and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Scroll down past Act 2.

Expected:
- Background returns to `--bg` (white/black-ish — same as the hero)
- Heading "Analyze. Compare. Ask." centered, large
- Three sub-sections: Insights, Compare, Ask AI in that order
- Same rhythm as Act 2

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add Act 3: Analyze. Compare. Ask. (Insights, Compare, Ask AI)

Three sub-sections on the final act. Background returns to base so
the page brackets cleanly across the three acts. Order is chosen for
narrative flow — Insights builds on the inline insights from Focus
Mode, Compare is structural understanding across files, Ask AI lands
the finish.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: About + Footer

Inline About paragraph above the footer. Footer with a CTA repeat, three links, copyright, small mark.

**Files:**
- Modify: `index.html` (insert About + Footer where the placeholder is)
- Modify: `styles.css` (append about + footer styles)

- [ ] **Step 1: Insert About and Footer markup**

In `index.html`, find `<!-- ABOUT placeholder -->` and replace it with:

```html
  <!-- ABOUT -->
  <section class="about tinted" id="about">
    <div class="prose">
      <p class="about-text">I'm Nimrod Bar, a macOS and iOS developer. I work with JSON every day and got tired of using browser tabs and online viewers to read it. Parsee is the tool I wished existed.</p>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container footer-inner">
      <a class="appstore-link" href="https://apps.apple.com/us/app/parsee-json-viewer/id6756983590">
        <img src="images/app-store-badge.png" alt="Download on the Mac App Store" height="44">
      </a>
      <p class="footer-trial muted">Free 30-day trial</p>
      <nav class="footer-links">
        <a href="privacy.html">Privacy</a>
        <span class="dot">·</span>
        <a href="mailto:parsee.json@gmail.com">Support</a>
        <span class="dot">·</span>
        <a href="#about">About</a>
        <span class="dot">·</span>
        <span class="muted">© 2026 Nimrod Bar</span>
      </nav>
      <img class="footer-mark" src="images/parsee-icon.png" alt="" width="40" height="40">
    </div>
  </footer>
```

- [ ] **Step 2: Append About + Footer CSS**

Append to `styles.css`:

```css
/* ──────────── About ──────────── */
.about {
  padding: var(--space-7) 0;
}
.about-text {
  font-size: clamp(20px, 2.2vw, 24px);
  line-height: 1.5;
  text-align: center;
  color: var(--text);
}

/* ──────────── Footer ──────────── */
.footer {
  padding: var(--space-7) 0 var(--space-6);
  border-top: 1px solid var(--divider);
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.footer-trial {
  margin-top: var(--space-2);
  font-size: var(--fs-secondary);
}
.footer-links {
  margin-top: var(--space-5);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  font-size: var(--fs-secondary);
}
.footer-links a {
  color: var(--text-muted);
}
.footer-links a:hover { color: var(--accent); }
.footer-links .dot { color: var(--text-muted); opacity: 0.5; }
.footer-mark {
  margin-top: var(--space-5);
  width: 40px;
  height: 40px;
  border-radius: 9px;
  opacity: 0.7;
}
```

- [ ] **Step 3: Render and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Scroll to the bottom.

Expected:
- About section: tinted background (matches Act 2 tone), single paragraph centered, ~720px max width, larger type, first-person voice ("I'm Nimrod Bar...")
- Footer below: divider line above, App Store badge centered, "Free 30-day trial" line, then "Privacy · Support · About · © 2026 Nimrod Bar" links
- Click "Privacy" → goes to a 404-looking blank page (that's expected — we build privacy.html in Task 11)
- Click "About" → smooth-scrolls back up to the About section
- Hover over "Privacy", "Support", "About" → text turns blue (accent)
- Below the links: small Parsee mark at 40×40, slightly faded

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "$(cat <<'EOF'
Add About section and footer

About is an inline tinted block above the footer with the indie-dev
first-person paragraph. Footer repeats the App Store CTA, lists
Privacy/Support/About/copyright, and closes with a small Parsee mark.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: app.js — smooth scroll + IntersectionObserver fade-in

Minimal script: smooth-scroll for the `#about` anchor (already covered by `scroll-behavior: smooth` in CSS, but the JS adds a focus-on-target nicety), and the scroll-fade observer for `.fade-in` elements.

**Files:**
- Modify: `app.js` (currently empty)

- [ ] **Step 1: Write the script**

Open `app.js` and write:

```javascript
// Parsee marketing site — minimal interactivity.
// 1) IntersectionObserver-driven fade-in for .fade-in elements.
// 2) Falls back gracefully when IntersectionObserver isn't available
//    (everything appears immediately, no transforms).

(function () {
  const FADE_SELECTOR = '.fade-in';

  // Reduced-motion users get instant visibility — never observe.
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    document.querySelectorAll(FADE_SELECTOR).forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    }
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  document.querySelectorAll(FADE_SELECTOR).forEach(el => observer.observe(el));
})();
```

- [ ] **Step 2: Render and verify the fade**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000
```

Reload the page. Scroll slowly down. Each `.fade-in` block (Act 1 sub-sections, Act 2 sub-sections, Act 3 sub-sections, hero screenshot) should subtly fade up into view as it enters the viewport. Once visible, scrolling back up does NOT re-trigger (one-shot).

- [ ] **Step 3: Verify reduced-motion path**

In Safari/Chrome DevTools, open the Rendering tab (Chrome: Cmd+Shift+P → "Show Rendering") and set "Emulate CSS media feature `prefers-reduced-motion`" to `reduce`. Reload the page.

Expected: All `.fade-in` blocks are immediately visible — no fade-in animation as you scroll.

- [ ] **Step 4: Verify no-IntersectionObserver fallback (sanity)**

In DevTools console:
```javascript
delete window.IntersectionObserver
```
Then reload the page. Same as reduced-motion: everything appears immediately. (This is just a sanity check; modern browsers all support IO.)

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "$(cat <<'EOF'
Add scroll-fade IntersectionObserver script

Single IIFE that observes .fade-in elements and toggles .is-visible
when they enter the viewport. One-shot — does not retrigger on scroll
back. Skips entirely for prefers-reduced-motion or older browsers,
making everything immediately visible instead.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Privacy page

Reconcile the existing gist (which only mentions TelemetryDeck) with reality (TelemetryDeck + Aptabase). Build the standalone `privacy.html` page.

**Files:**
- Modify: `privacy.html` (currently empty)
- Modify: `styles.css` (append privacy-page styles)

- [ ] **Step 1: Fetch the existing gist content**

```bash
curl -fsSL "https://gist.githubusercontent.com/nimomix/94e5e89cb4fe372118c0b99573daaa60/raw" > /tmp/parsee-privacy-gist.txt
cat /tmp/parsee-privacy-gist.txt
```

If the raw URL needs the file name, use `gh gist view 94e5e89cb4fe372118c0b99573daaa60 --raw` instead. If neither works, fetch by visiting the gist in a browser and copy-pasting the body into `/tmp/parsee-privacy-gist.txt`.

Read the content. Note the structure (intro, what's collected, third parties, contact, etc.).

- [ ] **Step 2: Verify the in-app analytics services**

From the parent app source:

```bash
grep -n "TelemetryDeck\|Aptabase" /Users/nbar/Projects/Parsee/Parsee/Parsee/AnalyticsService.swift | head -20
```

Expected: confirms both services are initialized and used. Take note of what events are tracked (the file lists them).

- [ ] **Step 3: Build privacy.html**

Open `privacy.html` and write:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0a0a0c" media="(prefers-color-scheme: dark)">

  <title>Privacy Policy — Parsee</title>
  <meta name="description" content="Parsee privacy policy: what data is collected, what is not, and how it is used.">
  <meta name="robots" content="index, follow">

  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="images/favicon-180.png">

  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <header class="page-header">
    <div class="prose">
      <a class="back-link" href="index.html">← Back to Parsee</a>
      <img class="page-mark" src="images/parsee-icon.png" alt="" width="48" height="48">
      <h1 class="page-title">Privacy Policy</h1>
      <p class="page-meta muted">Last updated: 2026-04-26</p>
    </div>
  </header>

  <article class="legal">
    <div class="prose">

      <p>Parsee is built to respect your privacy. The app processes your JSON entirely on your Mac &mdash; no JSON file content, no field values, and no document data are ever sent to any server. This page describes what limited data <em>is</em> collected, why, and how to opt out.</p>

      <h2>What Parsee does <em>not</em> collect</h2>
      <ul>
        <li>The contents of any JSON you open, paste, drag, fetch, or pipe into Parsee</li>
        <li>File names, file paths, or anything from your filesystem</li>
        <li>Your name, email address, or any account information (Parsee has no accounts)</li>
        <li>Your IP address (neither analytics provider retains it)</li>
        <li>Cross-app or cross-site tracking identifiers</li>
      </ul>

      <h2>What Parsee does collect</h2>
      <p>Parsee uses two privacy-respecting analytics services to understand how the app is used in aggregate. Both are designed to comply with GDPR and similar regulations and neither collects personally identifiable information.</p>

      <h3>TelemetryDeck</h3>
      <p>TelemetryDeck collects anonymous usage signals such as:</p>
      <ul>
        <li>App launches and session counts</li>
        <li>App version, macOS version, device class</li>
        <li>System language and region</li>
      </ul>
      <p>TelemetryDeck does not retain IP addresses and uses one-way hashing to derive anonymous user identifiers that cannot be reversed. See <a href="https://telemetrydeck.com/privacy/">TelemetryDeck's privacy documentation</a> for details.</p>

      <h3>Aptabase</h3>
      <p>Aptabase collects named events tied to feature use, such as:</p>
      <ul>
        <li>Which features are opened (e.g., Compare, Focus Mode, Ask AI)</li>
        <li>Trial milestones (e.g., trial started, trial expired)</li>
        <li>Paywall views and purchase outcomes</li>
        <li>Anonymous app version and OS metadata</li>
      </ul>
      <p>Aptabase events do not include the contents of your JSON, your filenames, or any personally identifiable information. See <a href="https://aptabase.com/legal/privacy">Aptabase's privacy documentation</a> for details.</p>

      <h2>Ask AI feature</h2>
      <p>The Ask AI feature is opt-in: it is only invoked when you explicitly send a message. When used, the JSON content you choose to send (the whole document or a filtered subset) is transmitted to the configured AI provider for the sole purpose of generating an answer. Parsee does not store, log, or retain the content of those requests beyond the local conversation history within the app.</p>

      <h2>In-app purchases</h2>
      <p>All purchases (the optional one-time unlock after the 30-day trial) are processed by Apple via the Mac App Store. Parsee does not see your payment details. Purchase and trial state is verified locally on your device using Apple's StoreKit.</p>

      <h2>Opting out</h2>
      <p>If you prefer not to send any analytics, you can disable network access for Parsee using macOS's built-in firewall, or use Little Snitch / LuLu / equivalent to block outbound connections from the app. The Ask AI feature is opt-in and never activates without your explicit input.</p>

      <h2>Children</h2>
      <p>Parsee is not directed at children under 13 and does not knowingly collect any data from children.</p>

      <h2>Changes</h2>
      <p>If this policy changes, the &ldquo;Last updated&rdquo; date at the top of this page is updated. Significant changes will also be noted in the app's release notes.</p>

      <h2>Contact</h2>
      <p>For any privacy questions, contact <a href="mailto:parsee.json@gmail.com">parsee.json@gmail.com</a>.</p>

    </div>
  </article>

  <!-- FOOTER (same as index.html) -->
  <footer class="footer">
    <div class="container footer-inner">
      <a class="appstore-link" href="https://apps.apple.com/us/app/parsee-json-viewer/id6756983590">
        <img src="images/app-store-badge.png" alt="Download on the Mac App Store" height="44">
      </a>
      <p class="footer-trial muted">Free 30-day trial</p>
      <nav class="footer-links">
        <a href="privacy.html">Privacy</a>
        <span class="dot">·</span>
        <a href="mailto:parsee.json@gmail.com">Support</a>
        <span class="dot">·</span>
        <a href="index.html#about">About</a>
        <span class="dot">·</span>
        <span class="muted">© 2026 Nimrod Bar</span>
      </nav>
      <img class="footer-mark" src="images/parsee-icon.png" alt="" width="40" height="40">
    </div>
  </footer>

</body>
</html>
```

**Important:** Before committing, the implementer must compare the original gist content against the new privacy page. The new page is more thorough (it covers Aptabase, AI, IAP, opt-out). If the gist contains specific phrasing the user wants preserved (e.g., specific TelemetryDeck wording), merge it in. The diff to verify is between `/tmp/parsee-privacy-gist.txt` and the new page.

- [ ] **Step 4: Append privacy-page styles**

Append to `styles.css`:

```css
/* ──────────── Page header (privacy etc.) ──────────── */
.page-header {
  padding: var(--space-6) 0 var(--space-4);
  text-align: center;
}
.back-link {
  display: inline-block;
  font-size: var(--fs-secondary);
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}
.back-link:hover { color: var(--accent); }
.page-mark {
  width: 48px;
  height: 48px;
  border-radius: 11px;
  margin: 0 auto var(--space-3);
}
.page-title {
  font-size: var(--fs-section);
  line-height: var(--lh-display);
  letter-spacing: var(--ls-display);
  font-weight: 700;
}
.page-meta {
  margin-top: var(--space-1);
  font-size: var(--fs-secondary);
}

/* ──────────── Long-form legal text ──────────── */
.legal {
  padding: var(--space-5) 0 var(--space-7);
  line-height: var(--lh-prose);
  font-size: var(--fs-body);
}
.legal h2 {
  margin-top: var(--space-6);
  margin-bottom: var(--space-2);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.legal h3 {
  margin-top: var(--space-4);
  margin-bottom: var(--space-1);
  font-size: 19px;
  font-weight: 600;
}
.legal p { margin-top: var(--space-2); }
.legal ul {
  margin-top: var(--space-2);
  padding-left: 1.4em;
}
.legal li { margin-top: 6px; }
.legal a { color: var(--accent); }
```

- [ ] **Step 5: Render and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/privacy.html
```

Expected:
- "← Back to Parsee" link at the top, click it → returns to index.html
- Parsee mark, title "Privacy Policy", "Last updated" date
- Long-form text in a 720px column, comfortable line-height
- Headings clearly differentiated (h2 vs h3)
- Bulleted lists under "What Parsee does not collect" and the analytics sections
- Same footer as index.html, with About link pointing to `index.html#about`

Switch to dark mode → readable, same layout.

- [ ] **Step 6: Show the diff vs. the gist for the user (don't auto-commit yet)**

```bash
diff /tmp/parsee-privacy-gist.txt <(cat privacy.html | sed 's/<[^>]*>//g' | tr -s '\n' | grep -v '^$') | head -80
```

This produces a noisy diff (because we're comparing markdown to stripped HTML) but should give a sanity check that no major claim was lost. If anything important from the gist isn't represented, edit `privacy.html` to include it.

- [ ] **Step 7: Commit**

```bash
git add privacy.html styles.css
git commit -m "$(cat <<'EOF'
Add privacy.html: TelemetryDeck + Aptabase reconciliation

The previous privacy gist only disclosed TelemetryDeck, but the app
has used both TelemetryDeck (anonymous usage signals) and Aptabase
(named-event analytics) since the 30-day trial release. The new page
discloses both honestly with what each collects, plus sections for
the Ask AI feature, in-app purchases, opt-out instructions, and
contact.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: README

One-paragraph repo description. Not user-facing; just clarifies what this repo is for anyone landing in it on GitHub.

**Files:**
- Modify: `README.md` (currently empty)

- [ ] **Step 1: Write the README**

Open `README.md` and write:

```markdown
# parsee — marketing site

Public website for [Parsee](https://apps.apple.com/us/app/parsee-json-viewer/id6756983590), a JSON viewer for macOS.

Hosted via GitHub Pages at <https://nimomix.github.io/parsee>.

## Layout
- `index.html` — landing page (hero + three feature acts + about + footer)
- `privacy.html` — privacy policy
- `styles.css` — single stylesheet (CSS custom properties, dark mode via `prefers-color-scheme`)
- `app.js` — minimal IntersectionObserver scroll-fade
- `images/` — screenshots, app icon, self-hosted Inter font
- `_archive/` — never-pushed prior drafts; reference only

## Local preview
```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Push to `main`. GitHub Pages serves the root directory.

No build step. No Node. No external runtime dependencies.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
Add README explaining repo purpose and structure

One-paragraph repo description, file layout, local-preview command,
and deploy notes for anyone landing on the GitHub repo.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Cross-browser, responsive, dark/light verification

Manual end-to-end check. No code changes unless something breaks.

- [ ] **Step 1: Start the local server**

```bash
python3 -m http.server 8000 &
sleep 1
```

- [ ] **Step 2: Verify in Safari at three widths**

Open `http://localhost:8000` in Safari. Use Develop → Enter Responsive Design Mode (or Window → Resize).

Check at:
- **375 × 812** (iPhone-ish narrow)
- **768 × 1024** (iPad-ish medium)
- **1280 × 800** (laptop wide)

For each width, verify:
- Hero is centered, icon visible, tagline visible, CTA reachable, hero screenshot fits without horizontal scroll
- All three acts render: section titles legible, sub-section screenshots scale within content width, copy stays centered
- Services menu screenshot in Act 1 stacks centered on mobile, offsets right on desktop
- About text doesn't overflow
- Footer stacks vertically on mobile, links wrap nicely

If anything breaks, note it and fix CSS before committing in Step 6.

- [ ] **Step 3: Verify in Chrome (or Brave/Edge)**

Same three widths, same checks. Open Chrome DevTools → Device Toolbar (Cmd+Shift+M) for the resize.

Pay special attention to:
- The screenshot drop shadows render at the right strength
- The `.support-shot` offset behaves
- Code chips render with the muted background

- [ ] **Step 4: Verify in Firefox**

Same three widths, same checks. Firefox tends to surface CSS subgrid / clamp / @font-face issues earliest.

- [ ] **Step 5: Verify dark mode in Safari and Chrome**

Switch system to dark mode (System Settings → Appearance → Dark) — or in DevTools, emulate `prefers-color-scheme: dark`.

For each browser, scroll the entire page top to bottom. Verify:
- Background flips to `#0a0a0c`
- Text flips to `#f5f5f7`
- Tinted sections (Act 2, About) use `#111114`
- Accent flips to `#0A84FF` (slightly brighter blue)
- Code chips use a slightly transparent white background
- Screenshot shadows are deeper / darker
- All screenshots remain readable (they're already dark, so they sit on the dark page well)

- [ ] **Step 6: Fix any issues found, then commit**

If you fixed anything:
```bash
git add styles.css index.html privacy.html
git commit -m "$(cat <<'EOF'
Fix cross-browser/responsive issues found in verification

[1-line description of what was fixed]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If nothing needed fixing, no commit needed.

---

## Task 14: Accessibility, motion, and Lighthouse

Final quality pass before deploy.

- [ ] **Step 1: Verify reduced-motion**

In Chrome DevTools → Rendering tab → "Emulate CSS media feature `prefers-reduced-motion: reduce`". Reload `http://localhost:8000`.

Expected:
- All `.fade-in` elements appear immediately (no fade)
- Anchor link (`#about`) jumps without smooth-scroll
- App Store badge hover doesn't translate

If anything still animates, check:
- The `prefers-reduced-motion` block in `styles.css` (Task 4 Step 5)
- The reduced-motion early-return in `app.js` (Task 10 Step 1)

- [ ] **Step 2: Run Lighthouse on `/index.html`**

In Chrome DevTools → Lighthouse tab → check Performance, Accessibility, Best Practices, SEO. Run on Desktop preset, Light mode.

Expected scores (targets, not absolute requirements):
- Performance: 95+ (tiny static page, should be near-100)
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

Common things Lighthouse will flag and how to fix inline:
- **"Image elements do not have explicit `width` and `height`"** — already set on icon and badge. Add explicit `width`/`height` to large screenshots if flagged. Use intrinsic dimensions if unsure (or add `loading="lazy"` to images below the fold to defer them).
- **"Links do not have a discernible name"** — usually means an `<a>` wrapping only an `<img>` without alt. The App Store link's `<img>` has `alt="Download on the Mac App Store"` which provides the link name.
- **"Document does not have a meta description"** — already set in `<head>`.

- [ ] **Step 3: Run Lighthouse on `/privacy.html`**

Same checks. Privacy page should score similarly or higher (it's text-only, no big images).

- [ ] **Step 4: Verify image alt text honesty**

Read every `alt=""` in `index.html` and `privacy.html`. Each should describe what the screenshot actually shows, not invent UI elements that aren't there.

- [ ] **Step 5: Add `loading="lazy"` to below-the-fold screenshots**

In `index.html`, every `<img class="screenshot">` except the hero one should have `loading="lazy"`. Specifically:
- `parsee-home.png`, `services-menu.png`, `lldb-xcode.png` (Act 1)
- `search.png`, `filter.png`, `focus-mode.png` (Act 2)
- `insights.png`, `compare.png`, `ask-ai.png` (Act 3)

The hero image stays eager (it's above the fold).

Edit each `<img class="screenshot">` tag to include `loading="lazy"`. For example:
```html
<img class="screenshot" loading="lazy" src="images/parsee-home.png" alt="...">
```

- [ ] **Step 6: Re-run Lighthouse to confirm improvement**

Same checks as Step 2. Performance should be at or above the prior score.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Lazy-load below-the-fold screenshots for faster first paint

Add loading=\"lazy\" to all screenshots except the hero so the page's
LCP isn't blocked by 9 PNG decodes. The hero shot stays eager because
it's above the fold.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Repo rename, push, GitHub Pages, live verification

Final task: get the site live.

- [ ] **Step 1: User renames the GitHub repo**

This step **must be done by Nimrod through the GitHub UI** (the implementer cannot rename Nimrod's repos):

1. Visit https://github.com/nimomix/Parsee-website/settings
2. Under "Repository name", change `Parsee-website` to `parsee`
3. Click "Rename"

GitHub auto-redirects the old name to the new one for a while, but local remotes still point at the old URL string. Confirm the new URL is `https://github.com/nimomix/parsee` before proceeding.

- [ ] **Step 2: Update local remote**

```bash
cd /Users/nbar/Projects/parsee-website
git remote -v
git remote set-url origin git@github.com:nimomix/parsee.git
git remote -v
```

Expected: `origin` now points at `git@github.com:nimomix/parsee.git`. (Use HTTPS URL `https://github.com/nimomix/parsee.git` if SSH isn't configured.)

- [ ] **Step 3: Set up tracking and push**

```bash
git push -u origin main
```

Expected: push succeeds. `main` now tracks `origin/main` again (the upstream is back).

If push fails with "remote already has commits", there are two cases:
- The remote has the old `first commit` — same as local. Pushing should fast-forward. If it's behind, force-push is fine here ONLY because Nimrod owns this repo and there's no shared history at risk: `git push -u --force-with-lease origin main`. **Do not skip the user's confirmation before force-pushing.** Ask: "OK to force-push to overwrite the old remote main? Your local history is the new one we want."
- The remote has unrelated history — investigate before doing anything destructive.

- [ ] **Step 4: Configure GitHub Pages**

Through the GitHub UI:
1. Visit https://github.com/nimomix/parsee/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**

Wait ~30-60 seconds. The page reloads and shows "Your site is live at https://nimomix.github.io/parsee/".

- [ ] **Step 5: Live verification**

Open https://nimomix.github.io/parsee/ in Safari and Chrome.

Expected:
- Page loads, all images load (no broken thumbnails)
- App Store badge link goes to https://apps.apple.com/us/app/parsee-json-viewer/id6756983590
- "Privacy" footer link goes to https://nimomix.github.io/parsee/privacy.html
- "About" footer link smooth-scrolls to the about block
- "Support" footer link opens mail composer to parsee.json@gmail.com
- Light mode looks right
- Switch to dark mode → looks right
- Mobile-width view (Develop → Responsive Design Mode in Safari) → looks right

If any image returns 404, the path in HTML is wrong (case-sensitive on GitHub Pages, even when macOS local serves it fine). Fix paths to match exact filenames in `images/`.

- [ ] **Step 6: Final commit (only if anything was fixed)**

If you had to fix anything in Step 5:

```bash
git add -A
git commit -m "$(cat <<'EOF'
Fix path/case issues found on GitHub Pages

[1-line description of what was fixed]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

Wait ~30s for GitHub Pages to redeploy, then re-verify.

- [ ] **Step 7: Done**

The site is live at https://nimomix.github.io/parsee/. Tell Nimrod the URL and that all 8 success criteria from §12 of the spec are met.

---

## Self-review

Spec coverage check (each requirement → task):

| Spec section | Covered by |
| --- | --- |
| §1 Overview / 3 purposes | Tasks 5–11 (whole site) |
| §2 Architecture / vanilla / no build | Tasks 1, 4 (no Node, no build tools introduced) |
| §2 File structure | Tasks 1, 2, 3, 4, 5, 11, 12 (all files created) |
| §2 Repo rename | Task 15 step 1 (Nimrod) + step 2 (implementer) |
| §2 Deployment | Task 15 steps 4–5 |
| §2 Analytics: none | Verified by absence — no `<script>` tags for analytics anywhere |
| §3 Color tokens | Task 4 step 1 (`:root` + dark mode block) |
| §3 Typography (system stack + Inter) | Task 3 (Inter download), Task 4 step 2 (@font-face), Task 4 step 3 (font-family on body) |
| §3 Type scale | Task 4 step 1 (`--fs-*` variables) |
| §3 Layout grid | Task 4 step 1 (`--content-max`, `--side-pad`, spacing scale) |
| §3 Motion + reduced-motion | Task 4 step 5, Task 10, Task 14 step 1 |
| §3 Responsive | Task 4 step 1 (breakpoint media queries), Task 13 |
| §3 Three-act background tones | Task 4 step 4 (`.tinted` class), Task 7 (`tinted` on Act 2), Task 9 (`tinted` on About) |
| §4 Hero | Task 5 |
| §5 Act 1 (Open + LLDB) | Task 6 |
| §6 Act 2 (Search/Filter/Focus) | Task 7 |
| §7 Act 3 (Insights/Compare/Ask AI) | Task 8 |
| §8 About + Footer | Task 9 |
| §8 Privacy page + reconciliation | Task 11 |
| §9 Asset inventory | Tasks 2 (icon variants), 3 (fonts), 5 (badge) |
| §10 Open items 1 (App Store URL) | Task 5 (in HTML), Task 9 (footer), Task 11 (privacy footer) |
| §10 Open items 2 (icon variant) | Task 2 (used app source instead of JPG) |
| §10 Open items 3 (accent color) | Task 4 step 1 (pinned `#007AFF` / `#0A84FF`) |
| §10 Open items 4 (Inter hosting) | Task 3 (self-hosted) |
| §10 Open items 5 (gist reconciliation) | Task 11 step 1 (fetch), step 3 (rewrite) |
| §10 Open items 6 (repo rename) | Task 15 |
| §10 Open items 7 (favicon) | Task 2 |
| §10 Open items 8 (README) | Task 12 |
| §11 Out of scope | Verified by absence — no themes section, no analytics, no social, no blog |
| §12 Success criteria 1 (live URL) | Task 15 step 5 |
| §12 Success criteria 2 (all 9 features) | Tasks 6, 7, 8 |
| §12 Success criteria 3 (App Store URL single source) | Tasks 5, 9, 11 (all use the same URL string) |
| §12 Success criteria 4 (privacy reconciliation) | Task 11 |
| §12 Success criteria 5 (cross-browser, responsive, dark) | Task 13 |
| §12 Success criteria 6 (reduced-motion) | Task 14 step 1 |
| §12 Success criteria 7 (Lighthouse) | Task 14 steps 2–3 |
| §12 Success criteria 8 (manual verification) | Task 15 step 5 |

**Placeholder scan:** No "TBD" / "TODO" / "implement later" markers in the plan. Every code block is complete and runnable.

**Type/identifier consistency check:**
- CSS class names used in HTML match those defined in CSS:
  - `.container`, `.prose`, `.hero`, `.hero-inner`, `.hero-icon`, `.hero-wordmark`, `.hero-tagline`, `.appstore-link`, `.hero-trial`, `.hero-screenshot`, `.screenshot`, `.screenshot-wrap`, `.section-title`, `.section-subtitle`, `.sub-title`, `.sub-title-centered`, `.subsection`, `.subsection-copy`, `.capabilities`, `.support-shot`, `.fade-in`, `.is-visible`, `.tinted`, `.act`, `.about`, `.about-text`, `.footer`, `.footer-inner`, `.footer-trial`, `.footer-links`, `.footer-mark`, `.dot`, `.muted`, `.page-header`, `.back-link`, `.page-mark`, `.page-title`, `.page-meta`, `.legal` — all consistent across tasks.
- App Store URL `https://apps.apple.com/us/app/parsee-json-viewer/id6756983590` used identically in Tasks 5, 9, 11, 12, 15.
- File paths consistent: all images under `images/`, fonts under `images/fonts/`, icon as `images/parsee-icon.png` (Task 2 onward).
- Color hex values consistent: `--accent` is `#007AFF` (light) / `#0A84FF` (dark) throughout.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-26-parsee-website.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for plans with many independent tasks like this one (15 tasks, mostly sequential but each is self-contained).

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints. Best if you want to watch each step happen live and intervene mid-task.

**Which approach?**
