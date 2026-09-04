/**
 * Reading the `awards:` field on a work.
 *
 * WHAT THIS REPLACED, AND WHY IT WAS WRONG. The work page used to join every
 * award entry with " · " and then split the result on "·", which threw away the
 * only thing that told the entries apart. On the works with a single award the
 * damage is invisible. On Diwali Ke Shor Mein, which has two, the separator
 * INSIDE an award ("Official Selection · Indian Film Festival of Melbourne")
 * became indistinguishable from the separator BETWEEN awards, and the section
 * rendered as one 1126px line of orange caps:
 *
 *   Official Selection · Indian Film Festival of Melbourne ·
 *   Official Selection · Toulouse Indian Film Festival
 *
 * SO THE ENTRY IS NEVER JOINED. Each award stays its own record, and the split
 * happens on the FIRST "·" only — which is what keeps "Waves Film Bazaar 2025 ·
 * IFFI Goa" whole as one awarding body rather than breaking it into a festival
 * and a city.
 *
 * Promoted from the recognition drafts; the three of them under
 * The recognition drafts imported this too, so the drafts and the live
 * page read the field through the same code and cannot drift apart.
 */

export interface Citation {
  /** The honour itself: "Official Selection", "Best AI Film", "Top 100 Storytellers". */
  citation: string;
  /** Who gave it, or null where the award names no body ("India's First AI Rap Battle"). */
  body: string | null;
  /** The markdown's own `star: true` — a win rather than a selection. */
  star: boolean;
}

const DOT = '·';

export function parseAwards(awards: { star?: boolean; text: string }[]): Citation[] {
  return awards.map((a) => {
    const text = a.text.trim();
    const i = text.indexOf(DOT);
    /* First dot only. A later one belongs to the body's own name. */
    return i === -1
      ? { citation: text, body: null, star: !!a.star }
      : { citation: text.slice(0, i).trim(), body: text.slice(i + 1).trim(), star: !!a.star };
  });
}

/**
 * The OTHER shape the field takes: "7 Official Selections · 10 Nominations ·
 * 6 Wins" — counts, not citations, on Aasha and Broken Reflections. Those two
 * render as three big figures and are deliberately left alone. The work page
 * makes the same distinction with its own older test, which it keeps; this is
 * here for the drafts and for anything that needs to ask the question directly.
 */
export function isTally(awards: { text: string }[]): boolean {
  if (awards.length !== 1) return false;
  const parts = awards[0].text.split(DOT).map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 && parts.every((p) => /^\d+\s+.+$/.test(p));
}

/** Distinct citations in source order, each with the bodies filed under it. */
export function groupByCitation(cites: Citation[]): { citation: string; star: boolean; bodies: string[] }[] {
  const out: { citation: string; star: boolean; bodies: string[] }[] = [];
  for (const c of cites) {
    const hit = out.find((g) => g.citation === c.citation);
    if (hit) {
      if (c.body) hit.bodies.push(c.body);
      hit.star = hit.star || c.star;
    } else {
      out.push({ citation: c.citation, star: c.star, bodies: c.body ? [c.body] : [] });
    }
  }
  return out;
}
