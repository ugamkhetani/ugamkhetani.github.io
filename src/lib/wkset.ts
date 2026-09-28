/**
 * THE CATALOGUE AS A SET — what each work's four facts look like against the
 * other fifteen.
 *
 * Written 2026-09-28 for the ab-fm1..fm8 drafts, which ask a different
 * question from the two draft sets before them. ab-hp1..hp8 asked WHERE the
 * hover reading goes and ab-mv1..mv8 asked HOW IT ARRIVES; this set asks WHAT
 * THE READING IS — whether format, platform, role and year can be shown as
 * position, count, shape or comparison rather than only as four lines of
 * type. That needs the whole catalogue, not one work, which is what this
 * file assembles. NOTHING LIVE IMPORTS IT.
 *
 * EVERYTHING HERE IS DERIVED, NOTHING IS INVENTED. Every figure is counted
 * from the same `infoRows()` the other sixteen drafts read, so a work's facts
 * are identical in all twenty-four and only their presentation differs. There
 * is no editorial data in this file and no judgement about which works are
 * alike — two works share a value when the strings match, and that is all.
 *
 * ── WHAT THE CATALOGUE ACTUALLY SUPPORTS ──────────────────────────
 *
 * Counted across the sixteen works, and it is worth knowing before designing
 * against it, because two of the four facts are much thinner than they sound:
 *
 * RECOUNTED 2026-09-29, after Ugam's credits pass rewrote every work's
 * colophon. The figures below are the new ones; the old set is not kept,
 * because a stale count is worse than no count.
 *
 *   YEAR      2 distinct values.  2025 x 9, 2026 x 7.  Unchanged.
 *   PLATFORM  6 distinct over the 12 works that have one. YouTube x 6, then
 *             Spotify x 2 and IMDb, ZEE5, Netflix and JioHotstar once each.
 *             Three more carry "Channel: Social-first"; Book My Yamraj has
 *             neither and returns three rows.
 *   FORMAT    9 distinct over 16, and ALL SIXTEEN NOW HAVE ONE — Roar and
 *             The Shiva Trilogy were the two that did not. Vertical ·
 *             Short-form x 3, then AI-native Short Film, Short Film,
 *             Long-form · Episodic, Concept Trailer · Pitch Work and Single
 *             x 2 each, and Theatrical Feature, Vertical · Sound-on and
 *             AI-native Film once each.
 *   ROLE      9 distinct over 16. Music · Sound · Voice Direction x 5,
 *             Composer x 3, Music · Sound x 2, and six singletons.
 *
 * <- THE LABEL IS "Channel", SINGULAR, from the same pass. Anything looking
 *   the row up by its old plural finds nothing and drops it silently —
 *   src/lib/wkinfo.ts was changed with it for exactly that reason.
 *
 * <- AND THE SEPARATOR IS NOW A MIDDOT IN THE MARKDOWN ITSELF. Roles used
 *   to be written "Music / Sound / Voice Over" and converted to middots by
 *   the work page, which meant the hover reading — which does not convert —
 *   showed the slashes. Written as middots they read the same everywhere.
 *
 * <- THE YEAR CANNOT BE A POSITION. A timeline needs a range and this one has
 *   two points, so any draft that draws the year as a place on a span is
 *   drawing a two-position scale, which says less than the numeral does. The
 *   year is only useful here as a COUNT — nine of sixteen — or as one of the
 *   four segmentations in fm7.
 *
 * <- WHAT THE SET IS GENUINELY GOOD FOR IS RARITY. Of the four facts on a
 *   typical work, one or two are shared with several others and the rest are
 *   nearly unique: THIRTEEN of the twenty-seven distinct values in the whole
 *   catalogue are held by one work only (it was fifteen of thirty-two before
 *   the 2026-09-29 pass, which tightened the vocabulary). So "how characteristic is this?" is
 *   a question with a different answer on every work, which is what fm1, fm2
 *   and fm4 are built on.
 */

import { infoRows, type InfoRow } from './wkinfo';

