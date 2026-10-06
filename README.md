# Ugam Khetani — Portfolio

Seventeen works, 21 pages. Every project is one markdown file; every image
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
| `/` | The whole site as one page — opening, catalogue, about, enquiry. |
| `/work/<slug>` | One per project, five opening types. Seventeen of them. |

That is the whole site: **one page and seventeen work pages.** The About
material and the enquiry are **sections of the home page** (`/#about`,
`/#contact`), and the catalogue-as-names roll that used to live at `/contents`
was removed on 2026-09-07 for want of use. All three were pages long enough to
have been sent to someone, so all three URLs still work — they redirect, which
is what the other three shipped files are.

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
*and* both RATIO maps in `src/data/composition.ts`. If a still has black bars
baked into the file, the ratio is only half the story — see `FRAME_CROP` in
`src/lib/frames.ts`. Use the format the piece
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
3. **A portrait for About** — drop the file into `src/media/about/` and name
   it in `PORTRAIT` in `src/data/about.ts`. The folder was removed on
   2026-10-06 along with an unused 2.1MB placeholder; recreate it when the
   real portrait arrives.
4. **A booking link** — paste it into `CALL_URL` in `src/data/contact.ts` and
   the "rather talk" line appears. Empty means it never renders.
5. **Audio excerpts** — optional; the player is built and waiting.

Nothing else is waiting on a decision. The four questions that were open —
Bloody Bubbly's description, a mislabelled `studio` on two works, Book My
Yamraj's ratio and Special Ops' first frame — were all settled on 2026-09-05
and are recorded in HANDOFF §7. Two of them were settled by leaving them
alone, so they are written down to stop them being raised again.

All seventeen works have real stills — 128 frames, counted 2026-10-05. No
stand-ins remain. Ten each for Broken Reflections, Dinshaw's, Diwali Ke Shor
Mein and Mumbai Standard Time, down to one each for Mere Ho and Ve Maahi, which
is why those two have no stills section.

---

## Publishing

The repository is set up for **GitHub Pages** and needs no domain to work.

1. Create an empty repository on GitHub and push this one to it.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. That is all. `.github/workflows/deploy.yml` builds and publishes on every
   push to `main`, and the first run gives you the URL.

**No domain is hard-coded anywhere.** The workflow asks GitHub where the
repository is published and passes the answer into the build, so a user site,
a project site under `/<repo>/`, and a custom domain added later all build
correctly with nothing to edit. To check a subpath build locally:

```
BASE_PATH=/portfolio/ npm run build
```

Verified across 1,756 absolute URLs in the output: every one carries the base.

### Adding a domain later

Put the bare domain in `public/CNAME` (one line, no protocol), set it in
**Settings → Pages → Custom domain**, and point DNS at GitHub — four `A`
records for an apex domain, or a `CNAME` to `<user>.github.io` for `www`.
Nothing in `astro.config.mjs` changes; the workflow picks the new origin up on
the next run and canonical tags start being emitted.

### What is published

**21 pages, and that is everything the project builds** — the home page,
seventeen work pages and three redirect stubs for the retired `/about`,
`/contact` and `/contents` URLs. Every page in `src/pages/` is a production
page; there is nothing withheld from the output and no build flag to remember.

The draft library that used to live in `src/pages/preview/` — 72 working
drawings, excluded from the build by an integration in `astro.config.mjs` —
was removed on 2026-10-06 when the repository was prepared for upload, and the
integration with it. Nothing on the live site changed: the twenty-one pages
render byte-for-byte as they did, verified by comparing both builds. The
drafts are in history at `22fe932`:

```
git show 22fe932:src/pages/preview/ab-zw12.astro
```

### Other hosts

The same repository works unchanged on Vercel, Netlify or Cloudflare Pages —
build command `npm run build`, output directory `dist`, and they all serve
from the root so no base is needed.

### One thing to expect on the first push

The repository is large: **395MB** of source stills and 34MB of originals,
with a `.git` of **503MB** on top — remeasured 2026-10-05, and growing with
every round of drafts. GitHub accepts it, but the first push takes a while and
a fresh clone is slow. The CI checkout is shallow (`fetch-depth: 1`) so this only
costs you once.

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
