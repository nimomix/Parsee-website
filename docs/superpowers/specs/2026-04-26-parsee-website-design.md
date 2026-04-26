# Parsee Website — Design Spec

**Date:** 2026-04-26
**Status:** Approved, ready for implementation plan
**Owner:** Nimrod Bar

---

## 1. Overview

A public marketing website for **Parsee**, a macOS JSON viewer distributed exclusively through the Mac App Store. The site lives at `nimomix.github.io/parsee` and serves three purposes:

1. Convert visitors into Mac App Store downloads
2. Showcase Parsee's depth across nine features
3. Host the privacy policy as a permanent URL

The existing repo (`Parsee-website`) contains never-pushed prior drafts; we start fresh and use them only as reference. Renamed to lowercase `parsee` for the public URL.

## 2. Architecture & deployment

**Pages — two only:**
- `index.html` — marketing site (hero + three acts + about + footer)
- `privacy.html` — privacy policy (long-form text, simple layout)

**Tech stack — vanilla, no build step:**
- Plain HTML + CSS (CSS custom properties for theming) + minimal vanilla JS
- No frameworks, no preprocessors, no `node_modules`, no `package.json`
- Push to `main` and the site is live

**Repo & URL:**
- Rename remote from `Parsee-website` to `parsee` (lowercase)
- Final URL: `nimomix.github.io/parsee`
- No custom domain (decision deferred indefinitely)

**Deployment:** GitHub Pages from `main` branch, root directory. No GitHub Actions.

**Analytics:** None. App Store Connect already provides conversion data. Cloudflare Web Analytics can be added later as a one-line script if desired.

**File structure:**

```
parsee/                         (renamed from Parsee-website)
├── index.html
├── privacy.html
├── styles.css
├── app.js                      (smooth scroll, scroll-fade observer)
├── images/                     (already populated)
├── favicon.ico
├── docs/superpowers/specs/     (this file)
└── README.md                   (one-liner)
```

## 3. Visual system

### Color & mode
Light by default with automatic dark mode via `prefers-color-scheme`. Apple-canonical: light page, dark screenshots float on it as crisp windows.

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#ffffff` | `#0a0a0c` |
| `--bg-alt` | `#fafafa` | `#111114` |
| `--text` | `#1d1d1f` | `#f5f5f7` |
| `--text-muted` | `#86868b` | `#86868b` |
| `--accent` | tuned to Parsee icon blue (~`#007AFF`, will sample from icon during implementation) | brighter variant for dark mode contrast |
| `--divider` | very subtle (~`rgba(0,0,0,0.06)`) | `rgba(255,255,255,0.06)` |

### Typography
System stack with Inter as web-font fallback for non-Apple platforms:

```
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif;
```

Mac users see SF Pro Display (matches the app exactly). Windows/Linux users get Inter (Mac-adjacent quality, used by Linear and Vercel). Self-host Inter or load from a single `<link>` to a CDN — final choice during implementation, default to self-hosted for resilience.

**Type scale:**
- Hero title: 64px desktop, 40px mobile
- Section heading: 48px desktop, 32px mobile
- Sub-feature title: 28px
- Body: 17px
- Secondary: 15px
- Display sizes use slightly tightened letter-spacing (Apple style)

### Layout grid
- Max content width: **1200px**
- Side margins: ~80–120px desktop, 24px mobile
- Spacing scale on 8px: `8, 16, 24, 32, 48, 64, 96, 128, 192`
- Section vertical separation: ~128–160px desktop

### Motion
- Subtle fade + small Y-translate on scroll-into-view via `IntersectionObserver` (one-shot, not retriggering)
- Smooth scroll for anchor links
- No parallax, no carousels, no autoplay
- `prefers-reduced-motion: reduce` disables all transforms and fades

### Responsive
- Mobile-first CSS
- Breakpoints: 768px (tablet), 1024px (desktop)
- Screenshots full-width on mobile, contained on desktop

### Three-act background tones
Subtle alternating tones to give the page rhythm without being loud:

| Section | Light | Dark |
| --- | --- | --- |
| Hero | `--bg` | `--bg` |
| Act 1 | `--bg` | `--bg` |
| Act 2 | `--bg-alt` | `--bg-alt` |
| Act 3 | `--bg` | `--bg` |
| About | `--bg-alt` | `--bg-alt` |
| Footer | `--bg` | `--bg` |

## 4. Hero

**Layout:** Centered, generous white space. No top navbar.

**Structure:**
1. Parsee icon (small-medium, ~96px square)
2. Wordmark "Parsee" (large display)
3. **Tagline:** *"Parse. See. Understand."*
4. Mac App Store badge (Apple-provided official badge)
5. Microcopy under badge: *"Free 30-day trial"*
6. Hero screenshot (`hero.png`) — large, soft drop shadow, contained within max content width

