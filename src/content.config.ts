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

    /**
     * REPLACES THE YEAR on the line above the title — "Feature Film ·
     * Theatrical" rather than "Feature Film · 2026". Nothing else uses it and
     * nothing else should: it exists because one work's release matters more
     * than its date, and a page whose head said both would be saying the
     * category twice over.
     *
     * ONLY DIWALI KE SHOR MEIN SETS ONE, added 2026-09-06 on Ugam's
     * instruction. The year is not lost when it does — that work carries a
     * "Year" row in `meta`, which sets in the credits like every other fact.
     * A work that sets this WITHOUT such a row would drop its year from the
     * page entirely, so check before adding a second.
     */
    overline: z.string().optional(),

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

    /**
     * WHERE THE STANDFIRST BREAKS, when it must break somewhere the measure
     * would not choose. The first sentence of `description` is set as the
     * standfirst; this is the exact text that should end its first line.
     *
     * IT IS OPT-IN AND IT FAILS SOFT. If the string is not the opening of
     * that sentence — because the description was rewritten and this was
     * not — the break is ignored and the sentence sets the way every other
     * one does. It never throws and it never sets a break in the wrong
     * place.
     *
     * AND IT IS A DESKTOP INSTRUCTION. Below 620px the break stands down and
     * the sentence wraps to the column, because a forced break needs a
     * measure wide enough to hold the longer of the two halves and a phone
     * does not have one. ONLY MUMBAI STANDARD TIME SETS ONE, on Ugam's
     * instruction 2026-09-29: "A 48-hour production window" / "spanning
     * idea, script, image and sound."
     */
    ledeBreak: z.string().optional(),

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
