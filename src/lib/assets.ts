import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const PUBLIC = path.resolve(process.cwd(), 'public');

/**
 * Films listed in the markdown keep their labels and their links back to the
 * original post. When a work lists none, every MP4 in its films/ folder is
 * used instead, in filename order — drop files in, nothing else to edit.
 */
export function listFilms(slug: string) {
  const dir = path.join(PUBLIC, 'media', 'works', slug, 'films');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.mp4'))
    .sort()
    .map((src) => ({
      src,
      // reel-01.mp4 → "Reel 01"
      label: src
        .replace(/\.mp4$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href: undefined as string | undefined,
      poster: undefined as string | undefined,
      ratio: '9:16' as const,
    }));
}

/**
 * Films and audio live in /public (served raw, never processed).
 * Ugam is still gathering these, so every player checks at build time
 * whether its file has arrived. When it hasn't, the page falls back to
 * the elegant external treatment instead of rendering a broken player.
 * Drop the file in and the player appears on the next build.
 */
export function filmPath(slug: string, src: string) {
  const url = `/media/works/${slug}/films/${src}`;
  return { url, exists: existsSync(path.join(PUBLIC, url)) };
}

export function audioPath(slug: string, src: string) {
  const url = `/media/works/${slug}/audio/${src}`;
  return { url, exists: existsSync(path.join(PUBLIC, url)) };
}

export function posterPath(slug: string, src?: string) {
  if (!src) return undefined;
  const url = `/media/works/${slug}/films/${src}`;
  return existsSync(path.join(PUBLIC, url)) ? url : undefined;
}
