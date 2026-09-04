/**
 * PREVIEW ONLY — the ranked selection and the measured cell map for the
 * mosaic-bed drafts under src/pages/preview/mosaic-*.astro.
 * Nothing on the real site imports this. The live bed still cycles all sixteen
 * works in score order; it changes only if a draft is approved.
 *
 * ── WHAT WAS MEASURED, AND WHY IT DECIDES EVERYTHING ──────────────────
 *
 * The bed is a 6 x 5 grid of 30 tiles fixed behind the document. It is seen
 * through the aperture mat, which is one element painting solid ground
 * everywhere OUTSIDE its own rectangle (box-shadow: 0 0 0 100vmax). Measured at
 * 1280x800 with the aperture fully open, that rectangle is 1101 x 624 in a
 * 1280 x 800 viewport — 67% of the screen — and the bed behind it is 1628 x 1018.
 *
 * SO MOST OF THE BED IS NEVER SEEN. Of the 30 tiles, only a 4-wide by 3-tall
 * block in the middle falls inside the aperture. Sweeping the scroll clock from
 * --prog 0 to 1 (the bed drifts up 8% of its height, 81px, less than half a
 * tile) brings in a fourth row at 38% and takes the first row down to 65%.
 * Fourteen tiles are outside the window at BOTH ends of the scroll and are
 * therefore never visible at all — they decode an image each and paint nothing.
 *
 *   col        0     1     2     3     4     5
 *   row 0      ·     ·     ·     ·     ·     ·      · = never seen
 *   row 1      ·    07    08    09    10     ·
 *   row 2      ·    13    14    15    16     ·
 *   row 3      ·    19    20    21    22     ·
 *   row 4      ·    25    26    27    28     ·      (late only, 0.38)
 *
 * AND THE MIDDLE OF THAT WINDOW IS COVERED BY THE PANELS. The five .ms__panel
 * blocks are opaque var(--ground) and measure 767 to 991px wide against an
 * 1101px aperture — 70% to 90% of it. Where a panel sits, only the outer edges
 * of the window survive: with the narrowest panel, 113px of column 1 and 159px
 * of column 4 stay uncovered, and columns 2 and 3 are gone entirely.
 *
 * WHICH MAKES THE PRIZED CELLS THE OUTER ONES, not the central ones — the
 * opposite of the intuition. CELLS below is ordered by that measurement:
 * always inside the aperture AND outside the panels first, then the rest.
 */

/** Ugam's order, most to least preferred visibility. */
export const RANKED: string[] = [
  'diwali-ke-shor-mein',
  'taskaree',
  'special-ops-2',
  'mumbai-standard-time',
  'book-my-yamraj',
  'aasha',
  'broken-reflections',
  'the-shiva-trilogy',
  'moholla',
  'roar',
  'my-red-crayon',
  'bloody-bubbly',
];

/** The four the selection leaves out — listed so the omission is visible. */
export const OMITTED: string[] = [
  'aladdin-dateable-bites',
  'dinshaws-dildaari-battles',
  'mere-ho',
  've-maahi',
];

/**
 * The 6 x 5 bed's tile indices, best-seen first. Derived from the measurement
 * above, not from taste:
 *   1. rows 2-3 of the outer visible columns — always in frame, never covered
 *   2. row 1 of those columns — in frame, drops to 65% by the end of the scroll
 *   3. rows 2-3 of the inner columns — always in frame, lost behind every panel
 *   4. row 1 inner, then row 4 — late and partial
 * Everything after index 15 is a cell that is never seen.
 */
export const CELLS: number[] = [
  13, 19, 16, 22, //  outer columns, middle rows — the six best
  7, 10, //  outer columns, top row
  14, 20, 15, 21, //  inner columns, middle rows
  8, 9, //  inner columns, top row
  25, 26, 27, 28, //  bottom row, only from ~0.38 of the scroll
];

/** The 14 that never appear at either end of the scroll. */
export const DEAD_CELLS: number[] = [0, 1, 2, 3, 4, 5, 6, 11, 12, 17, 18, 23, 24, 29];

/**
 * Spread n slots across the ranked list so rank 1 gets the most and rank last
 * the fewest, summing to exactly n. Largest-remainder, so the total is exact
 * rather than approximately right.
 */
export function weights(n: number, count: number, top = 4, bottom = 1): number[] {
  const raw = Array.from({ length: count }, (_, i) =>
    top - (i * (top - bottom)) / (count - 1)
  );
  const sum = raw.reduce((a, b) => a + b, 0);
  const scaled = raw.map((r) => (r / sum) * n);
  const floors = scaled.map(Math.floor);
  let left = n - floors.reduce((a, b) => a + b, 0);
  const order = scaled
    .map((s, i) => ({ i, frac: s - Math.floor(s) }))
    .sort((a, b) => b.frac - a.frac);
  for (const o of order) {
    if (left <= 0) break;
    floors[o.i]++;
    left--;
  }
  return floors;
}

