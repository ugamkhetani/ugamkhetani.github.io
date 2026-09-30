/**
 * THE HOMEPAGE COMPOSITION
 *
 * This file is the score. Nothing about the index is algorithmic — every
 * placement below was chosen. Scale separates the leads from the catalogue
 * without labelling anything; vertical offset means no two frames share a
 * baseline; the pauses are genuinely empty screen.
 *
 * `col` / `span` are on a 12-column grid (6 at tablet, 1 at mobile).
 * `offset` pushes a frame down in vh. `pause` is empty space after a stanza.
 *
 * Scroll order and catalogue numbering both come from here, so reordering
 * the homepage renumbers every page along with it.
 */

export interface Placement {
  slug: string;
  /** 12-col grid: start column, 1-indexed */
  col: number;
  span: number;
  /** vh pushed down from the stanza baseline */
  offset?: number;
  /** breaks the margins, edge to edge */
  bleed?: boolean;
  /** Caps the frame's HEIGHT at this many vh. Width is derived from it via
   *  the work's own aspect ratio, so the frame shrinks as a whole and the
   *  stills are never cropped — it just stops being taller than the screen. */
  maxVh?: number;
  /** 6-col tablet overrides */
  tCol?: number;
  tSpan?: number;
  tOffset?: number;
}

export interface Stanza {
  items: Placement[];
  /** vh of empty space after this stanza */
  pause: number;
}

export const composition: Stanza[] = [
  /* REORDERED 2026-09-30 on Ugam's instruction, which gave the seventeen
     works as a numbered list and nothing else. The ORDER below is his; the
     stanzas, columns, spans, offsets and pauses are mine, because a linear
     list does not say which works stand together or how wide any of them is.

     THE GROUPING IS BY SHAPE, as it was before, and only consecutive works
     can pair — so the list decides which pairings were available and the
     ratios decided which of those to take. Two pairs survive from the old
     score intact, Aladdin with Dinshaw's and the two records, because the
     new order happens to keep them adjacent. */

  // ── Movement I ──────────────────────────────────────────────────
  {
    // Diwali opens now. Alone and centred at eight columns — the treatment
    // Mumbai had when it opened, because what that placement is for is
    // giving the first frame nothing to be compared against.
    items: [{ slug: 'diwali-ke-shor-mein', col: 3, span: 8, tCol: 1, tSpan: 6 }],
    pause: 20,
  },
  {
    // THE INVERSION: 16:9 against 9:16, the same ratio transposed. It was
    // Book My Yamraj against Special Ops before and the new order breaks
    // that adjacency, but it puts Mumbai next to Book My Yamraj instead,
    // which is the same argument with a different pair of works.
    items: [
      { slug: 'mumbai-standard-time', col: 1, span: 7, tCol: 1, tSpan: 4 },
      { slug: 'book-my-yamraj', col: 9, span: 3, offset: 20, tCol: 5, tSpan: 2, tOffset: 14 },
    ],
    pause: 24,
  },
  {
    // Aasha alone and small after a loud pair. It is one of the two 4:3
    // frames on the site now that Ira's bezels are off, and the other is
    // four places further down, which is far enough apart that they read as
    // a proportion recurring rather than as a pair split up.
    items: [{ slug: 'aasha', col: 2, span: 5, tCol: 1, tSpan: 4 }],
    pause: 18,
  },
  {
    // 3:2 edge-to-edge was 960px tall on a 1440 screen — taller than the
    // viewport, so you had to scroll to see one frame. Height is capped at
    // 78vh instead and the width follows from the ratio, so it always fits
    // in one look and the stills keep their exact proportions. Unchanged.
    items: [{ slug: 'taskaree', col: 1, span: 12, maxVh: 78, tCol: 1, tSpan: 6 }],
    pause: 22,
  },

  // ── Movement II ─────────────────────────────────────────────────
  {
    // Two landscapes at different degrees of wide — 16:9 against 2.35:1.
    // Broken Reflections opened the catalogue alone before and cannot now,
    // because the order puts it directly after another wide frame; set
    // beside one it becomes a comparison instead of an entrance, which is
    // the better of the two things a 2.35 can do next to a 16:9.
    items: [
      { slug: 'special-ops-2', col: 1, span: 6, tCol: 1, tSpan: 3 },
      { slug: 'broken-reflections', col: 8, span: 5, offset: 18, tCol: 4, tSpan: 3, tOffset: 12 },
    ],
    pause: 24,
  },
  {
    // Ira's first appearance at its true proportion. 4:3 against 16:9, the
    // narrow one held smaller so the two land at nearly the same height —
    // 303px against 348 at 1440 — which is what makes the width difference
    // read as width rather than as importance.
    items: [
      { slug: 'ira', col: 2, span: 4, tCol: 1, tSpan: 3 },
      { slug: 'moholla', col: 7, span: 6, offset: 14, tCol: 4, tSpan: 3, tOffset: 10 },
    ],
    pause: 20,
  },
  {
    // The inversion again, and deliberately not adjacent to the first one:
    // 16:9 against 9:16 with four stanzas between them, so it reads as a
    // rhyme rather than as a repeat.
    items: [
      { slug: 'my-red-crayon', col: 1, span: 4, tCol: 1, tSpan: 3 },
      { slug: 'bloody-bubbly', col: 7, span: 3, offset: 16, tCol: 4, tSpan: 2, tOffset: 12 },
    ],
    pause: 24,
  },
  {
    // The widest frame on the site against a standard one. Roar at 2.39:1
    // takes six columns and Shiva five, which puts them at 259px and 287px
    // — the wider frame is the bigger object and still the shorter one.
    items: [
      { slug: 'the-shiva-trilogy', col: 1, span: 5, tCol: 1, tSpan: 3 },
      { slug: 'roar', col: 7, span: 6, offset: 14, tCol: 4, tSpan: 3, tOffset: 10 },
    ],
    pause: 26,
  },
  {
    // Two uprights at different degrees — 4:5 against 9:16. Unchanged from
    // the old score; the new order keeps these two adjacent.
    items: [
      { slug: 'aladdin-dateable-bites', col: 1, span: 4, tCol: 1, tSpan: 3 },
      { slug: 'dinshaws-dildaari-battles', col: 8, span: 4, offset: 10, tCol: 4, tSpan: 3, tOffset: 8 },
    ],
    pause: 26,
  },
  {
    // Two records, small and square, closing the catalogue quietly.
    // Unchanged.
    items: [
      { slug: 've-maahi', col: 2, span: 3, tCol: 1, tSpan: 2 },
      { slug: 'mere-ho', col: 6, span: 3, offset: 7, tCol: 3, tSpan: 2, tOffset: 6 },
    ],
    pause: 14,
  },
];

