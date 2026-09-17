/**
 * ABOUT — the page's content, kept out of the markup.
 *
 * Every figure below is checked against the works collection: two works
 * carry a starred "Best AI Film" win, Netflix and Hotstar are both real
 * platform values, and 2025–2026 is the catalogue's actual year range.
 * If the collection grows past those, this file is what needs editing.
 */

export const HERO = {
  eyebrow: 'Ugam Khetani · About',
  /* The statement is split so "film" can take the accent, echoing the way
     the work profile sets it. Each line is one masked reveal. */
  statement: [
    [{ t: 'A composer working in' }],
    [{ t: 'film', accent: true }, { t: ', brand & sound.' }],
  ],
  role: ['Composer', 'Producer', 'Sound Designer'],
  place: ['Mumbai, India', 'Working globally'],
};

/** Drop a portrait at src/media/about/portrait.jpg and name it here; the hero
 *  becomes two columns. Left empty, the hero is typographic and full width —
 *  deliberate rather than a hole where a picture should be. */
export const PORTRAIT = '';

export const WHO = {
  head: 'I think about sound as part of the world, not something added to it.',
  body: [
    'I’m Ugam, a composer, producer and sound designer based in Mumbai.',
    'I work across film, brands, music and emerging formats, developing sound from the first creative idea through to the final mix.',
    'My work moves between composition and sound design. I’m interested in what happens when melody, texture and atmosphere begin to feel like the same language.',
    'That begins with listening closely to the image, the pace, the space around a scene, and the details that give it character.',
    'Those details aren’t decoration. They’re the work.',
  ],
};

export const PROCESS = [
  {
    n: '01',
    title: 'Start with the world',
    lines: [
      'I start with the world before I start with the sound.',
      'What does it feel like? What is its texture? What does it leave unsaid?',
      'From there, I shape a language that feels specific to the work.',
    ],
  },
  {
    n: '02',
    title: 'Build, don’t assemble',
    lines: [
      'Music, sound design, voice and mix are not separate boxes.',
      'They influence each other.',
      'I prefer building them together, until the different layers begin to feel like one piece.',
    ],
  },
  {
    n: '03',
    title: 'Follow it through',
    lines: [
      'I like to stay close to the work through the final mix.',
      'A good idea is only useful if it survives production.',
      'The last decision matters as much as the first.',
    ],
    pull: 'Magic lies in the details.',
  },
];

export const ACROSS = {
  head: ['Different formats.', 'Same obsession.'],
  lede: 'I work across formats, but the underlying approach stays the same: build a distinct sonic world that belongs to the work.',
  columns: [
    { label: 'Film',  items: ['Original Score', 'Film & OTT', 'Short Films', 'AI Films', 'Micro Drama'] },
    { label: 'Brand', items: ['Sonic Identity', 'Campaign Audio', 'Sound Design', 'Voice Direction', 'Final Mix'] },
    { label: 'Music', items: ['Production', 'Composition', 'Mixing', 'Artist-led Records', 'Original Music'] },
  ],
};

export const PROOF = {
  /* `count` makes a figure tick up from zero when it scrolls into view.
     Only the ones that are genuinely quantities get it — a year range and a
     pair of platform names are not numbers and would look absurd counting. */
  stats: [
    { figure: '2025–2026',       label: 'Selected work' },
    { figure: '02×',               label: 'Best AI Film', count: 2, pad: 2, suffix: '×' },
    { figure: 'Netflix · Hotstar', label: 'Streaming' },
  ],
  works: [
    { slug: 'mumbai-standard-time', title: 'Mumbai Standard Time', role: 'Music · Sound · Voice' },
    { slug: 'diwali-ke-shor-mein',  title: 'Diwali Ke Shor Mein',  role: 'Original Score' },
    { slug: 'special-ops-2',        title: 'Special Ops 2.0',      role: 'Additional Composition · Production' },
    { slug: 've-maahi',             title: 'Ve Maahi',             role: 'Production · Composition · Mix' },
  ],
};

export const CLOSING = {
  head: 'The work should sound like itself.',
  body: 'Whether it’s a film, a campaign or a record, I’m interested in making the sound feel inseparable from the work, from the first idea to the final detail.',
  call: 'Let’s make something worth hearing.',
  tail: 'Talk via email, WhatsApp or phone.',
};