export interface CatWork {
  /** Position in the score, 0-based. The conveyor's own order. */
  i: number;
  slug: string;
  /** The three-digit catalogue folio, e.g. "007". */
  no: string;
  title: string;
  year: number;
  /** The frontmatter `ratio`, e.g. "16:9". NOT the Format row — see below. */
  ratio: string;
  rows: InfoRow[];
}

/**
 * The whole catalogue in score order, each work carrying the same four facts
 * the hover reading shows.
 *
 * `ratio` IS CARRIED BUT IT IS NOT ONE OF THE FOUR FACTS, and the distinction
 * matters. `Format` is Ugam's own words for what kind of work it is — "Spec
 * Trailer", "Theatrical feature", "Vertical · Sound-on". `ratio` is the shape
 * the work was made in — 16:9, 9:16, 2.39:1. They are different fields
 * answering different questions, and a draft that draws a rectangle is
 * drawing the RATIO. Only fm5 uses it, and it says so on the page.
 */
export function catalogue(nodes: { w: any; i: number; no: string }[]): CatWork[] {
  return nodes.map((n) => ({
    i: n.i,
    slug: n.w.id,
    no: n.no,
    title: n.w.data.title,
    year: n.w.data.year,
    ratio: n.w.data.ratio,
    rows: infoRows(n.w.data),
  }));
}

/**
 * label -> value -> how many works carry it.
 *
 * Keyed on label as well as value on purpose. The labels are not all
 * interchangeable — a work with no platform carries "Channels" instead — and
 * counting "Social-first" as a platform would claim something the documents
 * do not say. Two works share a fact here only when both the label and the
 * value match.
 */
export function counts(cat: CatWork[]): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const w of cat) {
    for (const r of w.rows) {
      (out[r.label] ??= {});
      out[r.label][r.value] = (out[r.label][r.value] ?? 0) + 1;
    }
  }
  return out;
}

/** How many of the sixteen carry this exact label-and-value pair. */
export function shareOf(c: Record<string, Record<string, number>>, r: InfoRow): number {
  return c[r.label]?.[r.value] ?? 1;
}

/**
 * The indices of the works that share each of this work's facts, in score
 * order, INCLUDING the work itself — a set of one is the honest answer for a
 * value nothing else carries, and drafts that light these marks want the
 * work's own mark lit too.
 */
export function kin(cat: CatWork[], i: number): number[][] {
  const me = cat[i];
  return me.rows.map((r) =>
    cat
      .filter((w) => w.rows.some((o) => o.label === r.label && o.value === r.value))
      .map((w) => w.i),
  );
}

/**
 * What changed between this work and the one before it in the score, fact by
 * fact. The first work in the score has nothing before it, so everything on
 * it counts as new — which is correct rather than a special case: it is where
 * the catalogue starts.
 *
 * Compared BY LABEL, not by position. A work with no platform returns three
 * rows, so row 2 is its Role where its neighbour's row 2 is a Platform, and
 * comparing index against index would report a change that is really a
 * missing row. Looking the label up on the neighbour answers "did this fact
 * change" even when one of the two does not have it.
 */
export function changedFrom(cat: CatWork[], i: number): boolean[] {
  const me = cat[i];
  if (i <= 0) return me.rows.map(() => true);
  const prev = cat[i - 1];
  return me.rows.map((r) => {
    const was = prev.rows.find((o) => o.label === r.label);
    return !was || was.value !== r.value;
  });
}

/**
 * Every distinct value for a label, ordered commonest first and then
 * alphabetically, with its count. Ties are broken by name rather than left to
 * the order the works happen to sit in, so a segmented bar does not
 * re-order itself when the score is re-ordered.
 */
export function groups(
  c: Record<string, Record<string, number>>,
  label: string,
): { value: string; n: number }[] {
  return Object.entries(c[label] ?? {})
    .map(([value, n]) => ({ value, n }))
    .sort((a, b) => b.n - a.n || a.value.localeCompare(b.value));
}
