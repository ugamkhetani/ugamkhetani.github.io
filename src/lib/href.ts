/**
 * INTERNAL LINKS THAT SURVIVE BEING SERVED FROM A SUBPATH.
 *
 * Written 2026-09-30, preparing the site for GitHub Pages before a domain
 * exists. The question it answers is narrow and worth stating exactly:
 *
 * ASTRO PREFIXES THE ASSETS IT GENERATES WITH `base` AND NOTHING ELSE. Image
 * URLs, the hashed CSS and JS under /_astro/, and anything imported through
 * the build all come out correct when `base` is set. An `href` you typed by
 * hand does not — it is a string in your markup and the build never looks
 * inside it. So at ugamkhetani.github.io/portfolio/ every optimised image
 * loads and every link 404s, which is the worst possible failure because the
 * page looks perfectly fine until you click.
 *
 * THERE ARE ONLY SIX PLACES IN THE LIVE SITE THAT TYPE ONE, counted rather
 * than assumed: three work-card links (Still, Frame, NextWork), two in the
 * contact footer, and the anchor OpNav is given on work pages. They all come
 * through here now.
 *
 * `import.meta.env.BASE_URL` IS ALWAYS SLASH-TERMINATED — "/" when no base
 * is set, "/portfolio/" when one is — so the argument must not start with a
 * slash or the join doubles it. Stripping leading slashes here means callers
 * can pass either form and neither breaks.
 *
 * <- IT IS DELIBERATELY NOT USED IN src/pages/preview/. Those pages are not
 *   built for production at all (see astro.config.mjs), so they only ever
 *   run on the dev server, where the base is always "/". Rewriting seventy-
 *   five drafts to fix a problem they cannot have would be churn.
 */

/** "/" with no base set, "/portfolio/" with one. Always ends in a slash. */
export const BASE: string = import.meta.env.BASE_URL;

/**
 * An internal URL, with the deployment's base applied.
 *
 *   href()            -> "/"            or "/portfolio/"
 *   href('work/ira')  -> "/work/ira"    or "/portfolio/work/ira"
 *   href('/work/ira') -> the same; a leading slash is tolerated
 */
export function href(path: string = ''): string {
  return BASE + path.replace(/^\/+/, '');
}
