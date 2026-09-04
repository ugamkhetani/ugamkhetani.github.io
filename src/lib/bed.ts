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
     with type burned into it — a square record sleeve carrying its own title —
     and it is not cropped. Moving it from cell 9 to cell 10 puts that title on
     screen about a third less often, which is the cheapest way to quiet it
     without touching the frame. Moholla, which carries no type, takes the
     better cell.

     THE SLEEVE WAS REPLACED ON 2026-09-05 AND THIS STILL HOLDS. The artwork
     is a different photograph at 1254x1254 rather than 640x640, but it sets
     its type in the same place: measured on the new file, "mere ho" runs 0.847
     to 0.885 of the frame height and "Heeya Tikku" 0.914 to 0.936, against
     0.844 to 0.931 for the whole block before. Re-measure if it is replaced
     again — the placement is the reason for the swap, not the file.

     WORTH KNOWING ABOUT CELL 15: Bloody Bubbly is the darkest work in the
     catalogue by a wide margin, and it holds the best cell on the bed. It used
     to mean 4.2 against a ground of 9 — darker than the ground, a hole rather
     than a tile — and none of its five frames fixes that; the brightest means
     7.9. It is now carried by BED_GRADE below rather than by its cell. */
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

/**
 * ONE TILE IS GRADED DIFFERENTLY, AND IT IS THE CONTRAST THAT MOVES — NOT THE
 * BRIGHTNESS CAP.
 *
 * Bloody Bubbly holds cell 15, the clearest cell on the bed at 0.48, and under
 * the bed's grade it meant 4.2 against a ground of 9.0. It was not a dim tile,
 * it was a HOLE — darker than the ground it sat on — and no reframing fixes it,
 * because all five of its frames are dark; the brightest means 7.9.
 *
 * THE OBVIOUS FIX DOES NOT WORK. Raising brightness for this tile is capped
 * almost immediately: the frame is near-black on average but still contains a
 * blown pixel at a true 255, so the bed's own readability ceiling is reached at
 * a brightness of 0.31. There is no room there at all.
 *
 * WHAT IS ACTUALLY CRUSHING IT IS THE CONTRAST. `contrast()` pivots around mid
 * grey, so it pushes everything below the pivot DOWN — and this frame sits far
 * below it, where the bed's 1.05 costs it more than half its mean. Dropping the
 * boost for this one tile, with brightness untouched at the bed's own 0.30:
 *
 *   contrast   mean   brightest   pixels over the #4C4C4C ceiling
 *     1.05      4.2      73.9     0          <- the bed's grade, a hole
 *     1.00      9.2      76.4     0          <- this
 *     0.99     10.4      77.0     608
 *
 * So THE 0.30 BRIGHTNESS CAP IS NOT BROKEN AND THE READABILITY GUARANTEE STILL
 * HOLDS EXACTLY: not one pixel of this tile exceeds #4C4C4C, which is the whole
 * basis of the arithmetic in index.astro. The tile simply does not receive a
 * contrast boost that was never designed with a frame this dark in mind.
 *
 * At 9.2 it now reads level with the ground rather than below it, and sits
 * inside the bed's normal range — Aasha 6.4, Roar 7.8, Taskaree 10.3.
 *
 * 0.99 is deliberately NOT taken. It looks better on the mean and it puts 608
 * pixels over the ceiling, which is the one thing the bed promises never to do.
 */
export const BED_GRADE: Record<string, { contrast: number }> = {
  'bloody-bubbly': { contrast: 1.0 },
};

/** How many tiles the bed lays down. The cycle repeats to fill them. */
export const BED_TILES = 30;
