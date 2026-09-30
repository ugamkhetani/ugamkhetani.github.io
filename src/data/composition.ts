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
  // ── Movement I ──────────────────────────────────────────────────
  {
    // The award film, alone and centred. Eight columns.
    items: [{ slug: 'mumbai-standard-time', col: 3, span: 8, tCol: 1, tSpan: 6 }],
    pause: 20,
  },
  {
    // Both leads are 16:9, so Diwali is separated from 001 by width and by
    // company: seven columns, with the site's only 4:3 frame beside it.
    items: [
      { slug: 'diwali-ke-shor-mein', col: 1, span: 7, tCol: 1, tSpan: 4 },
      { slug: 'aasha', col: 9, span: 4, offset: 20, tCol: 5, tSpan: 2, tOffset: 14 },
    ],
    pause: 24,
  },
  {
    // 3:2 edge-to-edge was 960px tall on a 1440 screen — taller than the
    // viewport, so you had to scroll to see one frame. Height is capped at
    // 78vh instead and the width follows from the ratio, so it always fits
    // in one look and the stills keep their exact proportions.
    items: [{ slug: 'taskaree', col: 1, span: 12, maxVh: 78, tCol: 1, tSpan: 6 }],
    pause: 22,
  },
  {
    // The inversion: 9:16 against 16:9. The same ratio, transposed.
    items: [
      { slug: 'book-my-yamraj', col: 1, span: 3, tCol: 1, tSpan: 2 },
      { slug: 'special-ops-2', col: 5, span: 8, offset: 24, tCol: 3, tSpan: 4, tOffset: 16 },
    ],
    pause: 28,
  },

  // ── Movement II ─────────────────────────────────────────────────
  {
    // Widest frame on the site. Opens the catalogue alone.
    items: [{ slug: 'broken-reflections', col: 2, span: 8, tCol: 1, tSpan: 5 }],
    pause: 20,
  },
  {
    // IRA, ADDED 2026-09-30 between Broken Reflections and My Red Crayon on
    // Ugam's instruction. It takes a stanza of its own rather than joining
    // either neighbour, because both of those stanzas are arguments that a
    // second frame would break: the one above says "opens the catalogue
    // alone" and the one below is a scale study of two frames at the SAME
    // ratio, which a third 16:9 at a third width would turn into a list.
    //
    // ← THE PLACEMENT IS MINE. Ugam gave the position in the score, not the
    //   column or the width. Flush right at 8..12 answers the centred frame
    //   above it and sets up My Red Crayon, which starts at column 1 — so
    //   the eye crosses the page between the two rather than stepping down
    //   the same edge. Five columns keeps it smaller than the frame it
    //   follows, which is the widest on the site. No offset: offsets here
    //   exist to break a baseline shared with a second frame in the same
    //   stanza, and this stanza has none.
    items: [{ slug: 'ira', col: 8, span: 5, tCol: 3, tSpan: 4 }],
    pause: 18,
  },
  {
    // The scale study: identical 16:9 proportion at four columns and seven.
    items: [
      { slug: 'my-red-crayon', col: 1, span: 4, tCol: 1, tSpan: 3 },
      { slug: 'the-shiva-trilogy', col: 6, span: 7, offset: 16, tCol: 4, tSpan: 3, tOffset: 12 },
    ],
    pause: 24,
  },
  {
    // A narrow upright against a wide landscape — 9:16 beside 3:2.
    // Moholla keeps its own six-column width rather than inheriting the
    // four Dinshaw's had: at 3:2 those columns would have made it squat,
    // and at 9:16 Dinshaw's would have been over 1100px tall in Moholla's.
    // Positions swap; each keeps a width that suits its shape.
    items: [
      { slug: 'bloody-bubbly', col: 1, span: 3, tCol: 1, tSpan: 2 },
      { slug: 'moholla', col: 6, span: 6, offset: 12, tCol: 3, tSpan: 4, tOffset: 10 },
    ],
    pause: 20,
  },
  {
    items: [{ slug: 'roar', col: 3, span: 8, tCol: 1, tSpan: 5 }],
    pause: 24,
  },
  {
    // Two uprights at different degrees — 4:5 against 9:16.
    items: [
      { slug: 'aladdin-dateable-bites', col: 1, span: 4, tCol: 1, tSpan: 3 },
      { slug: 'dinshaws-dildaari-battles', col: 8, span: 4, offset: 10, tCol: 4, tSpan: 3, tOffset: 8 },
    ],
    pause: 26,
  },
  {
    // Two records, small and square, closing the catalogue quietly.
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
