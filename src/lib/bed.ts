/**
 * The mosaic bed: thirty named cells.
 *
 * Lifted out of index.astro so the mosaic drafts could read the SAME tables the
 * home page renders from, rather than a second copy that would drift. The file
 * stays split out because the table is a content decision with long
 * explanations attached, and it is easier to find and argue with here than
 * buried in a 2000-line page.
 */

/**
 * THE BED NO LONGER FOLLOWS THE SCORE, AND THAT IS THE POINT OF IT.
 *
 * Applied 2026-11-27 on Ugam's instruction — "apply ab-bed5". He picked it out
 * of /preview/, which holds every arrangement the bed has ever had, and what
 * he picked was the PICTURE: the thirty tiles as that bed drew them on
 * 22 September. So all thirty cells are named here. Nothing falls through to
 * anything.
 *
 * UNTIL TODAY HALF THE BED WAS COMPUTED. It walked `order` from
 * src/data/composition.ts, repeated it to fill thirty tiles and let this table
 * override eighteen of them; the twelve in the middle were whatever the score
 * put there. That is why a bed could not simply be put back — ab-bed5 was cast
 * against a SIXTEEN-work score and today's has eighteen, so restoring the
 * eighteen cells would have restored eleven-twelfths of the wrong picture.
 * Naming all thirty is the only way to have the one he chose.
 *
 * WHAT IT COSTS, PLAINLY. Kaalakund and Ira are not in the background. Neither
 * existed when this arrangement was made, and a table of named cells cannot
 * cast a work it does not name. Ira was already out by Ugam's instruction of
 * 30 September; Kaalakund is newly out, and putting it back means giving a
 * cell to it and re-checking that cell's eight neighbours.
 *
 * WHAT IT BUYS. The bed cannot break by itself any more. Its own notes used to
 * record four silent re-casts in a single day and two adjacency violations that
 * shipped for ten days in November, all of them caused by a work being added or
 * the score being reordered, and none of them caught by the build. Adding a
 * work now changes the catalogue, the numbering and the next-work chain, and
 * leaves this table alone.
 *
 * SIXTEEN WORKS, THIRTY DISTINCT FRAMES. Mumbai Standard Time holds three
 * cells; Ve Maahi, Dinshaw's and Mere Ho hold one each; the other twelve works
 * hold two. No frame appears twice.
 *
 * NO WORK BESIDE ITSELF, counting all eight neighbours on the six-column grid
 * — checked in code against this table and again against the rendered DOM,
 * 0 violations both times. THE FOUR-COLUMN GRID BELOW 900px IS NOT CLEAR AND
 * NEVER HAS BEEN: the same thirty images land in different places there and
 * three pairs meet — Shiva at 4 and 8, Aasha at 11 and 14, Broken Reflections
 * at 22 and 26. Every cell number in this file is a SIX-COLUMN position. That
 * is the arrangement's own long-standing cost, carried over unchanged; it was
 * three before today and it is three now.
 *
 * THE FIGURES IN THE NOTES WERE RE-MEASURED FOR THIS, and most of them moved.
 * The numbers this table carried were taken at brightness(0.30) saturate(0.7),
 * and the bed has run at brightness(0.34) saturate(0.78) since the frosted pane
 * went on the home page on 29 September. Every note below is the mean of the
 * graded frame at the grade the page actually runs, so they can be compared
 * with each other. They run 7.9 to 41.0 against a ground of 9.0.
 *
 * <- THE CAST IS 22 SEPTEMBER'S AND THE GRADE IS TODAY'S, which is a thing to
 *   know rather than a thing wrong. ab-bed5 was chosen by eye under the darker
 *   grade; it is four points brighter everywhere now. Moving the page back to
 *   0.30 is a separate decision and a much larger one — the corner labels, the
 *   frosted pane and the readability arithmetic are all written against 0.34 —
 *   so it was not taken here.
 *
 * CHOSEN BY LOOKING, THEN CHECKED BY MEASURING. What survives at a fifth of the
 * viewport's width is TEXTURE AND LIGHT, not faces — a street stall frying, a
 * window onto dusk, shattered glass, a tiger in foliage, bangles, a date split
 * open. Tight head-and-shoulders goes to mush. Every frame below was viewed as
 * a contact sheet before it was picked.
 *
 * <- THREE FRAMES WERE REJECTED ON SIGHT AND THE REASON IS WORTH KEEPING.
 *   Aladdin 06 and 07 are packaging shots with the product's own type burned
 *   in, and Dinshaw's 02 is the show's title card, logo and all. Mere Ho is the
 *   one frame in the bed that carries type anyway — see cell 10 — so adding
 *   three more would undo the argument made there. Dinshaw's 05 and 08 are
 *   crowd frames carrying no type.
 *
 * <- THE EXTENSION IS PART OF THE NAME AND IT IS NOT UNIFORM. This folder set
 *   is mixed: Taskaree is .webp throughout, Special Ops is .jpg then .JPG,
 *   Diwali runs .jpeg, .png and .jpg across ten files, Ve Maahi is .JPG.
 *   framesFor throws on a miss rather than falling back, which is the right
 *   behaviour and worth not defeating.
 *
 * WHAT THE CELLS SEE. The bed is 6 x 5 and inset -10%, so at 1280 x 800 the
 * inner 4 x 3 — cells 7-10, 13-16, 19-22 — is the only part fully on screen.
 * The eighteen around it are cropped by the viewport, the corners showing 0.149
 * of themselves, the top and bottom middles 0.442 and the side middles 0.336.
 * Measured, not assumed. That is still why the quietest frames go to the
 * corners and the ones worth seeing go to the middle, even though the table no
 * longer treats the two groups differently.
 *
 * WHERE THE HISTORY WENT. The thirty cells below ARE the record of this
 * arrangement — there is nothing computed left to reconstruct, so the table
 * says exactly what the page draws. The ten arrangements before it are in git:
 * `git show 13d7396:src/lib/bed.ts` is the one this replaced, and that file's
 * own notes name the commits for the rest. They were also built as browsable
 * drafts, ab-bed1 to ab-bed11, on 2026-11-27 — those are in Ugam's working
 * tree and deliberately not committed, so do not expect src/pages/preview/ to
 * exist in a fresh clone.
 */

