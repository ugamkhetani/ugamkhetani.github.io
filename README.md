# Ugam Khetani — Portfolio

Sixteen works, twenty pages. Every project is one markdown file; every image
is a file in a folder. There is no CMS to log into and no database.

For the full picture — architecture, decisions, and the traps that cost real
time — see **HANDOFF.md**. This file is the day-to-day one.

---

## Running it

```bash
npm install
npm run dev -- --port 4323
```

Then <http://localhost:4323>. Port 4323 is deliberate — 4321 belongs to a
different project of yours that is often running.

To check the real thing before publishing:

```bash
npm run build
npm run preview
```

If `npm run build` fails it tells you exactly which file and which line. That
is deliberate. A broken build is safer than a broken page.

**If a change doesn't show up,** it is almost always a stale dev cache:

```bash
rm -rf node_modules/.vite .astro && npm run dev -- --port 4323
```

---

## The pages

| Page | What it is |
| --- | --- |
| `/` | The catalogue. Sixteen frames, no text, no bio. |
| `/work/<slug>` | One per project, five opening types. |
| `/contents` | The catalogue read as names — an end-credit roll. |
| `/about` | Five ruled movements — who, how, across, proof, closing. |
| `/contact` | Three questions you tap, then it writes the email for you. |

---

## Adding or editing a project

Each work is one file in `src/content/works/`. Copy an existing one and change
the fields. The filename becomes the web address: `taskaree.md` → `/work/taskaree`.

```yaml
title: "Taskaree"
year: 2026
category: "Web Series"        # must be one of the eight below
lead: true                    # true = large frame near the top of the homepage
opening: still                # how the page opens — see the five types
ratio: "3:2"                  # the format the work was made in
role: "Additional Composer"
credits:
  director: "Neeraj Pandey"
  with: "Composed with Advait Nemlekar"
awards:
  - star: true                # star = a win, no star = a selection
    text: "Best AI Film · MIFF 2026"
quote: "Cue work that breathes across episodes, not scenes."
description: >
  Two or three sentences. This is the only prose on the page.
meta:
  - { label: "Platform", value: "Netflix" }
alt: "Still from Taskaree"
```

**Categories** — `Feature Film`, `Web Series`, `Short Film`, `AI Film`,
`Micro Drama`, `Spec Trailer`, `Brand Work`, `Song`.

**Openings** — the page composes itself around the material you actually have:

| `opening` | What it does |
| --- | --- |
| `video` | Full-bleed poster; the film plays inside the page |
| `still` | One large still, title beneath, wide margins |
| `typographic` | No image. Title set enormous against the ground |
| `audio` | Cover art and the player as the hero |
| `composition` | Asymmetric grid, for multi-part works |

**Ratios** — `2.39:1`, `2.35:1`, `2.08:1`, `21:9`, `2:1`, `16:9`, `3:2`,
`4:3`, `4:5`, `9:16`, `1:1`. Adding one means editing `src/content.config.ts`
*and* both RATIO maps in `src/data/composition.ts`. Use the format the piece
was genuinely made in — the frame's shape tells a visitor what kind of work it
is before they read anything.

---

## Where files go

```
src/media/works/<slug>/frames/     01.jpg  02.jpg  03.jpg     ← stills
public/media/works/<slug>/films/   reel-01.mp4                ← video
public/media/works/<slug>/audio/   excerpt.m4a                ← audio
src/media/about/portrait.jpg                                  ← the About portrait
public/fonts/                                                 ← the three woff2
```

The folder name matches the markdown filename. Nothing to register anywhere.

- **Stills** go in `src/media/…` — compressed, converted and resized at build.
  Give the largest version you have. Three to five per work makes the hover
  scrub work properly; one is fine. Name them `01.jpg`, `02.jpg`… **every file
  in the folder is used, in filename order.** To reorder, rename. To remove
  one, delete it.
- **Films and audio** go in `public/media/…` — served as-is, so compress them
  first. Every MP4 in the folder becomes a player, labelled from the filename
  (`reel-01.mp4` → "Reel 01"). Until a file arrives that slot shows the still
  with a link to the original post, never a broken player.

---

## Editing the words

| Want to change | Edit |
| --- | --- |
| The homepage arrangement | `src/data/composition.ts` |
| Anything on About | `src/data/about.ts` |
| Contact questions, options, fields, links | `src/data/contact.ts` |
| A project's copy | its file in `src/content/works/` |

`composition.ts` is the homepage written out as a score — a column position, a
width, an optional downward offset, and `pause` for the empty space after a
group. Scroll order *and* catalogue numbering both come from it, so they can
never drift apart.

```ts
{
  items: [
    { slug: 'diwali-ke-shor-mein', col: 1, span: 6 },
    { slug: 'broken-reflections', col: 9, span: 4, offset: 26 },
  ],
  pause: 24,
}
```

---

## Still outstanding

1. **Neue Haas Grotesk Display** — drop three `.woff2` into `public/fonts/`
   and they activate themselves. Falls back to Helvetica Neue today.
2. **The fourteen films** — 4 Dinshaw's, 6 Book My Yamraj, 4 Aladdin.
3. **Bloody Bubbly** — four assumed fields, marked `←` in its markdown.
4. **A portrait for About** — name it in `PORTRAIT` in `src/data/about.ts`.
5. **A booking link** — paste it into `CALL_URL` in `src/data/contact.ts` and
   the "rather talk" line appears. Empty means it never renders.
6. **Audio excerpts** — optional; the player is built and waiting.

All sixteen works have real stills. No stand-ins remain.

---

## Publishing

Push to GitHub, connect the repository to Vercel or Netlify, take the defaults
— both detect Astro. Build command `npm run build`, output directory `dist`.
Every push republishes.

---

## How it behaves

- **Hover scrubs, it does not slideshow.** Moving across a frame cuts between
  that work's stills. On a phone, the frame nearest the middle of the screen
  advances itself and stops when it moves away.
- **One piece of media at a time,** across the whole site.
- **Nothing from YouTube loads until someone presses play.**
- **Contact writes the email for you.** Tap the answers, and the message is
  composed and handed to your mail app. Nothing is sent and nothing is stored
  until you press send there.
- **Reduced motion is a first-class path,** not a fallback. Titles stay
  visible, no sequence runs, and no information is lost.
