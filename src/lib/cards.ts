/**
 * HOW BIG A WORK IS IN THE SELECTED WORKS CONVEYOR.
 *
 * Preview-only for now. Nothing on the live site imports this; the three
 * drafts at /preview/works-size-a|b|c do, so the MECHANISM is shared and only
 * the numbers differ between them — the same arrangement bed.ts has with the
 * mosaic drafts, and for the same reason. If one of these is adopted, the
 * table it uses moves into index.astro and this file goes with it.
 *
 * THE PROBLEM IT ADDRESSES. Every card in the conveyor is set to ONE COMMON
 * HEIGHT and takes its width from the work's ratio:
 *
 *   height: min(40vh, 26vw);
 *   width:  min(40vh, 26vw) * ratio;
 *
 * That is deliberate — the row is horizontal, so width is what the
 * edge-to-edge placement stacks, and a common height makes the stacking
 * arithmetic possible. But it means a work's AREA is proportional to its
 * ratio, and the vertical works are therefore the smallest things in the
 * catalogue by a wide margin. Measured at 1280x800, where the common height
 * is 320px:
 *
 *   2.39:1  765 x 320   area 2.39 H²    Broken Reflections
 *   16:9    569 x 320   area 1.78 H²    most of the catalogue
 *   1:1     320 x 320   area 1.00 H²    the two songs
 *   4:5     256 x 320   area 0.80 H²    Aladdin
 *   9:16    180 x 320   area 0.56 H²    Book My Yamraj, Bloody Bubbly, Dinshaw's
 *
 * A 9:16 work covers less than a QUARTER of the area a 2.39:1 does, and under
 * a third of a 16:9. Four works are affected and all four are the vertical,
 * social-first pieces — which is a hierarchy nobody chose: it says the format
 * a piece was made in decides how important it is.
 *
 * THE FOUR ARE NOT A LIST, THEY ARE A CONSEQUENCE. Each mode below computes a
 * scale from the RATIO, so it applies to any work narrower than a square and
 * leaves everything else at exactly 1. Adding a fifth vertical work needs no
 * edit here, and — more importantly — no work is being singled out by name for
 * special treatment. `only` exists to answer "what if it were a list", and is
 * unused by all three drafts.
 */

/** Scale 1 is the live site: one common height for every card. */
export type CardMode = 'live' | 'lift' | 'balance' | 'column';

/**
 * A · LIFT — a flat, modest boost for anything upright. The smallest change
 * that reads as deliberate rather than as a rounding error. Keeps the common
 * height as the obvious rule and treats the verticals as a mild exception.
 *
 * B · BALANCE — every upright work covers the same AREA as a square card.
 * area = (k·H)² · ratio, so k = 1/sqrt(ratio). This is the principled one: it
 * says a work's importance is its area, and its shape is only its shape.
 *
 * C · COLUMN — every upright work is as WIDE as a square card, k = 1/ratio.
 * The boldest. It abandons the common height entirely for these works and
 * gives them a common width instead, so a 9:16 becomes the tallest thing in
 * the row. Watch the aperture: at 1280x800 this puts a 9:16 card at 569px in
 * a window 624px tall.
 */
export function cardScale(mode: CardMode, ratio: number): number {
  if (mode === 'live' || ratio >= 1) return 1;
  if (mode === 'lift') return 1.15;
  if (mode === 'balance') return 1 / Math.sqrt(ratio);
  return 1 / ratio; // column
}

/** Rounded for the inline style — four decimals is well under a pixel. */
export function cardK(mode: CardMode, ratio: number): string {
  return cardScale(mode, ratio).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}
