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

/**
 * WHAT OF THIS FILE STILL REACHES THE PAGE, measured 2026-11-17.
 *
 * `slug` ORDER DOES: scroll order, the catalogue numbers via numberFor(),
 * the next-work chain on every work page, and the mosaic bed's cast, which
 * walks `order` and repeats it to fill thirty tiles.
 *
 * THE GEOMETRY DOES NOT. index.astro is the only reader of `composition`,
 * and the Selected Works movement is a conveyor of uniform-height cards —
 * `.is-live .wcard` takes its height from `min(40vh, 26vw) * --card-k` and
 * its width from the work's own ratio, both set in the markup. `col` and
 * `span` feed exactly one expression, the `x` drift at line 227, and that
 * value is emitted nowhere: no data attribute, no custom property. Grepped
 * for `data-x`, `dataset.x` and `--x` against the card; the only hits are
 * the cursor peek and a scroll ratio. `offset`, `maxVh`, `bleed`, `tCol`,
 * `tSpan`, `tOffset` and `Stanza.pause` have no reader at all.
 *
 * So the pixel arguments below describe the static grid the conveyor
 * replaced. They are the record of why the sequence is what it is, and
 * they are worth keeping for that — but a column or a span changed here
 * will not move anything on screen, and nothing in the build says so.
 *
 * <- THE CHOICE THIS LEAVES OPEN is whether to cut the dead fields and the
 *    dead `x` with them, or to put the grid back behind the conveyor. Both
 *    are decisions, not clean-ups, so neither was taken unasked.
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
  /* REORDERED AGAIN 2026-09-30, second pass, on Ugam's instruction. As
     before he gave the sequence and nothing else, so the stanzas, columns,
     spans, offsets and pauses are mine.

     THE GROUPING IS BY SHAPE and only consecutive works can pair, so the
     list decides which pairings are available and the ratios decide which of
     those to take. Four groupings survive this pass unchanged because the
     order keeps their works adjacent: My Red Crayon with Bloody Bubbly,
     Shiva with Roar, Aladdin with Dinshaw's, and the two records. Mumbai is
     back at the head, alone and centred, where it was before the first
     reorder.

     A FIFTH SURVIVED THE REORDER AND NOT THE CATALOGUE. Ira with Moholla
     was listed here until Kaalakund was placed between them; Moholla now
     stands alone two stanzas on. Nothing else in the score moved. */

  // ── Movement I ──────────────────────────────────────────────────
  {
    // The award film, alone and centred. Eight columns.
    items: [{ slug: 'mumbai-standard-time', col: 3, span: 8, tCol: 1, tSpan: 6 }],
    pause: 20,
  },
  {
    // BOTH LEADS ARE 16:9, so Diwali is separated from 001 by width and by
    // alignment rather than by company — seven columns flush left against
    // eight centred. The old score separated them with Aasha standing beside
    // Diwali; this order puts Aasha four places away, so the separation has
    // to come from the placement itself.
    items: [{ slug: 'diwali-ke-shor-mein', col: 1, span: 7, tCol: 1, tSpan: 5 }],
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
  {
    // 16:9 against 4:3 — the two landscape proportions everything else on
    // the site is measured against, set side by side once.
    items: [
      { slug: 'special-ops-2', col: 1, span: 6, tCol: 1, tSpan: 3 },
      { slug: 'aasha', col: 8, span: 4, offset: 18, tCol: 4, tSpan: 3, tOffset: 12 },
    ],
    pause: 24,
  },

  // ── Movement II ─────────────────────────────────────────────────
  {
    // The extremes of the catalogue in one stanza: 9:16 against 2.35:1, the
    // tallest frame beside one of the two widest. At three columns and six
    // they come out 528px and 263px, which is the largest height difference
    // anywhere in the score and the reason this pair opens the movement.
    items: [
      { slug: 'book-my-yamraj', col: 1, span: 3, tCol: 1, tSpan: 2 },
      { slug: 'broken-reflections', col: 6, span: 6, offset: 20, tCol: 3, tSpan: 4, tOffset: 14 },
    ],
    pause: 24,
  },
  {
    // KAALAKUND IS BACK BETWEEN IRA AND MOHOLLA, on Ugam's instruction
    // 2026-11-17, in the slot it held before the last pass. It spent one
    // pass down in My Red Crayon's stanza; the inversion it displaced
    // comes back whole two stanzas down.
    //
    // The columns and spans below are the ones that were measured for this
    // pairing when the homepage still laid the catalogue out on a grid —
    // 4:3 against 2.35:1, 303px against 263 at 1440. READ THE NOTE ON
    // `Placement` ABOVE BEFORE TRUSTING THAT: none of those fields reaches
    // the page any more. They are kept as the record of the shape argument,
    // not as a description of what renders.
    items: [
      { slug: 'ira', col: 2, span: 4, tCol: 1, tSpan: 3 },
      { slug: 'kaalakund', col: 7, span: 6, offset: 14, tCol: 4, tSpan: 3, tOffset: 10 },
    ],
    pause: 20,
  },
  {
    // MOHOLLA ALONE, because the work that used to stand beside it now
    // stands where it stood. Six columns flush left, the same frame it had
    // in the pair moved to the other margin — again, the grid reading, not
    // the conveyor's. What the move actually costs Moholla is a place in
    // the sequence and a number, 009 to 010; nothing about how it is drawn.
    items: [{ slug: 'moholla', col: 1, span: 6, tCol: 1, tSpan: 4 }],
    pause: 20,
  },
  {
    // The inversion: 16:9 against 9:16, the same ratio transposed. Adjacent
    // again — it was the one thing the last placement cost, and the note
    // that recorded the cost said the way back was to move Kaalakund rather
    // than to re-pair these two. That is what happened.
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
