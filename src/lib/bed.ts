/**
 * The mosaic bed's cast and frame corrections.
 *
 * Lifted out of index.astro so the mosaic drafts could read the SAME tables the
 * home page renders from, rather than a second copy that would drift. Those
 * drafts were deleted on 2026-09-05; the file stays split out because the
 * tables are content decisions with long explanations attached, and they are
 * easier to find and argue with here than buried in a 2000-line page.
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
 * DIWALI WAS HERE AND IS NOT ANY MORE, AND THE REASON IS THE FILE, NOT THE
 * TABLE. The bed takes frame 1 only — max={1} on its Still — so this entry
 * corrected exactly one image, the 3456x2234 with bars of 180 top and 115
 * bottom, and its uneven bars are why it needed a shift as well as a scale.
 * On 2026-09-12 that frame was trimmed to 3456x1939, along with five others,
 * when the work's stills were replaced; see FRAME_CROP in src/lib/frames.ts
 * for why. A 1.175 scale and a -1.71% shift on a frame with nothing to hide
 * is not a smaller correction, it is a 17.5% zoom into a clean picture and a
 * shift off centre, so the entry goes rather than shrinks.
 *
 * IF A BED FRAME IS EVER REPLACED, CHECK THIS TABLE. An entry here is keyed to
 * one work but describes one FILE, and nothing in the build will tell you when
 * that file stops needing it.
 */
