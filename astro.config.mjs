import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ugamkhetani.com',
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
  redirects: {
    '/about': '/#about',
    '/contact': '/#contact',
    /* /contents was the catalogue read as an end-credit roll. Removed on
       2026-09-07 because it was not being used. Same argument as the two
       above: the URL existed, so it lands on the home page rather than
       404ing. The page itself is in git history if the roll is ever
       wanted back. */
    '/contents': '/',
  },
  build: { inlineStylesheets: 'auto' },
  image: {
    // Frames are served at a handful of fixed widths; nothing larger is ever useful.
    responsiveStyles: true,
  },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
