# -*- coding: utf-8 -*-
import io, inner7, chrome12, css12

BASE = 'src/pages/preview/one-ii-stack.astro'
src = io.open(BASE, encoding='utf-8').read()
DOC_A = src.index('/**\n * PREVIEW — ONE PAGE')
DOC_B = src.index(' */\nimport Base') + len(' */\n')
RANGE_ANCHOR = "const RANGE = `${YEARS[0]} — ${YEARS[YEARS.length - 1]}`;\n"
WNODES_END = "    wi++;\n  }\n}\n"

HELPERS = RANGE_ANCHOR + r'''
/* The sentence, read out of HERO.statement rather than retyped so it cannot
   drift from the About page, with the accent riding on the word it belongs to. */
type Word = { w: string; accent: boolean };
const STMT_TEXT = HERO.statement.map((l) => l.map((p) => p.t).join('')).join(' ');
const ACCENT_WORD = (HERO.statement.flat().find((p) => p.accent)?.t ?? '').toLowerCase();
const STMT_WORDS: Word[] = STMT_TEXT.split(' ').filter(Boolean).map((w) => ({
  w, accent: !!ACCENT_WORD && w.toLowerCase().replace(/[^a-z&]/g, '') === ACCENT_WORD,
}));
const fill = (words: Word[], max: number): Word[][] => {
  const out: Word[][] = [];
  let line: Word[] = []; let len = 0;
  for (const it of words) {
    const add = line.length ? it.w.length + 1 : it.w.length;
    if (line.length && len + add > max) { out.push(line); line = [it]; len = it.w.length; }
    else { line.push(it); len += add; }
  }
  if (line.length) out.push(line);
  return out;
};
const STMT_PAIR = fill(STMT_WORDS, 22);
'''

CARDS_SRC = WNODES_END + r'''
/* ── THE WORKS THAT DO THE WEAVING ────────────────────────────────
   Three per movement, at fixed indices spaced through the catalogue so the
   same works appear in the same places on every build and each movement gets
   a different trio. Never random: the composition has to be reproducible or
   it is not a design, it is a lottery. */
const pickWorks = (idx: number[]) => idx.map((i) => wnodes[i % wnodes.length]);
const CARDS = {
  hero: pickWorks([4, 11, 1]),
  m0: pickWorks([0, 7, 13]),
  m1: pickWorks([2, 9, 14]),
  m2: pickWorks([5, 12, 3]),
  m3: pickWorks([8, 15, 6]),
  m4: pickWorks([10, 1, 4]),
};
'''

SPINE_JS = r'''
<script>
  /* ONE CLOCK FOR THE WHOLE PAGE.
        --e entry · --x exit · --p through · --f how much of the WINDOW it fills
     Every card on every movement reads whichever of these its style needs, so
     the weave on one section can never fall out of step with the weave on the
     next — there is one pass and one set of numbers behind all of them. */
  function initSpine() {
    const rg = document.querySelector<HTMLElement>('[data-rg]');
    if (!rg || rg.dataset.spineBound) return;
    rg.dataset.spineBound = '1';
    const secs = Array.from(rg.querySelectorAll<HTMLElement>('.ov, .mvt'));
    const rows = Array.from(rg.querySelectorAll<HTMLElement>('[data-row]'));
    if (!secs.length) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = innerHeight;
      for (const el of secs) {
        const r = el.getBoundingClientRect();
        const h = Math.max(1, r.height);
        const cover = (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh;
        el.style.setProperty('--e', Math.min(1, Math.max(0, (vh - r.top) / vh)).toFixed(4));
        el.style.setProperty('--x', Math.min(1, Math.max(0, -r.top / h)).toFixed(4));
        el.style.setProperty('--p', Math.min(1, Math.max(0, (vh - r.top) / (vh + h))).toFixed(4));
        el.style.setProperty('--f', Math.min(1, Math.max(0, cover)).toFixed(4));
      }
      const line = vh * 0.42, reach = vh * 0.34;
      for (const el of rows) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const d = Math.abs(r.top + r.height / 2 - line);
        el.style.setProperty('--lit', Math.max(0, 1 - d / reach).toFixed(3));
      }
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    addEventListener('resize', () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    paint();
  }
  initSpine();
  document.addEventListener('astro:page-load', initSpine);
</script>'''

REF = r''' * A WHOLE-PAGE BUILD ON XIII "Weave", which is kept. XIII wove three cards
 * through the name on the title card and left the rest of the page alone.
 * Here the title card's idea IS the page: every movement's heading is split
 * into two segments carrying different z-indices, and cards sit between them,
 * so a picture is in front of one half of the heading and behind the other on
 * every section from the opening to the enquiry.
 *
 * THE Z-INDEX GOES ON THE SEGMENTS, NEVER ON THE HEADING THAT HOLDS THEM — a
 * z-index on the wrapper opens its own stacking context, seals the segments
 * inside it, and every card is then forced wholly in front of the title or
 * wholly behind it. That one detail is the entire weave.
 *
 * AND THE CARDS NEVER TOUCH THE BODY COPY. They live in the heading stage and
 * nowhere else. A title can afford to be interrupted; running text, a list of
 * services or a form label cannot, so nothing below the stage is ever behind a
 * picture on any of these three.
'''
TAIL = r'''
 *
 * The works keep the folded conveyor, and its label rides OVER the pin rather
 * than above it, so the section's height is left as the fold needs it.
 *
 * THE REAL SITE IS UNTOUCHED.
 */
'''