/**
 * ONE FRAME CARRIES LETTERBOX BARS BURNED INTO THE FILE — not a layout fault,
 * it was exported that way. Measured by walking rows in from the top and
 * bottom until the mean channel clears 6: Broken Reflections has 115px top and
 * bottom of 1080 — 21.3% of the frame. It is wider than a tile, so
 * object-fit: cover fits it by height and the whole source height, bars
 * included, lands in the tile.
 *
 * The scale pushes the bars past the tile edge. The factor that puts the bar
 * edges exactly on the tile edges is 1.271, which measured as a margin of
 * 0.0px — right in arithmetic and one rounding from showing a sliver. This
 * carries about 1% more, the smallest that holds a pixel of margin at the
 * narrow four-column grid as well as the six-column one. Nothing is gained by
 * trimming further: the floor for a 1px margin is 1.292.
 *
 * IT IS KEYED TO A WORK AND THAT IS SAFE HERE. The worry with such an entry is
 * that it describes one FILE. Measured across all ten Broken Reflections
 * frames: every one is 1998x1080 with bars of exactly 115 top and bottom. Both
 * cells that work holds — 22 and 26 — are corrected correctly.
 *
 * IF A BED FRAME IS EVER REPLACED, CHECK THIS TABLE. Nothing in the build will
 * tell you when a file stops needing it.
 */
export const BED_CROP: Record<string, { scale: number; shiftY: number }> = {
  'broken-reflections': { scale: 1.29, shiftY: 0 },
};

/**
 * EVERY CELL, ITS WORK, ITS FILE AND WHY.
 *
 * The number in each note is the frame's mean at the bed's own
 * brightness(0.34) saturate(0.78) contrast(1.05). The ground behind them is
 * #0A0908, which means 9.0 — a tile below that reads as a hole rather than a
 * picture, which is what `k` on cell 15 exists to prevent.
 */
export const BED_CELLS: Record<
  number,
  {
    slug: string;
    frame: string;
    note: string;
    /** Overrides the bed's contrast for this cell alone. See cell 15. */
    k?: number;
  }