/** Aspect ratio → CSS aspect-ratio value. The shape is the information. */
export const RATIO: Record<string, string> = {
  '2.39:1': '2.39 / 1',
  '2.35:1': '2.35 / 1',
  '2.08:1': '2.08 / 1',
  '21:9': '21 / 9',
  '2:1': '2 / 1',
  '16:9': '16 / 9',
  '3:2': '3 / 2',
  '4:3': '4 / 3',
  '4:5': '4 / 5',
  '9:16': '9 / 16',
  '1:1': '1 / 1',
};

/** The same ratios as numbers, for deriving a width from a height cap. */
export const RATIO_NUM: Record<string, number> = {
  '2.39:1': 2.39,
  '2.35:1': 2.35,
  '2.08:1': 2.08,
  '21:9': 21 / 9,
  '2:1': 2,
  '16:9': 16 / 9,
  '3:2': 3 / 2,
  '4:3': 4 / 3,
  '4:5': 4 / 5,
  '9:16': 9 / 16,
  '1:1': 1,
};

/** Scroll order, derived from the composition so it can never drift. */
export const order: string[] = composition.flatMap((s) => s.items.map((i) => i.slug));

export const total = order.length;

/**
 * THE INDEX OVERLAY'S OWN ORDER.
 *
 * The Index is a different reading of the same catalogue — names rather than
 * images — and it does not have to follow the homepage composition. Slugs
 * listed here sort first, in this order, within their category; anything not
 * listed falls back to the homepage order. Catalogue numbers are unaffected:
 * they always come from the composition, so a work carries the same number
 * wherever it appears.
 */
export const indexOrder: string[] = [
  'dinshaws-dildaari-battles',
  'aladdin-dateable-bites',
  'bloody-bubbly',
];

export function indexRank(slug: string): number {
  const i = indexOrder.indexOf(slug);
  return i === -1 ? 1000 + order.indexOf(slug) : i;
}

/**
 * Catalogue number, derived from position rather than stored on each work —
 * so reordering the score above renumbers the whole site in one move.
 */
export function numberFor(slug: string): string {
  const i = order.indexOf(slug);
  if (i === -1) throw new Error(`"${slug}" has a markdown file but no place in composition.ts.`);
  return String(i + 1).padStart(3, '0');
}