DOCS = {
 'dr': (r'''/**
 * PREVIEW — ONE PAGE · VARIATION XL "Drift"
 * Kept, not throwaway. Do not delete without asking.
 *
 * WEAVE, MOVING.
 *
''' + REF + r''' *
 * THE STYLE. Every card travels at its own rate as its movement goes past —
 * one climbing, one falling, one barely moving — so what is in front of a
 * title at the top of a section is not what is in front of it at the bottom.
 * The z-order never changes; the geometry does, and that is enough to make the
 * same three pictures read as a different arrangement every second.
 *
 * THE RATES DO NOT DIVIDE INTO ONE ANOTHER — -150, 92, -44 — because rates
 * that do produce cards moving in lockstep, and the whole thing reads as one
 * sheet sliding rather than three things weaving.
 *
 * NO SCRIPT: each card multiplies the movement's own --x by its own rate.
''').rstrip('\n') + TAIL,

 'fo': (r'''/**
 * PREVIEW — ONE PAGE · VARIATION XLI "Forme"
 * Kept, not throwaway. Do not delete without asking.
 *
 * WEAVE, LOCKED UP.
 *
''' + REF + r''' *
 * THE STYLE. Nothing floats. Each stage is a twelve by six grid and every card
 * is locked into named cells, the way type and blocks are locked into a chase
 * before printing. No percentages, no rotation, no drift. The weave survives —
 * cards still sit between the two halves of the title in z — but it happens
 * inside a rigid frame instead of on a loose one.
 *
 * IT IS THE HARDER VERSION ON PURPOSE. Scattered cards hide a multitude; a
 * grid shows every misalignment you have. Everything shares one set of tracks
 * so the eye can check the work.
 *
 * COLOUR IS THE ONLY THING THAT MOVES: cards arrive drained and come to full
 * saturation as their movement takes the window. In a layout this fixed, one
 * changing property reads louder than six moving ones.
''').rstrip('\n') + TAIL,

 'ti': (r'''/**
 * PREVIEW — ONE PAGE · VARIATION XLII "Tide"
 * Kept, not throwaway. Do not delete without asking.
 *
 * WEAVE, ARRIVING.
 *
''' + REF + r''' *
 * THE STYLE. Every card is parked off its own margin while its movement is
 * away from the window, and slides in to close around the title as the
 * movement takes the frame — then withdraws the same way as it leaves. The
 * type never moves an inch. The page breathes its own catalogue in and out,
 * and each weave assembles itself in front of you rather than arriving already
 * made.
 *
 * DRIVEN BY --f, COVERAGE, so the tide is in exactly while you are reading and
 * out at both ends. Entry alone could not do it: entry does not run backwards,
 * and the cards would come in and then simply stay.
 *
 * THE TRAVEL IS IN vw, NOT PIXELS, so a card is always parked past the edge of
 * the window rather than a fixed distance that is off-screen on a laptop and
 * sitting mid-frame on a display.
''').rstrip('\n') + TAIL,
}


def assemble(key):
    st = chrome12.STYLES[key]
    out = [st['hdr']]
    for i, (n, title, folio, aid, inner, extra, attrs, tick) in enumerate(inner7.SECTIONS):
        works = 'sec--works' in extra
        cls = ' '.join(x for x in ['mvt', 'mvt--' + key, extra] if x)
        style_attr = ' style={`--count:${wnodes.length}`}' if works else ''
        head = st['head'](n, title, folio, aid, over=works)
        out.append('    <section class="%s"%s aria-labelledby="%s" data-mv="%d"%s>\n%s\n\n%s\n    </section>'
                   % (cls, attrs, aid, i, style_attr, head, inner))
    return '\n\n'.join(out)


def build(slug, title, theme, key, css):
    s = src[:DOC_A] + DOCS[key] + src[DOC_B:]
    a = s.index('    <header class="ov ov--stack" id="about">')
    b = s.rindex('    </section>') + len('    </section>')
    s = s[:a] + assemble(key) + s[b:]
    a = s.index('  /* ── VARIATION II · STACK')
    b = s.index('</style>', a)
    s = s[:a] + css + s[b:]
    assert s.count(RANGE_ANCHOR) == 1 and s.count(WNODES_END) == 1
    s = s.replace(RANGE_ANCHOR, HELPERS, 1).replace(WNODES_END, CARDS_SRC, 1)
    s = s.replace('title="One page II — Stack — Ugam Khetani"', 'title="%s"' % title, 1)
    s = s.replace('<OpNav theme="Variation II · Stack" />', '<OpNav theme="%s" />' % theme, 1)
    s = s.rstrip('\n') + '\n' + SPINE_JS.lstrip('\n') + '\n'
    io.open('src/pages/preview/%s.astro' % slug, 'w', encoding='utf-8').write(s)
    print('wrote', slug, len(s), 'bytes')


build('one-xl-drift', 'One page XL — Drift — Ugam Khetani', 'Variation XL · Drift', 'dr', css12.DRIFT_CSS)
build('one-xli-forme', 'One page XLI — Forme — Ugam Khetani', 'Variation XLI · Forme', 'fo', css12.FORME_CSS)
build('one-xlii-tide', 'One page XLII — Tide — Ugam Khetani', 'Variation XLII · Tide', 'ti', css12.TIDE_CSS)