> = {
  /* ── top row. Corners see 0.149 of themselves, the middles 0.442. ── */
  0:  { slug: 'mumbai-standard-time',      frame: '04.png',  note: 'the clock carried through a crowd, 27.0' },
  1:  { slug: 've-maahi',                  frame: '01.JPG',  note: 'bangles, hands, gold, 19.7' },
  2:  { slug: 'mumbai-standard-time',      frame: '10.png',  note: 'an alarm clock, still life, 14.9' },
  3:  { slug: 'dinshaws-dildaari-battles', frame: '08.png',  note: 'a crowd in identical masks, 23.9' },
  /* HELD BY HAND, and the hold's premise is true again. This cell was kept as
     the archer because it is the tile directly above Mere Ho — and for most of
     October and November it was not, because the cycle had moved Mere Ho or
     dropped it from the bed entirely. Cell 10 is Mere Ho again and named, so
     nothing can move it. */
  4:  { slug: 'the-shiva-trilogy',         frame: '02.png',  note: 'an archer against fire, 24.0 - HELD, the tile above Mere Ho' },
  5:  { slug: 'my-red-crayon',             frame: '05.png',  note: 'two children and a red ribbon, 24.9' },

  /* ── row two. Side middles are 0.336 visible; 7-10 are fully on screen. ── */
  6:  { slug: 'special-ops-2',             frame: '07.JPG',  note: 'a call at night, the city behind in bokeh, 9.0' },
  /* THE BRIGHTEST TILE IN THE MIDDLE, and it sits beside the darkest run in
     the bed rather than among the other bright ones. */
  7:  { slug: 'my-red-crayon',             frame: '01.png',  note: '32.3' },
  8:  { slug: 'the-shiva-trilogy',         frame: '01.png',  note: '10.8' },
  9:  { slug: 'moholla',                   frame: '01.png',  note: '25.6' },
  /* THE ONE FRAME IN THE BED WITH TYPE BURNED INTO IT — a square record sleeve
     carrying its own title — and it is not cropped. It is here rather than in
     a side middle because this cell is seen less of the time than it looks:
     the argument was made when the cast was computed and it holds now that it
     is named. Measured on the current artwork, 1254x1254 rather than the
     640x640 it replaced: "mere ho" runs 0.847 to 0.885 of the frame height and
     "Heeya Tikku" 0.914 to 0.936. Re-measure if the sleeve is replaced again —
     the placement is the reason for the cell, not the file. */
  10: { slug: 'mere-ho',                   frame: '01.png',  note: 'the record sleeve, type and all, 14.9' },
  11: { slug: 'aasha',                     frame: '05.png',  note: 'blinds, black and white, 24.6' },

  /* ── row three ── */
  12: { slug: 'roar',                      frame: '02.png',  note: "a tiger's eye, 8.8" },
  13: { slug: 'diwali-ke-shor-mein',       frame: '01.jpeg', note: '23.4' },
  14: { slug: 'aasha',                     frame: '01.png',  note: '7.9 - the darkest tile in the bed' },
  /* THE ONE CELL THAT IS GRADED DIFFERENTLY, AND IT IS THE CONTRAST THAT
     MOVES, NOT THE BRIGHTNESS CAP.

     Bloody Bubbly is the darkest work in the catalogue by a wide margin. Under
     the bed's own grade this frame means 5.2 against a ground of 9.0 — not a
     dim tile, a HOLE, darker than the thing it sits on. No reframing fixes it:
     all five of its frames are dark.

     THE OBVIOUS FIX DOES NOT WORK. Raising brightness for this tile alone is
     capped almost immediately — the frame is near-black on average but still
     contains a blown pixel at a true 255, so there is no headroom there at all.

     WHAT IS ACTUALLY CRUSHING IT IS THE CONTRAST. `contrast()` pivots around
     mid grey, so it pushes everything below the pivot DOWN, and this frame sits
     far below it. Dropping the boost for this one cell, brightness untouched:

       contrast   mean
         1.05      5.2    <- the bed's grade, a hole
         1.00     10.3    <- this
         0.99     11.5

     At 10.3 it reads level with the ground rather than below it and sits
     between its own neighbours, cell 14 at 7.9 and cell 16 at 13.6. 0.99 is
     deliberately not taken: it buys a point and a bit and starts lifting the
     blown pixel with it.

     THIS IS NOT A NEW CORRECTION. The same 1.0 was applied to the same frame
     before today, through a table keyed on the WORK that only reached a cell
     the cycle had filled. Named cells did not inherit it, so pinning this one
     would have put the hole back — which is why the override moved onto the
     cell itself. */
  15: { slug: 'bloody-bubbly',             frame: '01.png',  note: 'candles in the dark, 5.2 graded to 10.3 - see k', k: 1.0 },
  16: { slug: 'mumbai-standard-time',      frame: '01.png',  note: '13.6' },
  17: { slug: 'bloody-bubbly',             frame: '02.png',  note: 'a can among candles, 8.6' },

  /* ── row four ── */
  18: { slug: 'book-my-yamraj',            frame: '07.png',  note: '13.1' },
  19: { slug: 'taskaree',                  frame: '01.webp', note: '12.3' },
  20: { slug: 'book-my-yamraj',            frame: '01.png',  note: '13.4' },
  21: { slug: 'special-ops-2',             frame: '01.jpg',  note: 'the original Special Ops still, 29.8' },
  /* BED_CROP TAKES THE LETTERBOX OFF THIS ONE AND OFF CELL 26. The mean of the
     file is 17.0 and the mean of what is actually drawn is 21.6, because the
     bars are scaled past the tile edge and never reach the screen. */
  22: { slug: 'broken-reflections',        frame: '01.png',  note: 'a lens filling the frame, 21.6 with the bars off' },
  23: { slug: 'aladdin-dateable-bites',    frame: '03.png',  note: '25.1' },

  /* ── bottom row ── */
  24: { slug: 'aladdin-dateable-bites',    frame: '02.png',  note: 'a hand over chocolates, 15.3' },
  25: { slug: 'moholla',                   frame: '02.png',  note: 'a courtyard from above at night, 11.4' },
  26: { slug: 'broken-reflections',        frame: '02.png',  note: 'a face behind glass, 20.8 with the bars off' },
  /* HELD BY HAND, and this premise is true again as well: cell 21 is the
     original Special Ops still and this is the tile directly below it. The
     brightest tile in the bed by a distance, and it was asked for by name. */
  27: { slug: 'diwali-ke-shor-mein',       frame: '10.jpg',  note: '41.0 - HELD, the tile below the original Special Ops still' },
  28: { slug: 'taskaree',                  frame: '06.webp', note: 'fire behind the figure, 25.5' },
  29: { slug: 'roar',                      frame: '04.png',  note: 'claw marks raked down bark, 8.5' },
};

/** How many tiles the bed lays down. Every one of them is named above. */
export const BED_TILES = 30;
