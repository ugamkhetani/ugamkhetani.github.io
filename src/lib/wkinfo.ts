/**
 * THE FOUR FACTS A WORK CAN ANSWER ON HOVER — format, platform, role, year.
 *
 * Written 2026-09-27 for the ab-pv1..pv4 hover drafts, so that no two drafts
 * could disagree about what a work says: a difference between them should be
 * a difference of DESIGN, not of data.
 *
 * THE HOME PAGE IMPORTS IT FROM 2026-09-29, when ab-xr4d was applied. It is
 * live code now. The note here used to read "NOTHING LIVE IMPORTS THIS" and
 * it no longer does — a change to these four rows changes the site.
 *
 * ── WHERE EACH FACT COMES FROM ────────────────────────────────────
 *
 * ROLE and YEAR are `role` and `year` off the frontmatter. Both are set on
 * all sixteen works and neither is derived.
 *
 * FORMAT is the work's own `meta` row labelled "Format" — Ugam's words, as
 * they already set in the colophon on the work page. ALL SIXTEEN NOW HAVE
 * ONE: Roar and The Shiva Trilogy were the two that did not, and the
 * 2026-09-29 credits pass gave them "Concept Trailer · Pitch Work", which
 * was the FLAG raised here being answered. The fallback to `category` is
 * kept because it costs nothing and a work added tomorrow may arrive
 * without the row, but nothing in the catalogue reaches it today.
 *
 * PLATFORM is where the work can actually be seen:
 *   `external.platform`   ZEE5, Netflix, JioHotstar, Spotify, IMDb — 6 works
 *   the first `links[]`   YouTube                                — 6 more
 * That leaves FOUR WORKS WITH NO PLATFORM AT ALL: Aladdin Dateable Bites,
 * Bloody Bubbly, Dinshaw's Dildaari Battles and Book My Yamraj. Three of
 * those four carry a `meta` row labelled "Channel" reading "Social-first",
 * which answers the same question in Ugam's own words, so it is used —
 * UNDER ITS OWN LABEL, "Channel", never relabelled as a platform. Book My
 * Yamraj has neither, so it returns three rows instead of four and every
 * draft is built to take that.
 *
 * <- THE LABEL IS SINGULAR FROM 2026-09-29 and this lookup was changed with
 *   it. It read "Channels" and the credits pass renamed the row to
 *   "Channel", which would have dropped the row from the hover on all three
 *   works while every precondition still passed — the kind of break that
 *   shows up as an absence rather than an error.
 *
 * <- STILL FLAGGED, one decision for Ugam: should Book My Yamraj name a
 *   platform? Its studio is Chivitra; nothing in the documents says the
 *   series streams there, so nothing is claimed here and it answers three
 *   rows rather than four.
 *
 * SPECIAL OPS READS "JioHotstar" from 2026-09-29, in both the colophon and
 * `external`, so the button and the reading cannot disagree about the name
 * of the service.
 *
 * DIWALI'S "IMDb" IS A LISTING, NOT A PLATFORM, and it is worth a word. It
 * is what `external.platform` says in the markdown, and it is true — the
 * theatrical feature has no stream to point at yet. Left as written.
 *
 * The catalogue number is NOT here. It comes from composition.ts and is
 * already on every card as `data-no`.
 */

export interface InfoRow {
  /** Set in the drafts' label type. Always one word. */
  label: string;
  value: string;
}

/** The lowercase `platform` on a `links[]` entry, set as it is written. */
const LINK_PLATFORM: Record<string, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
  spotify: 'Spotify',
  netflix: 'Netflix',
  hotstar: 'Hotstar',
  instagram: 'Instagram',
  imdb: 'IMDb',
  zee5: 'ZEE5',
};

type MetaRow = { label: string; value: string };

function metaValue(meta: MetaRow[] | undefined, label: string): string | null {
  const row = (meta ?? []).find((m) => m.label.toLowerCase() === label.toLowerCase());
  return row ? row.value : null;
}

/**
 * Up to four rows, in reading order. A row is omitted rather than filled
 * with a dash when the documents do not answer it — see the note above.
 */
export function infoRows(data: any): InfoRow[] {
  /* WRITTEN BEATS DERIVED. From 2026-09-29 each work states its own hover
     rows in the markdown, because Ugam's selection cuts across every field
     the derivation below reads — see the note on `hover` in
     src/content.config.ts. The derivation is kept as the fallback for a work
     added without one; on the present sixteen it never runs. */
  if (Array.isArray(data.hover) && data.hover.length) {
    return data.hover.map((r: MetaRow) => ({ label: r.label, value: r.value }));
  }

  const rows: InfoRow[] = [];

  rows.push({ label: 'Format', value: metaValue(data.meta, 'Format') ?? data.category });

  const platform =
    data.external?.platform ??
    (data.links?.length ? LINK_PLATFORM[data.links[0].platform] ?? data.links[0].platform : null);
  if (platform) {
    rows.push({ label: 'Platform', value: platform });
  } else {
    const channels = metaValue(data.meta, 'Channel');
    if (channels) rows.push({ label: 'Channel', value: channels });
  }

  rows.push({ label: 'Role', value: data.role });
  rows.push({ label: 'Year', value: String(data.year) });

  return rows;
}

/** The same four facts as one line, for the drafts that set them inline. */
export function infoLine(data: any, sep = ' · '): string {
  return infoRows(data)
    .map((r) => r.value)
    .join(sep);
}