/**
 * ── THE FRAME EACH WORK SHOWS, WHICH TURNED OUT TO MATTER MORE THAN PLACEMENT ──
 *
 * The bed renders with max={1}, so every work shows the FIRST frame in its
 * folder — and for several works that is among the darkest frames they have.
 * Measured by drawing each frame into a canvas under the bed's own filter
 * chain, brightness(0.30) saturate(0.7) contrast(1.05), and taking the mean
 * channel. The page's ground is 10, so anything at or below 10 is a black
 * rectangle however prominently it is placed:
 *
 *   rank  work                    frame 1   best frame
 *   01    diwali-ke-shor-mein      16.4      3 @ 20.9
 *   02    taskaree                  9.6      7 @ 34.0   <- below ground on 1
 *   03    special-ops-2            24.6      4 @ 40.7
 *   04    mumbai-standard-time     10.6      2 @ 33.8
 *   05    book-my-yamraj           10.8      4 @ 12.6
 *   06    aasha                     5.8      5 @ 19.5   <- below ground on 1
 *   07    broken-reflections       13.7      9 @ 25.2
 *   08    the-shiva-trilogy         8.0      3 @ 35.1   <- below ground on 1
 *   09    moholla                  20.6      9 @ 34.3
 *   10    roar                      7.1      3 @ 11.9   <- below ground on 1
 *   11    my-red-crayon            26.9      2 @ 41.7
 *   12    bloody-bubbly             3.7      5 @  7.9   <- below ground on ALL
 *
 * FIVE OF THE TWELVE WERE INVISIBLE ON FRAME 1, including the second-most
 * wanted work. Ranking cannot fix that: a tile darker than the ground behind it
 * is not a dim picture, it is nothing. Choosing the brightest frame lifts four
 * of those five clear. Bloody Bubbly has no frame that clears the ground at
 * this cap — its best is 7.9 against 10 — so it is the one work in the
 * selection that cannot be made to read without either a new frame or an
 * exception to the brightness cap.
 *
 * 1-indexed, matching the order frames appear in each work's own stills grid.
 */
export const BEST_FRAME: Record<string, number> = {
  'diwali-ke-shor-mein': 3,
  taskaree: 7,
  'special-ops-2': 4,
  'mumbai-standard-time': 2,
  'book-my-yamraj': 4,
  aasha: 5,
  'broken-reflections': 9,
  'the-shiva-trilogy': 3,
  moholla: 9,
  roar: 3,
  'my-red-crayon': 2,
  'bloody-bubbly': 5,
};

/**
 * ── WHICH CELLS ARE CLEAR OF TEXT, MEASURED ───────────────────────────
 *
 * The question "where do the favourites not hide behind text" is not the same
 * as "where is the bed visible", so it was measured separately: eight scroll
 * positions, twenty-five sample points per tile, each point hit-tested with
 * elementFromPoint to see whether anything carrying text sits on top of it.
 * A point counts as clear only if it is inside the aperture AND nothing is over
 * it. Averaged over the scroll, per cell:
 *
 *   col      0      1      2      3      4      5
 *   row 0   0.00   0.00   0.00   0.00   0.00   0.00
 *   row 1   0.00   0.12   0.17   0.17   0.12   0.00
 *   row 2   0.00   0.29   0.47   0.48   0.29   0.00
 *   row 3   0.00   0.12   0.15   0.15   0.12   0.00
 *   row 4   0.00   0.00   0.00   0.00   0.00   0.00
 *
 * Twelve cells are ever clear, and there are twelve works — one each, exactly.
 *
 * THE TWO OBSTRUCTIONS PULL IN OPPOSITE DIRECTIONS, which is what makes more
 * than one sensible answer possible. Measured apart:
 *   · the inner columns (2, 3) sit inside the aperture far more of the time
 *     — 0.33 to 1.00 against 0.11 to 0.33 for the outer ones — because until
 *     --lit is fully open the aperture is narrow and clips the outer columns;
 *   · but the inner columns are behind a panel far more — 0.387 against 0.13.
 * Net, inner is about three times clearer overall. Outer is the half that
 * survives at the moments when text is actually on the screen.
 */
export const CLEAR_RANK: { cell: number; clear: number }[] = [
  { cell: 15, clear: 0.48 },
  { cell: 14, clear: 0.47 },
  { cell: 13, clear: 0.29 },
  { cell: 16, clear: 0.29 },
  { cell: 9, clear: 0.175 },
  { cell: 8, clear: 0.175 },
  { cell: 20, clear: 0.15 },
  { cell: 21, clear: 0.15 },
  { cell: 19, clear: 0.12 },
  { cell: 22, clear: 0.12 },
  { cell: 7, clear: 0.115 },
  { cell: 10, clear: 0.115 },
];

