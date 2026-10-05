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

    /**
     * WHAT THE WORK SAYS ON HOVER in Selected works — up to four rows, in
     * the order they are set, each with its own label.
     *
     * IT IS WRITTEN RATHER THAN DERIVED, from 2026-09-29, and the reason is
     * that no derivation survives contact with the list. src/lib/wkinfo.ts
     * used to build these from `category`, `meta`, `role` and `external`,
     * and Ugam's selection cuts across all of it: Format is the CATEGORY on
     * nine works and the `meta` Format row on seven; the third row is Role
     * on eight and Scope on eight; The Shiva Trilogy and Roar name no
     * platform at all although both carry a YouTube link; and Diwali says
     * "Theatrical", which is not a platform anywhere in the data. Those are
     * editorial choices about what a glance should answer, not facts waiting
     * to be looked up.
     *
     * IT IS A SECOND STATEMENT OF FACTS THE COLOPHON ALSO CARRIES, and that
     * is the cost. A work whose Role or Scope changes has two places to
     * change. The alternative was a derivation with sixteen exceptions in
     * it, which is the same duplication with the seams hidden.
     *
     * A work that sets none falls back to the old derivation, so nothing
     * breaks if one is added without this block.
     */
    hover: z.array(z.object({ label: z.string(), value: z.string() })).default([]),

    /**
     * WHAT THE OPENING'S CONTROL SAYS. Applied 2026-10-06 with ab-zw12, when
     * the watch control went to every work page and each one needed its own
     * words: six say "Watch", Diwali "Watch trailer", three "View on
     * Instagram", Aladdin "View".
     *
     * IT IS NOT DERIVED, AND THAT IS DELIBERATE. A rule over `opening` and
     * `media` could guess most of these and would be wrong about the rest:
     * Bloody Bubbly and Dinshaw's are both Instagram and say the same thing
     * while one plays in the page and one leaves it, and Aladdin's films sit
     * on Drive, which is not a name to put in front of a reader. These are
     * Ugam's words per work.
     *
     * A work without one falls back to what it had: "Watch" on a facade, and
     * FilmPlayer's own "View on <origin>" under a film.
     */
    cta: z.string().optional(),

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
