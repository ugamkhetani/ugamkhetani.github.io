import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Neue Haas Grotesk Display is licensed, so the files can't ship with the
 * repo. Drop these three into /public/fonts/ and the face activates on the
 * next build — no code change:
 *
 *   NeueHaasGroteskDisplay-Roman.woff2    (400)
 *   NeueHaasGroteskDisplay-Medium.woff2   (500)
 *   NeueHaasGroteskDisplay-Bold.woff2     (700)
 *
 * Until then nothing is requested at all, so no visitor's console fills
 * with 404s and the stack falls through to Helvetica Neue — metrically
 * and visually near-identical, so nothing looks broken in the meantime.
 */
const FACES = [
  { weight: 400, file: 'NeueHaasGroteskDisplay-Roman.woff2', local: 'Neue Haas Grotesk Display Pro' },
  { weight: 500, file: 'NeueHaasGroteskDisplay-Medium.woff2', local: 'Neue Haas Grotesk Display Pro Medium' },
  { weight: 700, file: 'NeueHaasGroteskDisplay-Bold.woff2', local: 'Neue Haas Grotesk Display Pro Bold' },
];

export function displayFontFace(): string {
  const publicDir = path.resolve(process.cwd(), 'public');

  return FACES.filter((f) => existsSync(path.join(publicDir, 'fonts', f.file)))
    .map(
      (f) => `@font-face{font-family:'Neue Haas Grotesk Display';` +
        `src:local('${f.local}'),url('/fonts/${f.file}') format('woff2');` +
        `font-weight:${f.weight};font-style:normal;font-display:swap}`
    )
    .join('');
}
