# FutureSwarm

A premium, original corporate website for FutureSwarm — an advanced
engineering company working on space infrastructure, artificial
intelligence, robotics, quantum computing, sustainable energy, and
long-term Dyson Sphere-scale research. Built with plain HTML, CSS, and
JavaScript — no framework, no build step, no dependencies.

## Files

- `index.html` — page structure and content
- `style.css` — design system, layout, and all animation
- `script.js` — interactivity: launch sequence, search, theme, reveal, forms
- `logo-mark.svg` — icon-only logo mark (favicon-style, transparent background)
- `logo-full.svg` — full logo lockup (mark + wordmark)
- `favicon.svg` — standalone favicon file (the live site also inlines this
  directly in `index.html` as a data URI, so no extra request is needed)

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push these files to the `main` branch of a new repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch `main`, folder `/ (root)`, then **Save**.
5. Your site publishes at `https://<your-username>.github.io/<your-repo>/`.

No build step or server-side code is required.

## Design system

**Palette** — deep black, graphite, and charcoal surfaces with a metallic
gold / champagne / copper / silver accent family. No blue, cyan, teal,
purple, or neon anywhere in the palette (including the starfield, particle
field, and rocket exhaust, which are all warm-toned rather than the more
common cool-toned space aesthetic).

**Type** — Space Grotesk for display/headings, Inter for body copy,
JetBrains Mono for data readouts, labels, and status text.

**Logo** — a minimal ringed-sphere mark (Saturn / orbital-ring / Dyson
Sphere inspired) with a single orbiting star, rendered in metallic gold.
Used at three scales: the favicon (simplified for legibility at 16px), the
nav mark, and the full lockup with wordmark (`logo-full.svg`).

## Opening launch sequence

A ~5 second cinematic: a rocket lifts off an Earth horizon silhouette,
ignites, and accelerates into orbit before the interface reveals itself.

- Plays in full only on a visitor's **first visit** (stored via
  `localStorage`); returning visitors get an instant reveal.
- **Skip intro** button is available immediately; `Esc` also skips.
- Fully disabled under `prefers-reduced-motion`.
- Pure CSS transform/opacity animation — no per-frame JS — so it costs
  nothing once it's finished, and the loader is removed from the DOM
  entirely after it clears.
- ⚠️ `localStorage` isn't available inside Claude.ai's in-chat preview
  sandbox, so the intro will simply replay on every reload there. It works
  as intended the moment this file is opened directly or hosted on GitHub
  Pages.

## Site-wide search

Click the search icon in the nav, or press **⌘K** / **Ctrl+K**, to open a
spotlight-style search overlay. It indexes every major section (vision,
research divisions, future projects, roadmap, news, publications, careers,
FAQ, contact) with live filtering, arrow-key navigation, and Enter to jump
to a result. Since this is a single-page site, "search" covers all
on-page content rather than separate pages — there's only one page.

## Sections

Hero · Vision & Mission · Research (five divisions: Cognition, Orbital,
Quantum, Motion, Aegis) · Future Projects (incl. Dyson Sphere research) ·
Roadmap/Timeline · News · Publications · Careers · FAQ · Contact · Footer.

## Accessibility & performance

- Respects `prefers-reduced-motion` throughout (intro, scroll reveals,
  floating/orbit decoration, starfield).
- Keyboard-operable nav, search, and FAQ; visible focus states.
- All animation is transform/opacity driven for smooth performance on
  mobile; decorative layers (grid overlay, orbit rings, particle density)
  scale down on small screens.
- Semantic HTML, descriptive `aria-label`s, and an accessible loading
  announcement for screen reader users.

## Notes

- The contact form is client-side only (no backend). Wire `initContactForm`
  in `script.js` to your own endpoint or a service like Formspree for real
  message delivery.
- News, Publications, and Careers entries are marked "In development" as
  placeholder content — swap in real posts, papers, and roles as they
  become available.
