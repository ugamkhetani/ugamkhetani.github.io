import { defineConfig } from 'astro/config';
import fs from 'node:fs';

/**
 * THE PREVIEW LIBRARY IS NOT PUBLISHED.
 *
 * Seventy-five draft pages live in src/pages/preview/. They are a kept
 * library — argued over, measured, and referenced by name from comments all
 * over this codebase — but they are working drawings, not the site, and
 * putting them on the open internet publishes every unreleased idea in it.
 *
 * SO THEY ARE EXCLUDED FROM THE BUILD RATHER THAN DELETED OR MOVED. Nothing
 * is removed from git and nothing changes on the dev server: `npm run dev`
 * still serves /preview/ and /preview/index exactly as before, because this
 * only runs at build time. It cuts 75 pages and 8.8MB of HTML from what
 * ships.
 *
 * SET PREVIEW=1 TO BUILD THEM ANYWAY — useful for checking that a draft
 * still compiles, which the build is otherwise no longer doing.
 *
 * <- IT REMOVES THEM FROM THE OUTPUT RATHER THAN FROM THE ROUTE TABLE, and
 *   the first attempt did the latter. `astro:routes:resolved` hands you the
 *   route list and splicing seventy-five entries out of it reports exactly
 *   that — "75 routes dropped" — and then builds all seventy-five anyway,
 *   because in Astro 5.2 the build does not read back the mutated array.
 *   Measured, not assumed: the log said 75 and `find dist -name '*.html'`
 *   still returned every draft. So the removal happens in
 *   `astro:build:done`, which is the last hook before the build ends and
 *   is verifiable by listing the directory afterwards.
 *
 * <- WHICH MEANS THEY ARE STILL RENDERED, and that is the honest cost: the
 *   build spends about a second on pages it then deletes, and any image a
 *   draft alone referenced stays in _astro with nothing pointing at it.
 *   Measured after: 21 pages ship and the output is 73MB against 82MB with
 *   them included. Most of that 9MB is the drafts' own HTML; the orphaned
 *   images are the small remainder, because the drafts render the same
 *   works the live site does and share its optimised files.
 */
function withoutPreview() {
  return {
    name: 'without-preview',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        if (process.env.PREVIEW) {
          logger.info('PREVIEW=1 — the draft library is published in this build');
          return;
        }
        const out = new URL('preview/', dir);
        const n = fs.existsSync(out) ? fs.readdirSync(out).length : 0;
        await fs.promises.rm(out, { recursive: true, force: true });
        logger.info(`draft library not published — ${n} entries removed from the output`);
      },
    },
  };
}

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
  integrations: [withoutPreview()],
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
