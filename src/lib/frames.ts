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
