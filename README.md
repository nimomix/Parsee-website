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