**Icon source:** `images/parsee_square_corners.jpg` (current). Replace with a higher-resolution rounded variant during implementation if available. The implementer will verify the icon rendering and may need to request a new export.

**App Store URL:** `https://apps.apple.com/us/app/parsee-json-viewer/id6756983590`. Wire into the hero badge link, the footer CTA, and any other CTA touchpoints. Treat as a single-source variable in the HTML so future updates are one-line changes.

## 5. Act 1 — Open. From anywhere.

**Heading:** *Open. From anywhere.*
**Subhead:** *Files, paste, URLs, Xcode — all one shortcut away.*

Two sub-sections:

### 5.1 Open from anywhere
- **Anchor screenshot:** `images/parsee-home.png` (Parsee welcome window — paste, open file, fetch URL, recents)
- **Supporting screenshot:** `images/services-menu.png` (right-click any selected JSON text → Services → Open JSON in PARSEE) — smaller, off-center beside or below the anchor
- **Body copy (single short paragraph + tight line of capabilities):**

> Parsee meets your JSON wherever it shows up.
>
> System-wide hotkey · paste · drag-drop · fetch from URL · right-click any text in any app · default opener for `.json` files

### 5.2 Bonus for Xcode users — LLDB integration
- **Anchor screenshot:** `images/lldb-xcode.png` (Xcode paused at breakpoint + Parsee window beside it; full content width because the screenshot is wide)
- **Body copy:**

> An optional power feature for the Xcode crowd. Pause at a breakpoint, type one command, and any variable opens in Parsee.
>
> `parsee <var>` · `parsee scope` · `parsee live` (auto-updates on every step)

This sub-section is explicitly framed as **optional** so non-Xcode users skim past without confusion.

## 6. Act 2 — Find. Filter. Focus.

**Heading:** *Find. Filter. Focus.*
**Subhead:** *From thousand-line JSON to the one value you care about.*

Three sub-sections, each with one anchor screenshot + one short paragraph (~25 words). No bullet lists in this act so they don't compete with the rich screenshots.

### 6.1 Search
- **Screenshot:** `images/search.png`
- **Copy:**

> Type to find. Press ⌘F to focus the field. Highlights persist as you navigate so you can compare matches without losing your place.

### 6.2 Filter
- **Screenshot:** `images/filter.png`
- **Copy:**

> Persistent path-based filters: wildcards, index ranges, multiple filters at once. The tree updates live to show only what matches.

### 6.3 Focus Mode
- **Screenshot:** `images/focus-mode.png`
- **Copy:**

> Dive into any node and see its structure without the tree decorations. Volume bars show relative sizes, type icons mark each field, and inline insights appear without leaving the view.

## 7. Act 3 — Analyze. Compare. Ask.

**Heading:** *Analyze. Compare. Ask.*
**Subhead:** *Insights, diffs, and AI answers — all in one place.*

Three sub-sections, same rhythm as Act 2.

### 7.1 Insights
- **Screenshot:** `images/insights.png`
- **Copy:**

> Tap the insights button on any node and Parsee opens a structured analysis: field availability, unique values, value counts, distributions. All of it as readable JSON.

### 7.2 Compare
- **Screenshot:** `images/compare.png`
- **Copy:**

> Drop two JSONs side by side and Parsee shows exactly what changed: added, removed, modified. Works on huge files instantly.

### 7.3 Ask AI
- **Screenshot:** `images/ask-ai.png`
- **Copy:**

> Ask questions about your data in plain English — without leaving Parsee or pasting into another tab. Filter first to narrow the focus, or ask the whole file at once.

The depth-limit / token-protection behavior is intentionally not surfaced in marketing copy; it's an implementation detail that's better described in in-app help or an FAQ if needed later.

## 8. About + Footer + Privacy

### About (inline block above the footer)

Single ~720px-wide centered paragraph, first-person, indie-developer warm:

> *I'm Nimrod Bar, a macOS and iOS developer. I work with JSON every day and got tired of using browser tabs and online viewers to read it. Parsee is the tool I wished existed.*

### Footer

```
       ─────────────────────────────────

   [ Download on the Mac App Store ]
            Free 30-day trial

   Privacy · Support · About · © 2026 Nimrod Bar

              [Parsee mark]
```

- Single CTA repeat (App Store badge) so the page closes on conversion
- Footer links:
  - **Privacy** → `privacy.html`
  - **Support** → `mailto:parsee.json@gmail.com`
  - **About** → in-page anchor (`#about`)
- No social icons (no Twitter/Mastodon/X presence)
- No "Made in [city]" line (skipped intentionally)
- Subtle Parsee mark at the bottom

