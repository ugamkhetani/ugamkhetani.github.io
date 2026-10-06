import { defineConfig } from 'astro/config';

/* Normalised once so the config, the redirects and href() cannot disagree.
   Always slash-terminated, which is the shape Astro's own BASE_URL takes:
   "/" with nothing set, "/portfolio/" whether BASE_PATH arrives as
   "portfolio", "/portfolio" or "/portfolio/". */
const BASE = `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

export default defineConfig({
  /**
   * SITE AND BASE ARE READ FROM THE ENVIRONMENT, AND BOTH DEFAULT TO SAFE.
   *
   * There is no domain yet. `site` used to be hard-coded to
   * https://ugamkhetani.com, which was a claim the deployment could not keep
   * — canonical tags would have pointed at an address that does not serve
   * this site. Unset, no canonical is emitted at all (see Base.astro), which
   * is the honest state until there is somewhere to point at.
   *
   * `base` is what actually breaks a GitHub Pages deployment. Served from
   * a project repo the site lives under /<repo>/, and every link typed by
   * hand in the markup would 404 while every generated asset resolved fine.
   * src/lib/href.ts fixes the links; this makes the prefix settable without
   * editing anything.
   *
   *   SITE_URL=https://example.com BASE_PATH=/portfolio/ npm run build
   *
   * The workflow in .github/workflows/deploy.yml fills both in from whatever
   * GitHub Pages reports for the repository, so a project repo, a user site
   * and a custom domain added later all build correctly with no edit here.
   */
  site: process.env.SITE_URL || undefined,
  base: BASE,
  trailingSlash: 'ignore',
  /* host is pinned to IPv4 loopback on purpose. Left to itself the dev
     server binds only to [::1], and this machine's /etc/hosts maps
     `localhost` to BOTH 127.0.0.1 and ::1 — so a browser that picks IPv4
     gets connection refused while the server is running perfectly well.
     Measured: [::1]:4323 answered 200, 127.0.0.1:4323 answered nothing. */
  server: { host: '127.0.0.1', port: Number(process.env.PORT) || 4327 },
  /* /about and /contact were standalone pages until the home page became one
     page carrying both as sections. They are gone, but the URLs existed and
     may have been sent to people, so they redirect to the sections that
     replaced them rather than 404. Astro emits a meta-refresh page with a
     canonical link for each in a static build. */
  /* THE TARGETS CARRY THE BASE AND ASTRO DOES NOT ADD IT. Astro prefixes the
     redirect's SOURCE — /about becomes /portfolio/about — and leaves the
     destination string exactly as written, so a hard-coded "/#about" would
     bounce a visitor out of the site to the server root. Measured on a
     BASE_PATH=/portfolio/ build before this was fixed: the emitted
     meta-refresh read `url=/#about`. */
  redirects: {
    '/about': `${BASE}#about`,
    '/contact': `${BASE}#contact`,
    /* /contents was the catalogue read as an end-credit roll. Removed on
       2026-09-07 because it was not being used. Same argument as the two
       above: the URL existed, so it lands on the home page rather than
       404ing. The page itself is in git history if the roll is ever
       wanted back. */
    '/contents': BASE,
  },
  build: { inlineStylesheets: 'auto' },
  image: {
    // Frames are served at a handful of fixed widths; nothing larger is ever useful.
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
