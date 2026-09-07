import type { ImageMetadata } from 'astro';

/**
 * Every image under src/media/works/<slug>/frames/, optimised at build.
 * Ugam drops JPEGs into the folder and lists the filenames in the
 * work's markdown — there is nothing to import by hand.
 */
// Vite's glob is case-sensitive, and exports out of cameras and editing
// suites routinely come out as .JPG / .PNG. Both cases are listed so the
// extension a file happens to arrive with never decides whether it appears.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/media/works/**/frames/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}',
  { eager: true }
);

/** Every frame in a work's folder, in filename order. */
function allFramesIn(slug: string): ImageMetadata[] {
  const prefix = `/src/media/works/${slug}/frames/`;
  return Object.keys(images)
    .filter((key) => key.startsWith(prefix))
    .sort()
    .map((key) => images[key].default);
}

/**
 * Leave `frames:` out of the markdown and every image in the folder is used,
 * in filename order — drop files in, nothing else to edit. List them
 * explicitly only when the order or the selection needs controlling.
 */
export function framesFor(slug: string, names: string[]): ImageMetadata[] {
  if (!names.length) {
    const found = allFramesIn(slug);
    if (!found.length) {
      throw new Error(
        `No images found for "${slug}".\n` +
          `  Add at least one file to: src/media/works/${slug}/frames/\n` +
          `  Name them 01.jpg, 02.jpg, 03.jpg — they are used in that order.`
      );
    }
    return found;
  }

  return names.map((name) => {
    const key = `/src/media/works/${slug}/frames/${name}`;
    const mod = images[key];
    if (!mod) {
      throw new Error(
        `Missing image "${name}" for "${slug}".\n` +
          `  Expected file : src/media/works/${slug}/frames/${name}\n` +
          `  Listed in     : src/content/works/${slug}.md  (frames:)\n` +
          `  Fix: add the file, remove that filename from the list, or delete\n` +
          `       the whole "frames:" line to use everything in the folder.`
      );
    }
    return mod.default;
  });
}

/**
 * `sizes` for a frame occupying `span` of 12 columns.
 * Keeps the browser from downloading a 2000px file for a 3-column frame.
 */
export function sizesFor(span: number): string {
  const desktop = Math.round((span / 12) * 100);
  const tablet = Math.min(100, Math.round((span / 6) * 100));
  return `(max-width: 640px) 100vw, (max-width: 900px) ${tablet}vw, ${desktop}vw`;
}

/**
 * WHERE THE CROP WINDOW SITS, for frames whose file carries burned-in
 * letterbox. An `object-position` Y percentage; 50% is the default and means
 * "centred on the file".
 *
 * A frame is shown in a box of its DECLARED ratio, and `object-fit: cover`
 * centres the source in that box. When the source has black bars baked into
 * it, the centre of the FILE is not the centre of the PICTURE, so a centred
 * crop takes its slice from the wrong place — it keeps a sliver of bar at one
 * edge and throws away real picture at the other. Re-centring the window on
 * the picture costs nothing: the window is the same size, it just sits where
 * the content is.
 *
 * WHY object-position AND NOT A TRANSFORM. Both renderers already drive
 * `transform` on the image — scale(1.001) at rest, scale(1.035) on hover, and
 * `transform: none` under reduced motion. A translate written there would have
 * to be repeated in all three states in both files, and would silently vanish
 * on hover or for a reduced-motion visitor, putting the bar back exactly when
 * someone looks closer. `object-position` is framing rather than motion, and
 * nothing else touches it.
 *
 * The percentage is the fraction of the crop's overflow that sits ABOVE the
 * window: (window top in source px) / (source height - window height in
 * source px). 50% reproduces the default exactly.
 *
 *   DIWALI  3456x2234, bars 180 top and 115 bottom, picture 180..2119.
 *   Declared 16:9, which is right — the picture alone is 3456x1939 = 1.782
 *   against 16:9's 1.778. The FILE is 1.547, so cover fits by width and the
 *   window is 3456/1.778 = 1943.8 tall against 290.2 of overflow. Centred it
 *   sat at 145.1..2088.9: 35px of the top bar still showing, and 30px of
 *   picture lost off the bottom. Centred on the picture instead, the window
 *   top is 1149.5 - 971.9 = 177.6, so 177.6 / 290.2 = 61.2%. What is left is
 *   2.4px of bar at each edge, because the window is 4.8px taller than the
 *   picture — 0.1% of the frame, sub-pixel at any size this is drawn at.
 *
 * BOOK MY YAMRAJ IS NOT IN THIS TABLE, AND THE REASON IS WORTH KEEPING. It
 * looks like a third case — 2160x4096 is 0.527 against a declared 9:16 of
 * 0.5625, so cover takes 6.3% of the height — but it has NO BAR. A first pass
 * called the bottom 90 rows letterbox on a mean-under-16 test; they are 16.3
 * falling smoothly to 13.8, which is a picture fading into shadow. A real bar
 * is flat and reads 0.0, then steps straight to the picture: Diwali goes
 * 0.0, 0.3, 1.3, 74.7 in four rows. USE A THRESHOLD NEAR ZERO AND LOOK AT THE
 * EDGE, or a dark scene bottom is mistaken for a bar.
 *
 * So its 6.3% is not a misplaced window, it is what declaring 9:16 costs a
 * frame that is slightly taller than 9:16 — and it is already taken evenly,
 * 128px off the top and 127px off the bottom. A shift here would only move
 * the loss to one end; it was tried at 32.4% and made the bottom lose 172px.
 * Nothing in this table can help it. Removing the crop altogether would mean
 * declaring a ratio the enum does not have. That was a question about how
 * the work is described while Contents showed the ratio to readers; Contents
 * was removed on 2026-09-07, so today it is only a question about the crop
 * this table takes. Either way it is not a bug to fix here.
 *
 * BROKEN REFLECTIONS IS ABSENT ON PURPOSE. Its bars are 115 top and bottom of
 * 1080, symmetric, and its declared 2.35 crops exactly 21.3% — the window
 * lands on 115..965, which is the picture exactly. A centred crop is already
 * the right crop, and an entry here would move it off.
 *
 * THE BED DOES NOT USE THIS. Its tiles are sized by the grid rather than by
 * the work's ratio, so the arithmetic above does not describe them; it has its
 * own BED_CROP in src/lib/bed.ts, and applying both would correct twice.
 */
export const FRAME_CROP: Record<string, number> = {
  'diwali-ke-shor-mein': 61.2,
};

/** `object-position` for a work's frames — the default unless it has bars. */
export function cropFor(slug: string): string | undefined {
  const y = FRAME_CROP[slug];
  return y === undefined ? undefined : `--fcy:${y}%`;
}