### Privacy page (`privacy.html`)

- Same header style as `index.html` (small Parsee mark, page title "Privacy Policy")
- "← Back to Parsee" link at the top
- Content body: long-form text, max-width ~720px for readability, larger line-height (~1.65)
- Same footer as `index.html`

**Content reconciliation required:** The existing privacy gist (`https://gist.github.com/nimomix/94e5e89cb4fe372118c0b99573daaa60`) discloses **TelemetryDeck** only. The actual app uses **both TelemetryDeck and Aptabase**. The privacy page must accurately disclose both, with what each collects:

- **TelemetryDeck** — anonymous usage signals (sessions, app version, OS, device class)
- **Aptabase** — event-level analytics (named events such as feature use, trial milestones, paywall views)
- Both are privacy-respecting by design (no PII, no IP retention, etc. — verify against vendor docs during implementation)

The implementer should pull the gist content as a starting point, then add an accurate Aptabase section. The full diff between the gist and the new page should be reviewed before publishing.

## 9. Asset inventory

All assets live in `images/`. Inventory at time of design:

| File | Used in | Purpose |
| --- | --- | --- |
| `parsee_square_corners.jpg` | Hero, Footer | App icon |
| `hero.png` | Hero | Main tree-view shot of coffee JSON |
| `parsee-home.png` | Act 1.1 | Welcome window (paste, open, fetch, recents) |
| `services-menu.png` | Act 1.1 | macOS Services menu showing "Open JSON in PARSEE" |
| `lldb-xcode.png` | Act 1.2 | Xcode paused at breakpoint + Parsee side-by-side |
| `search.png` | Act 2.1 | Type-to-search with 2/2 counter |
| `filter.png` | Act 2.2 | Multi-filter on coffee JSON |
| `focus-mode.png` | Act 2.3 | Focus Mode on `catalog[2]` |
| `insights.png` | Act 3.1 | Insights panel + bar chart |
| `compare.png` | Act 3.2 | production.json → staging.json with three change types |
| `ask-ai.png` | Act 3.3 | Ask AI with substantive answer |
| `ask-ai-empty.png` | (unused, optional secondary) | Ask AI welcome state — not currently used |

The unused `ask-ai-empty.png` may be removed during implementation or kept as a backup.

## 10. Open items / decisions deferred to implementation

These are intentionally not pinned in this spec; the implementation plan should resolve each:

1. **App Store URL** — confirmed: `https://apps.apple.com/us/app/parsee-json-viewer/id6756983590`. Treat as a single-source variable in the HTML.
2. **Icon variant** — confirm `parsee_square_corners.jpg` renders well at 96px. If not, request a higher-resolution rounded export from the user.
3. **Accent color exact value** — sample from the Parsee app source at `/Users/nbar/Projects/Parsee/` (asset catalog or theme files) during implementation. Likely a blue tuned to the app icon; pick the canonical "Parsee blue" already defined in code rather than eyeballing from screenshots.
4. **Inter font hosting** — self-host versus CDN. Default to self-host.
5. **Gist content reconciliation for privacy page** — fetch current gist content and merge with Aptabase disclosure.
6. **Repo rename** — Nimrod renames `Parsee-website` → `parsee` on GitHub (Settings → Rename) before the first GitHub Pages deploy. The implementer then runs `git remote set-url origin <new url>` locally to point at the renamed remote, and confirms the GitHub Pages settings (Source: Deploy from branch → main → /).
7. **Favicon** — derive from the app icon during implementation.
8. **README** — single short paragraph explaining the repo's purpose.

## 11. Out of scope

Explicitly **not** part of this site:

- No themes screenshot section (decided — the page already shows dark via the screenshots; a 4-theme grid would be padding)
- No analytics scripts
- No social media links
- No blog, changelog, or roadmap pages
- No newsletter signup
- No live demo / interactive playground
- No internationalization (English only)
- No A/B testing infrastructure

If any of these become priorities later they get their own spec — they don't sneak into the v1 build.

## 12. Success criteria

The site is "done" when:

1. `nimomix.github.io/parsee` resolves to the new site (with the renamed repo).
2. All 9 features (across the three acts) are present with their associated screenshots.
3. The hero CTA, footer CTA, and any other App Store buttons all link to the same App Store URL (single source).
4. The privacy page accurately discloses both TelemetryDeck and Aptabase.
5. The page renders correctly in light and dark mode on Safari, Chrome, and Firefox at desktop and mobile widths.
6. `prefers-reduced-motion` actually disables all transforms.
7. The page passes a basic Lighthouse pass on Performance, Accessibility, and Best Practices.
8. The implementer has manually verified the hero, all 9 feature sections, the about block, the footer, and the privacy page by viewing the live site (or a local preview) end-to-end.
