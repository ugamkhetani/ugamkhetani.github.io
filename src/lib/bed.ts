/**
 * The mosaic bed's cast and frame corrections.
 *
 * Lifted out of index.astro so the drafts under src/pages/preview/mosaic-*.astro
 * can read the SAME tables the home page renders from. A draft that proposes
 * "the live bed, with one more swap" has to start from the live bed, and a
 * second copy of these two objects would drift the first time one was edited.
 */

/**
 * WHO STANDS IN THE BED, against the score's own order.
 *
 * The bed walks `order` from src/data/composition.ts — the sequence the works
 * appear in down the page — and repeats it until thirty tiles are filled, so a
 * work's place in the bed is its place in the composition. These entries change
 * the cast without touching the score.
 *
 * IT IS READ AGAINST THE UNMODIFIED SEQUENCE, which is what lets a pair EXCHANGE
 * rather than one merely replacing the other: both directions can be listed and
 * neither overwrites the other, because each is resolved from the original id.
 *
 * The swaps follow the cycle rather than the grid. Dinshaw's occurs twice in
 * thirty tiles and Ve Maahi once, which is why two works going out changes
 * three cells.
 */
export const BED_SWAPS: Record<string, string> = {
  /* Measured against the cells that are actually seen, both land well: Aasha
     takes the cell clear of the aperture edge and of every panel 0.47 of the
     time — second best on the bed — and Diwali one at 0.29. */
  'dinshaws-dildaari-battles': 'diwali-ke-shor-mein',
  've-maahi': 'aasha',

  /* THESE THREE ROTATE, they are not two independent exchanges — and because
     the table is keyed on the SCORE'S slug rather than on the current occupant,
     the rotation has to be written out as its end state rather than as the two
     swaps that produced it:

       score index  9  bloody-bubbly  ->  moholla
       score index 10  moholla        ->  mere-ho
       score index 15  mere-ho        ->  bloody-bubbly

     Read in cells: Moholla takes 9 (clear 0.175), Mere Ho takes 10 (0.115) and
     Bloody Bubbly keeps 15, the best cell on the bed at 0.48. Each also holds
     one cell in the ring nothing ever sees.

     MERE HO IS THE ONE THAT MATTERS HERE. It is the single frame in the bed
     with type burned into it — a square record sleeve carrying its own title,
     measured at 0.844 to 0.931 of the frame height — and it is not cropped.
     Moving it from cell 9 to cell 10 puts that title on screen about a third
     less often, which is the cheapest way to quiet it without touching the
     frame. Moholla, which carries no type, takes the better cell.

     WORTH KNOWING ABOUT CELL 15: Bloody Bubbly is the darkest work in the
     catalogue. Under the bed's own filter it means 3.7 against a ground of 10,
     so the best cell on the bed reads close to black. None of its five frames
     clears the ground — the brightest is 7.9 — so a different still would not
     fix it. */
  'bloody-bubbly': 'moholla',
  'moholla': 'mere-ho',
  'mere-ho': 'bloody-bubbly',
};

/**
 * TWO FRAMES CARRY LETTERBOX BARS BURNED INTO THE FILE — not a layout fault,
 * they were exported that way. Measured by walking rows in from the top and
 * bottom until the mean channel clears 6: Broken Reflections has 115px top and
 * bottom of 1080, and Diwali 180 top and 115 bottom of 2234 — 21.3% and 13.2%
 * of the frame. Both are wider than a tile, so object-fit: cover fits them by
 * height and the whole source height, bars included, lands in the tile.
 *
 * The scale pushes the bars past the tile edge; Diwali needs a shift as well
 * because its bars are uneven, and without one the picture sits low. The factors
 * that put the bar edges exactly on the tile edges are 1.271 and 1.152, which
 * measured as a margin of 0.0 and -0.2px — right in arithmetic and one rounding
 * from showing a sliver. These carry about 1% more, the smallest that holds a
 * pixel of margin at the narrow four-column grid as well as the six-column one.
 * Nothing is gained by trimming further: the floor for a 1px margin is 1.292
 * and 1.171.
 */
export const BED_CROP: Record<string, { scale: number; shiftY: number }> = {
  'broken-reflections': { scale: 1.29, shiftY: 0 },
  'diwali-ke-shor-mein': { scale: 1.175, shiftY: -1.71 },
};

/** How many tiles the bed lays down. The cycle repeats to fill them. */
export const BED_TILES = 30;
