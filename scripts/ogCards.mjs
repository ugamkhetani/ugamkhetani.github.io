import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * A SHARE CARD PER WORK, BUILT FROM THAT WORK'S FIRST STILL.
 *
 * Until this existed every page on the site shared the same picture — the
 * studio photograph in public/og/share.jpg. That is right for the homepage
 * and wrong for a work: sending someone /work/kaalakund showed them a
 * portrait of the composer rather than the film.
 *
 * THE HOMEPAGE STILL USES THE PHOTOGRAPH. It is the one card with no still
 * to derive it from, it is a deliberate choice, and public/og/share.jpg is
 * untouched by this file. Base.astro falls back to it for any page that does
 * not pass a card of its own.
 *
 * THE FIRST STILL, which is images[0] on the work page — the same frame the
 * page opens on, so the card and the page agree. No work names `frames:` in
 * its markdown today, so in every case that is 01.* in filename order, which
 * is the order frames.ts uses.
 *
 * GENERATED AT BUILD, NOT COMMITTED. The alternative was eighteen files in
 * public/og/work/ made once by hand, and this repo's recorded failure is
 * exactly that: a table that has to be re-run after a content change and is
 * not. Add a work, replace its first still, reorder the catalogue — the card
 * follows with no second step. The cost is sharp running eighteen times per
 * build, measured at well under a second in total.
 *
 * 1200x630 AND JPEG for the reasons already written out in Base.astro: it is
 * the box every platform crops from, and JPEG is the one format every
 * scraper reads. The extension has to match the bytes or Pages serves the
 * wrong Content-Type.
 *
 * CONTAIN, NEVER COVER, ON THE SITE'S OWN GROUND. A card is 1.905:1 and the
 * catalogue runs from 0.527 to 2.391, so cropping to fill would take a
 * thirty-percent bite out of the two 4:3 works and show about a third of
 * each of the four uprights. Fitting the whole still inside the box costs
 * the landscape works almost nothing — a 16:9 still leaves 40px of ground
 * down each side — and costs the uprights honest empty space instead of
 * their subject. #0A0908 is --ground, the same warm near-black as the
 * page and the theme-color meta.
 *
 * BURNED-IN MATTING IS CROPPED FIRST, by walking rows and columns in until
 * the mean channel clears 6 — the same method HANDOFF describes for the bed.
 * Five first stills carry some: Broken Reflections 115px top and bottom,
 * Moholla 12/15/23/10, Aladdin 40 top and 13 left, Taskaree 28 right,
 * Diwali 4 each side. Left in, those bars would be matted onto more ground
 * and read as a framing mistake. Cropping them also brings each file's
 * aspect ratio onto the ratio its markdown declares, which is the check that
 * says the bars are matting and not a dark sky: Broken Reflections resolves
 * to 2.351 against a declared 2.35:1, Moholla to 1.792 against 16:9,
 * Taskaree to 1.493 against 3:2.
 */

const W = 1200;
const H = 630;
const GROUND = { r: 0x0a, g: 0x09, b: 0x08 };
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const FLOOR = 6;

/** Where the picture starts, for a file that carries matting burned into it. */
async function contentBox(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const rowMean = (y) => {
    let s = 0;
    for (let x = 0; x < w; x++) { const i = (y * w + x) * 3; s += (data[i] + data[i + 1] + data[i + 2]) / 3; }
    return s / w;
  };
  const colMean = (x) => {
    let s = 0;
    for (let y = 0; y < h; y++) { const i = (y * w + x) * 3; s += (data[i] + data[i + 1] + data[i + 2]) / 3; }
    return s / h;
  };
  let top = 0, bottom = 0, left = 0, right = 0;
  while (top < h && rowMean(top) < FLOOR) top++;
  while (bottom < h && rowMean(h - 1 - bottom) < FLOOR) bottom++;
  while (left < w && colMean(left) < FLOOR) left++;
  while (right < w && colMean(w - 1 - right) < FLOOR) right++;
  /* A frame that is dark edge to edge walks all the way through and leaves
     nothing. Then there is no matting to find and the whole file is the
     picture. */
  if (left + right >= w || top + bottom >= h) return { left: 0, top: 0, width: w, height: h };
  return { left, top, width: w - left - right, height: h - top - bottom };
}

export function ogCards() {
  return {
    name: 'og-cards',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const works = 'src/content/works';
        const slugs = fs
          .readdirSync(works)
          .filter((f) => f.endsWith('.md'))
          .map((f) => f.replace(/\.md$/, ''))
          .sort();

        /* fileURLToPath, not out.pathname: this project's own folder has
           spaces in it, and a URL's pathname keeps them percent-encoded —
           which sharp then tries to open literally and cannot find. */
        const out = fileURLToPath(new URL('og/work/', dir));
        await fs.promises.mkdir(out, { recursive: true });

        let cropped = 0;
        for (const slug of slugs) {
          const frames = path.join('src/media/works', slug, 'frames');
          const first = fs.existsSync(frames)
            ? fs.readdirSync(frames).filter((n) => IMAGE.test(n)).sort()[0]
            : undefined;
          if (!first) {
            throw new Error(
              `No first still for "${slug}", so its share card cannot be built.\n` +
                `  Expected at least one image in: ${frames}\n` +
                `  The work page uses the same frame, so this would fail there too.`
            );
          }

          const file = path.join(frames, first);
          const box = await contentBox(file);
          const whole = await sharp(file).metadata();
          if (box.width !== whole.width || box.height !== whole.height) cropped++;

          await sharp(file)
            .extract(box)
            .resize(W, H, { fit: 'contain', background: GROUND })
            .jpeg({ quality: 86, mozjpeg: true })
            .toFile(path.join(out, `${slug}.jpg`));
        }

        logger.info(
          `share cards built for ${slugs.length} works, ${cropped} with burned-in matting cropped off`
        );
      },
    },
  };
}
