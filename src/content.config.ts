import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One markdown file per work, in src/content/works/.
 * Everything below is validated at build time — a typo fails the build
 * with a readable message instead of quietly breaking a page.
 */
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    category: z.enum([
      'Feature Film',
      'Web Series',
      'Short Film',
      'AI Film',
      'Micro Drama',
      'Spec Trailer',
      'Brand Work',
      'Song',
    ]),

    /** Large frame at the top of the homepage. */
    lead: z.boolean().default(false),

    /** Decides how the project page opens. */
    opening: z.enum(['video', 'still', 'typographic', 'audio', 'composition']),

    /** The format the work was actually made in. Drives the frame shape. */
    ratio: z.enum(['2.39:1', '2.35:1', '2.08:1', '21:9', '2:1', '16:9', '3:2', '4:3', '4:5', '9:16', '1:1']),

    role: z.string(),

    credits: z
      .object({
        director: z.string().optional(),
        client: z.string().optional(),
        studio: z.string().optional(),
        production: z.string().optional(),
        with: z.string().optional(),
        artist: z.string().optional(),
      })
      .default({}),

    awards: z
      .array(z.object({ star: z.boolean().default(false), text: z.string() }))
      .default([]),

    /** Pull quote, set in Fraunces italic. One per page, kept short. */
    quote: z.string().optional(),

    description: z.string(),

    /** The four-column mono block below the media. */
    meta: z.array(z.object({ label: z.string(), value: z.string() })).default([]),

    media: z
      .object({
        youtube: z.string().optional(),
        /** Vimeo, as "<id>/<privacy-hash>" for an unlisted film, or just
         *  "<id>" for a public one. Kept separate from youtube rather than a
         *  single url field: each player needs its own embed shape, and a
         *  bare url would have to be parsed at render time to tell which. */
        vimeo: z.string().optional(),
        /** An Instagram post or reel, as its short code — the DQZiyPUDSEB in
         *  instagram.com/p/DQZiyPUDSEB/. Only public posts can be embedded. */
        instagram: z.string().optional(),
        films: z
          .array(
            z.object({
              src: z.string(),
              poster: z.string().optional(),
              label: z.string(),
              href: z.string().url().optional(),
              ratio: z.enum(['16:9', '9:16', '1:1']).default('9:16'),
            })
          )
          .default([]),
        audio: z
          .array(z.object({ src: z.string(), title: z.string() }))
          .default([]),
      })
      .default({}),

    /** Platforms that cannot be embedded. Rendered as an editorial fallback. */
    external: z
      .object({
        platform: z.string(),
        label: z.string(),
        url: z.string().url(),
      })
      .optional(),

    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
          platform: z.string(),
        })
      )
      .default([]),

    /** Homepage scrub stills, in order. Files live in src/media/works/<slug>/frames/. */
    frames: z.array(z.string()).default([]),

    /** Base alt text. Frame index is appended automatically. */
    alt: z.string(),
  }),
});

export const collections = { works };