export const BED_CROP: Record<string, { scale: number; shiftY: number }> = {
  'broken-reflections': { scale: 1.29, shiftY: 0 },
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

/**
 * WHICH FRAME A PARTICULAR CELL SHOWS.
 *
 * The bed is 6 x 5. At 1280 x 800 the inner 4 x 3 -- cells 7-10, 13-16, 19-22
 * -- is the only part fully on screen; the eighteen around it are cropped by
 * the viewport, the corners showing 0.149 of themselves, the top and bottom
 * middles 0.442 and the side middles 0.336. Measured, not assumed.
 *
 * THE PROBLEM THIS SOLVES. The cast cycles sixteen works into thirty cells, so
 * fourteen works come round twice -- and because the bed takes frame 1 only,
 * coming round twice meant the SAME PHOTOGRAPH twice. Fourteen of the eighteen
 * partial cells were repeating a picture already fully visible in the centre,
 * and the remaining four were two pairs -- Roar twice, Aladdin twice --
 * repeating each other. FOURTEEN distinct photographs were doing thirty
 * cells' work: the twelve of the centre, plus Roar and Aladdin. It is thirty
 * now, counted off the rendered page rather than off this table.
 *
 * WHAT THIS TABLE DOES. It names a cell, a work and a FILE, so a repeat can be
 * broken by showing a different frame of the same work rather than by casting
 * a different work. The twelve centre cells are deliberately absent: they are
 * right as they are and this table must never touch them.
 *
 * CHOSEN BY LOOKING, THEN CHECKED BY MEASURING. The bed runs at
 * brightness(0.30) saturate(0.7) contrast(1.05), so what survives at a fifth
 * of the viewport's width is TEXTURE AND LIGHT, not faces -- a street stall
 * frying, a window onto dusk, shattered glass, a tiger in foliage, bangles,
 * a date split open. Tight head-and-shoulders goes to mush. Every frame below
 * was viewed as a contact sheet before it was picked.
 *
 * NO TWO ADJACENT TILES COME FROM THE SAME WORK, counting all eight
 * neighbours and counting the fixed centre among them -- so cell 6 cannot be
 * Diwali because cell 13 is, and cell 12 cannot be Taskaree because cell 19
 * is. The constraint is checked in code rather than by eye; the same check
 * reports 0 violations across all 30 cells.
 *
 * THE SPREAD IS DELIBERATE. Twelve different works across the eighteen cells,
 * none used more than three times, and no work used twice in the same
 * neighbourhood. Diwali Ke Shor Mein, Taskaree and Special Ops 2.0 keep two
 * cells each; Ve Maahi appears at all, which it never has, because BED_SWAPS
 * casts it out of the cycle entirely.
 *
 * TONALLY they run 9.9 to 32.8 by the same measurement that puts the twelve
 * centre tiles at 5.9 to 29.7. Two sit just above that: Special Ops 08 at
 * 32.8 and Diwali 10 at 30.4. Both are wide shots where the brightness is
 * spread rather than concentrated, which is why they are kept -- but they are
 * the two to look at first if the bed reads hot.
 *
 * THE READABILITY GUARANTEE IS NOT AT RISK FROM ANY OF THEM. Grading all 119
 * frames in the catalogue puts the brightest pixel any of them can produce at
 * 73.9 against the ceiling of 76 that index.astro's contrast arithmetic rests
 * on -- because contrast() pivots at mid grey and 0.30 brightness has already
 * put every value below the pivot. No frame in the pool can break it, so the
 * choice here is free to be about the picture.
 *
 * DIWALI KE SHOR MEIN, TASKAREE AND SPECIAL OPS 2.0 ARE PRIORITISED, and take
 * nine of the eighteen between them -- three each, all in the more visible
 * 0.442 and 0.336 cells rather than the corners.
 *
 * <- THE EXTENSION IS PART OF THE NAME AND IT IS NOT UNIFORM. This folder
 *   set is mixed: Taskaree is .webp throughout, Special Ops is .jpg then
 *   .JPG, Diwali runs .jpeg, .png and .jpg across ten files, Ve Maahi is
 *   .JPG. Three entries here were first written with .png by habit and the
 *   build caught all three by name -- framesFor throws rather than falling
 *   back, which is the right behaviour and worth not defeating.
 *
 * <- THREE FRAMES WERE REJECTED ON SIGHT AND THE REASON IS WORTH KEEPING.
 *   Aladdin 06 and 07 are packaging shots with the product's own type burned
 *   in, and Dinshaw's 02 is the show's title card, logo and all. BED_SWAPS
 *   above already moves Mere Ho to a quieter cell for exactly that reason --
 *   it calls it "the single frame in the bed with type burned into it" -- so
 *   adding three more would undo that argument. Dinshaw's 05 and 10 are used
 *   instead, which are crowd frames carrying no type.
 *
 * <- BED_GRADE IS NOT APPLIED TO THESE CELLS. That table drops Bloody Bubbly's
 *   contrast because its FRAME 1 graded to 4.2, a hole darker than the ground.
 *   Cell 5 below shows Bloody Bubbly 05, which grades to 12.1 on the bed's own
 *   contrast and needs no rescue. The entry is keyed to a work but describes
 *   one file, and these cells name their own.
 *
 * <- THE CELL NUMBERS ARE THE SIX-COLUMN LAYOUT'S. Below 900px .ms__bed goes
 *   to four columns, so the same thirty images land in different places and
 *   the inner 4 x 3 is no longer cells 7-22. Nothing breaks -- every tile is
 *   now a distinct frame in the bed's own tonal band, so any arrangement of
 *   them reads -- but the phrase "the centre twelve" only means those indices
 *   on the wide layout.
 *
 * <- BED_CROP IS APPLIED, AND THAT ONE IS SAFE. Its comment worries that an
 *   entry "is keyed to one work but describes one FILE". Measured across all
 *   ten Broken Reflections frames: every one is 1998x1080 with bars of exactly
 *   115 top and bottom, 21.3 per cent of the frame. The correction holds for
 *   any frame of that work, so the worry does not bite here.
 */
export const BED_CELLS: Record<number, { slug: string; frame: string; note: string }> = {
  /* top row. Corners see 0.149 of themselves, the middles 0.442. */
  0:  { slug: 'roar',                 frame: '06.png',  note: 'a tiger in the foliage, 9.9' },
  1:  { slug: 'dinshaws-dildaari-battles', frame: '10.png', note: 'a crowd, fists up, smoke, 24.3' },
  2:  { slug: 'special-ops-2',        frame: '08.JPG',  note: 'the city from a roof, 32.8' },
  3:  { slug: 'diwali-ke-shor-mein',  frame: '06.png',  note: 'a scooter on the road, 17.7' },
  4:  { slug: 'the-shiva-trilogy',    frame: '02.png',  note: 'an archer against fire, 28.6' },
  5:  { slug: 'taskaree',             frame: '02.webp',  note: '29.0' },

  /* side middles, 0.336 visible */
  6:  { slug: 'moholla',              frame: '05.png',  note: 'a street stall, frying, 20.7' },
  11: { slug: 'book-my-yamraj',       frame: '04.png',  note: '13.8' },
  12: { slug: 'broken-reflections',   frame: '06.png',  note: 'a room, a figure at the glass, 17.2' },
  17: { slug: 'special-ops-2',        frame: '05.JPG',  note: '25.5' },
  18: { slug: 'mumbai-standard-time', frame: '03.png',  note: 'a clock carried where a face should be, 22.9' },
  23: { slug: 'taskaree',             frame: '05.webp',  note: '25.5' },

  /* bottom row */
  24: { slug: 've-maahi',             frame: '01.JPG',  note: 'bangles, hands, gold - the one work BED_SWAPS casts out, 18.0' },
  25: { slug: 'moholla',              frame: '03.png',  note: 'shattered glass with the crowd behind it, 27.0' },
  26: { slug: 'aladdin-dateable-bites', frame: '01.png', note: 'a date split open, honey, 16.0' },
  27: { slug: 'diwali-ke-shor-mein',  frame: '10.jpg',  note: '30.4' },
  28: { slug: 'dinshaws-dildaari-battles', frame: '05.png', note: 'a face in the crowd, calling, 23.3' },
  29: { slug: 'moholla',              frame: '04.png',  note: 'a window onto the street at dusk, 21.8' },
};

/** How many tiles the bed lays down. The cycle repeats to fill them. */
export const BED_TILES = 30;
