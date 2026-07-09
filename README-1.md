# TechVerse

A premium, futuristic single-page site for a 2035-era technology company —
built with plain HTML, CSS, and JavaScript. No build step, no dependencies.

## Files

- `index.html` — page structure and content
- `style.css` — design system, layout, animations
- `script.js` — particle field, theme toggle, counters, FAQ, form, scroll reveal

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push these three files (plus this
   README) to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
5. GitHub will publish the site at:
   `https://<your-username>.github.io/<your-repo>/`

No further configuration is needed — the site is a static bundle and has
no server-side dependencies.

## What's new in this update

- Vision & Mission section, a 7-item Future Projects grid (including Dyson
  Sphere research), and a "Current status" strip.
- Loading animation, typewriter hero heading, parallax star-field,
  floating ambient particles, 3D card tilt, and glow hover effects —
  all disabled automatically for `prefers-reduced-motion` and touch devices.
- Contact section renamed "Connect with TechVerse" with Email, GitHub,
  LinkedIn, X, and Instagram channels, plus a glassmorphism success panel.

## Cinematic animation upgrade

Structure, content, and branding are unchanged — this pass only replaced
the motion and visual-effects layer:

- Layered deep-space backdrop: a drifting star-field (depth-based parallax)
  behind the existing constellation canvas, plus a faint moving HUD grid.
- Orbital rings with an orbiting marker decorate the hero, evoking a
  spacecraft nav display.
- Holographic scanlines and glowing HUD corner brackets on division icons
  and future-project cards, which now read as lit-up tech modules with
  a 3D tilt + glow on hover.
- Cinematic hero entrance: a mission-interface zoom-in synced to the
  loading screen, a light-sweep shimmer across the gradient headline, and
  a typewriter reveal that starts the instant the loader clears.
- Scroll reveals now slide up with a slight scale/blur settle, staggered
  across grid and timeline items.
- Slow floating motion on cards/icons and pulsing energy glows around the
  contact card and status strip.
- Everything above is disabled under `prefers-reduced-motion`, and
  decorative layers are scaled back on small screens to keep things fast.

## Notes

- Fonts (Space Grotesk, Inter, JetBrains Mono) load from Google Fonts via CDN.
- The contact form is client-side only (no backend). Wire `script.js`'s
  `initContactForm` up to your own endpoint or a service like Formspree if
  you need real message delivery.
- Respects `prefers-reduced-motion` for the particle field and scroll reveals.