/** Rank (1-12) -> cell, for each of the three placements. */
export const PLACEMENTS: Record<string, number[]> = {
  /* D · CLEAR — straight down the measurement: rank n takes the nth-clearest
     cell. Maximises how much of the time each work is unobstructed. */
  clear: CLEAR_RANK.map((c) => c.cell),

  /* E · BAND — a compositional rule rather than a measured one. The middle row
     reads left to right with ranks 1-4, the row above takes 5-8, the row below
     9-12. The bed reads as a deliberate arrangement instead of a scatter, and
     the whole top of the list sits in the single strongest band. */
  band: [13, 14, 15, 16, 7, 8, 9, 10, 19, 20, 21, 22],

  /* F · FLANKS — the other half of the trade-off. Ranks 1-6 go down the two
     outer columns, which are behind a panel a third as often as the inner ones
     (0.13 against 0.387), so the favourites are the works that stay clear at
     the moments text is on screen — at the cost of being clipped by the
     aperture while it is still opening. */
  flanks: [13, 16, 7, 10, 19, 22, 15, 14, 9, 8, 21, 20],
};

/**
 * ── LETTERBOX BARS BURNED INTO THE SOURCE FILES ───────────────────────
 *
 * Two of the twelve carry black bars inside the image itself — not a layout
 * fault, the frame was exported letterboxed. Measured by walking rows in from
 * the top and bottom of each decoded frame until the mean channel clears 6:
 *
 *   broken-reflections  1998 x 1080   115 top, 115 bottom   21.3% of the frame
 *   diwali-ke-shor-mein 3456 x 2234   180 top, 115 bottom   13.2% of the frame
 *
 * The other ten measure zero bars, including Shiva and Roar.
 *
 * THE CROP IS A SCALE, AND FOR DIWALI ALSO A SHIFT. Both frames are wider than
 * the tile, so object-fit: cover fits them by height and the whole source
 * height — bars included — lands inside the tile. Scaling the image about its
 * centre by 1/(1 - barFraction) pushes the bars past the tile edge exactly.
 * That is enough for Broken Reflections, whose bars are symmetric. Diwali's are
 * not — 180 against 115 — so an even scale would leave the picture sitting low;
 * it takes a translate of -1.68% of the tile height as well, derived by solving
 * for the scale and offset that put both bar edges exactly on the tile edges.
 *
 * Content lost at the sides is the price: scaling by 1.271 crops 21% off the
 * width of Broken Reflections. On a bed running at brightness 0.30 behind type
 * that is a better trade than two black stripes.
 */
/* The exact factors — 1.271 and 1.152 — put the bar edges precisely on the tile
   edges, which measured as a margin of 0.0px and -0.2px: correct in arithmetic
   and one rounding away from showing a sliver. Both carry about a further 1%
   so the bars are pushed clear rather than aligned to the edge. */
export const CROP: Record<string, { scale: number; shiftY: number }> = {
  'broken-reflections': { scale: 1.29, shiftY: 0 },
  'diwali-ke-shor-mein': { scale: 1.175, shiftY: -1.71 },
  /* MERE HO IS A DIFFERENT PROBLEM: not bars, but the record's own title set
     into the artwork. It is a 640 square, and scanning for near-white pixels
     that sit against something 90 levels darker within two pixels finds two
     glyph bands — "mere ho" at 0.844 to 0.881 of the height and "HEEYA TIKKU"
     at 0.912 to 0.931, both in the right half. So the visible band has to end
     above them, and 0.82 is the target with a margin.

     THE SHIFT IS POSITIVE HERE, which is the opposite of Diwali: moving the
     image DOWN inside the tile shows more of its top and pushes its bottom —
     where the type is — past the edge. The scale is what makes that possible
     without opening a gap, and 1.30 is set by the worst case rather than by
     the desktop one: a square source in a portrait tile is fitted by height,
     so the whole 640 is in frame vertically and there is nothing to spare.
     Solved for both, the visible band ends at 0.718 on desktop and 0.792 on a
     phone, against type starting at 0.844. */
  'mere-ho': { scale: 1.3, shiftY: 12 },
};

/**
 * Placements added after the first three. FLANKS2 is F with the eighth and
 * tenth works exchanged, as asked — Shiva moves to cell 8 and Roar to cell 14,
 * so the ranks keep their works and only the two cells trade.
 */
export const PLACEMENTS_2: Record<string, number[]> = {
  /* G · FLANKS 2 — F, with rank 8 and rank 10 swapped between cells 14 and 8. */
  flanks2: [13, 16, 7, 10, 19, 22, 15, 8, 9, 14, 21, 20],

  /* H · WEAVE — neither of F's or D's bets, but both alternately. Odd ranks
     take the outer columns a panel almost never reaches; even ranks take the
     inner ones that are inside the aperture far more. Whichever obstruction is
     in play at a given moment, half the top of the list is clear of it. */
  weave: [13, 15, 16, 14, 7, 9, 10, 8, 19, 21, 22, 20],

  /* I · CORE — a centre of gravity rather than a row, a column or a list. The
     first four works take the 2 x 2 block at the middle of the aperture (cells
     8, 9, 14, 15 — the four highest-scoring cells that form a contiguous
     square), the next four ring it in the outer columns, and the last four take
     the bottom row. The bed reads as strongest at its centre and falling away
     outward, which is how a wall of frames is actually hung. */
  core: [15, 14, 9, 8, 13, 16, 7, 10, 20, 21, 19, 22],
};
