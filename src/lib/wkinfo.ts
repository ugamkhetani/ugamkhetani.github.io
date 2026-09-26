/**
 * THE FOUR FACTS A WORK CAN ANSWER ON HOVER — format, platform, role, year.
 *
 * Written 2026-09-27 for the ab-pv1..pv4 hover drafts. NOTHING LIVE IMPORTS
 * THIS. It exists so the four drafts cannot disagree about what a work says:
 * a difference between them should be a difference of DESIGN, not of data.
 *
 * ── WHERE EACH FACT COMES FROM ────────────────────────────────────
 *
 * ROLE and YEAR are `role` and `year` off the frontmatter. Both are set on
 * all sixteen works and neither is derived.
 *
 * FORMAT is the work's own `meta` row labelled "Format" — Ugam's words, as
 * they already set in the four-column block on the work page. FOURTEEN OF
 * SIXTEEN have one. Roar and The Shiva Trilogy do not, and those two fall
 * back to `category` ("Spec Trailer"), which is the same fact said in the
 * schema's vocabulary rather than in Ugam's.  <- FLAGGED. If those two
 * should carry a written Format row like the rest, say so and it goes in
 * the markdown rather than in this fallback.
 *
 * PLATFORM is where the work can actually be seen:
 *   `external.platform`   ZEE5, Netflix, Hotstar, Spotify, IMDb  — 6 works
 *   the first `links[]`   YouTube                                — 6 more
 * That leaves FOUR WORKS WITH NO PLATFORM AT ALL: Aladdin Dateable Bites,
 * Bloody Bubbly, Dinshaw's Dildaari Battles and Book My Yamraj. Three of
 * those four carry a `meta` row labelled "Channels" reading "Social-first",
 * which answers the same question in Ugam's own words, so it is used —
 * UNDER ITS OWN LABEL, "Channels", never relabelled as a platform. Book My
 * Yamraj has neither, so it returns three rows instead of four and every
 * draft is built to take that.  <- FLAGGED, two decisions for Ugam:
 *   1. Should Book My Yamraj name a platform? Its `studio` is Chivitra;
 *      nothing in the documents says the series streams there, so nothing
 *      is claimed here.
 *   2. Should the other three say "Social-first" under CHANNELS, or should
 *      the row simply be absent for all four?
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
  const rows: InfoRow[] = [];

  rows.push({ label: 'Format', value: metaValue(data.meta, 'Format') ?? data.category });

  const platform =
    data.external?.platform ??
    (data.links?.length ? LINK_PLATFORM[data.links[0].platform] ?? data.links[0].platform : null);
  if (platform) {
    rows.push({ label: 'Platform', value: platform });
  } else {
    const channels = metaValue(data.meta, 'Channels');
    if (channels) rows.push({ label: 'Channels', value: channels });
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
