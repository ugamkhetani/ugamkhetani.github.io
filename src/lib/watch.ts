/**
 * THE WATCH CONTROL'S TWO PER-WORK NUMBERS — how dark its wash has to be, and
 * whether it sits off the foot of the frame.
 *
 * Both are readings of a photograph, which is why they live in a table rather
 * than in a rule. §5 says the same thing about the countdown: what threatens
 * white type is the brightest patch inside the glyph's own outline, and that
 * is a property of the individual picture, not of the design.
 *
 * ── WATCH_SCRIM ───────────────────────────────────────────────────
 *
 * IT WAS ONE GLOBAL 0.63 UNTIL 2026-10-06, set by the worst frame in the
 * catalogue and worn by all seventeen. Ugam asked for the wash to be subtler,
 * and a lower global is not available: 0.63 IS the minimum that carries Mere
 * Ho, whose sleeve is near-white where the lead sits. So it became per work,
 * and most of the route got much less.
 *
 * SOLVED, NOT CHOSEN. For every control on every page, the brightest pixel
 * inside each glyph box was found and the alpha binary-searched until that
 * pixel clears the ink's floor — 4.5:1 under 24px, 3:1 at or over — with the
 * compositing done the way the browser does it, per channel on encoded sRGB
 * and NOT in linear light (§6). Measured at 1280x800 and again at 375x812,
 * because the type and the crop both move:
 *
 *   work                  1280     375    taken   was
 *   mumbai-standard-time  0.000   0.000    0.00   0.63
 *   roar                  0.000   0.000    0.00   0.63
 *   broken-reflections    0.000   0.000    0.00   0.63
 *   diwali-ke-shor-mein   0.139   0.119    0.15   0.63
 *   taskaree              0.000   0.175    0.19   0.63
 *   dinshaws              0.196   0.121    0.21   0.63
 *   aasha                 0.000   0.230    0.25   0.63
 *   my-red-crayon         0.257   0.154    0.27   0.63
 *   book-my-yamraj        0.182   0.257    0.27   0.63
 *   moholla               0.000   0.302    0.32   0.63
 *   ira                   0.097   0.368    0.39   0.63
 *   special-ops-2         0.382   0.404    0.43   0.63
 *   the-shiva-trilogy     0.000   0.427    0.45   0.63
 *   bloody-bubbly         0.000   0.429    0.45   0.63
 *   aladdin               0.473   0.500    0.53   0.63
 *   ve-maahi              0.527   0.506    0.56   0.63
 *   mere-ho               0.611   0.616    0.63   0.63
 *
 * THE MARGIN IS 5% OVER THE WORSE OF THE TWO WIDTHS, rounded up to two
 * decimals — the same discipline the old global had, which sat 2.8% over its
 * own binding case.
 *
 * <- NOTHING GOT DARKER. Mere Ho binds the whole system and is CAPPED at the
 *   0.63 it already carried rather than taking its 5% — it would have gone to
 *   0.65, and the instruction was subtler. It therefore keeps a 2.3% margin
 *   where every other work has 5%. Three works carry no wash at all.
 *
 * <- SEVERAL WORKS NEED NOTHING AT 1280 AND SOMETHING AT 375. The frame gets
 *   smaller, the crop changes which pixels sit under the glyphs, and the type
 *   does not shrink in proportion. Measure both widths or the phone fails
 *   silently — Shiva, Bloody Bubbly and Moholla all read 0.000 on a desktop.
 *
 * RE-SOLVE AFTER ANY CHANGE TO THE LOCKUP OR A FRAME. The alpha belongs to
 * where the ink lands, not to the control: when the mark moved from inside
 * the line of type (ZW13) to beside it (ZW12) the whole column shifted about
 * 49px and Mere Ho went from 0.542 to 0.613. Swapping a still, changing a
 * label or moving the control means measuring again, not inheriting.
 *
 * ── WATCH_LIFT ────────────────────────────────────────────────────
 *
 * Pixels added to the control's bottom inset on one work. This is Ugam's eye,
 * not a derivation: on Broken Reflections the control read as sitting on the
 * frame's lower edge, and 40px puts it inside the picture. Measured free —
 * that frame needs no wash at any lift between 0 and 80px, so the move costs
 * nothing in contrast. Its poster also carries a 98px bar burned into the top
 * of the file, which is why the picture reads shorter than the 16:9 box it is
 * covering and the control looked low in it.
 */

/** slug → alpha of the ground-colour wash behind the control. 0 = none. */
export const WATCH_SCRIM: Record<string, number> = {
  'mumbai-standard-time': 0,
  'roar': 0,
  'broken-reflections': 0,
  'diwali-ke-shor-mein': 0.15,
  'taskaree': 0.19,
  'dinshaws-dildaari-battles': 0.21,
  'aasha': 0.25,
  'my-red-crayon': 0.27,
  'book-my-yamraj': 0.27,
  'moholla': 0.32,
  'ira': 0.39,
  'special-ops-2': 0.43,
  'the-shiva-trilogy': 0.45,
  'bloody-bubbly': 0.45,
  'aladdin-dateable-bites': 0.53,
  've-maahi': 0.56,
  'mere-ho': 0.63,
};

/** slug → extra pixels above the frame's foot. Absent means the usual inset. */
export const WATCH_LIFT: Record<string, number> = {
  'broken-reflections': 40,
};

/** A work's wash. Unlisted works get the binding value, never a bare frame. */
export function scrimFor(slug: string): number {
  return WATCH_SCRIM[slug] ?? 0.63;
}

/** A work's lift, in px. */
export function liftFor(slug: string): number {
  return WATCH_LIFT[slug] ?? 0;
}
