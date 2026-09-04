# -*- coding: utf-8 -*-

BASE = r'''  /* ── THE WEAVE, EXTENDED TO THE WHOLE PAGE ───────────────────────
     XIII wove three cards through the name on the title card and left the rest
     of the page alone. Here every movement gets the same treatment: its title
     is split into two segments carrying DIFFERENT z-indices, and the cards sit
     between them — so a picture is in front of one half of the heading and
     behind the other, on every section, all the way down.

     THE Z-INDEX GOES ON THE SEGMENTS, NEVER ON THE HEADING THAT HOLDS THEM.
     A z-index on the wrapper opens a stacking context of its own, seals the
     segments inside it, and every card is then forced to be wholly in front of
     the title or wholly behind it. On the segments, they share a context with
     the cards, which is the only reason the weave exists at all.

       z2  first half of the title      z3  cards 0 and 1  (between the halves)
       z4  second half of the title     z5  card 2         (over everything)

     THE CARDS NEVER TOUCH THE BODY COPY. They live in the heading stage and
     nowhere else, so no paragraph, list or form label is ever behind a
     picture — the weave is a device for titles, and titles can afford to be
     interrupted in a way that running text cannot. */
  .mvt {
    position: relative;
    margin-inline: calc(var(--margin) * -1);
    padding-inline: var(--margin);
    padding-block: clamp(66px, 11vh, 150px);
    overflow: clip;
  }
  .mvt.sec--works { padding-block: 0; padding-inline: 0; overflow: visible; }
  .mvt:nth-of-type(even) { background: var(--ground-lift); }

  .wv__lab {
    display: flex; justify-content: space-between; gap: 18px;
    padding-bottom: clamp(10px, 1.6vh, 16px); border-bottom: 1px solid var(--rule);
    font-size: var(--t-micro); letter-spacing: 0.16em; text-transform: uppercase; color: var(--dim);
  }
  .wv__n { color: var(--accent); font-variant-numeric: tabular-nums; }
  .wv__folio { font-variant-numeric: tabular-nums; }
  .wv__lab--over { position: absolute; z-index: 6; top: clamp(74px, 11vh, 120px); left: var(--margin); right: var(--margin); }

  .wv__stage {
    position: relative; width: 100%;
    /* A stage of fixed proportion rather than a box that grows with the type,
       so the card percentages compose the same picture at every width. */
    aspect-ratio: 16 / 5.2;
    display: grid; place-items: center;
  }
  .wv__stage--hero { aspect-ratio: 16 / 5.8; }
  .wv__w {
    grid-area: 1 / 1; width: 100%; margin: 0;
    font-family: var(--display); font-weight: 500;
    font-size: clamp(1.6rem, min(10vw, 13vh), 7.5rem);
    line-height: 0.86; letter-spacing: -0.055em;
    text-transform: uppercase; color: var(--bone);
  }
  .wv__w--hero { font-size: clamp(2.2rem, min(14vw, 18vh), 11rem); }
  .wv__seg { display: block; position: relative; }
  .wv__seg--a { z-index: 2; }
  .wv__seg--b { z-index: 4; text-align: right; }

  .wv__card {
    position: absolute; overflow: hidden;
    border-radius: 13%;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.66);
  }
  .wv__card :global(.st), .wv__card :global(.st__win) { border-radius: inherit; }
  .wv__card--0 { left: 28%; top: 1%;  width: 21%; aspect-ratio: 3 / 4; z-index: 3; }
  .wv__card--1 { left: 47%; top: 42%; width: 25%; aspect-ratio: 4 / 3; z-index: 3; }
  /* Small and low, clipping a corner of the first segment rather than a whole
     letter — measured on XIII, a bigger card here took 31% of the word on its
     own and the name read as broken instead of interrupted. */
  .wv__card--2 { left: 2%;  top: 50%; width: 11%; aspect-ratio: 1 / 1; z-index: 5; }

  @media (prefers-reduced-motion: no-preference) {
    .wv__card[data-reveal].is-in { animation: wv-in 1100ms var(--ease) both; animation-delay: calc(var(--i) * 70ms); }
  }
  @keyframes wv-in { from { opacity: 0; transform: scale(0.93) translateY(20px); } to { opacity: 1; transform: none; } }

  .wv__cap {
    margin: clamp(14px, 2.4vh, 34px) 0 0; max-width: 26ch;
    font-family: var(--display); font-weight: 500;
    font-size: clamp(1rem, min(3.4vw, 4.6vh), 2.5rem);
    line-height: 1.1; letter-spacing: var(--track-tight);
    text-transform: uppercase; color: var(--bone-dim);
  }
  .wv__cap .line { display: block; }
  .wv__edge {
    display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap;
    margin-top: clamp(22px, 4vh, 54px); padding-top: clamp(12px, 1.8vh, 18px);
    border-top: 1px solid var(--rule);
    font-size: var(--t-micro); letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim);
  }

  /* ── THE BODY, KEPT CLEAR ─────────────────────────────────────────
     One measure, left aligned, well under the stage. Nothing here is ever
     overlapped by anything. */
  .s__stmt { margin: clamp(26px, 4.6vh, 60px) 0 0; max-width: 22ch;
    font-family: var(--display); font-weight: 500;
    font-size: clamp(1.25rem, min(3.8vw, 5.2vh), 2.9rem);
    line-height: 1.14; letter-spacing: -0.028em; color: var(--bone); }
  .s__mark { display: block; margin-top: 0.2em; color: var(--bone-dim); font-style: italic; }
  .s__body { margin-top: clamp(24px, 4.4vh, 56px); columns: 2; column-gap: clamp(24px, 4vw, 60px); max-width: 66ch; }
  .s__p { break-inside: avoid; margin-bottom: var(--s-3); }
  .s__p p, .s__lede p { margin: 0; }
  .s__p .s__rn { display: block; margin-bottom: 3px; }
  .s__rn, .s__coln { color: var(--dim); font-size: var(--t-xs); font-variant-numeric: tabular-nums; }
  .s__lede { max-width: 54ch; margin-top: clamp(20px, 3.6vh, 44px); color: var(--bone-dim); }
  .s__cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(22px, 3.4vw, 52px); margin-top: clamp(28px, 5vh, 68px); }
  .s__col ul { list-style: none; margin: 0; padding: 0; }
  .s__col li { display: flex; gap: 10px; padding-block: 7px; border-bottom: 1px solid var(--rule-soft); font-size: var(--t-sm); color: var(--bone-dim); }
  .s__collab { color: var(--accent); font-size: var(--t-xs); margin: 0 0 var(--s-3); padding-bottom: 10px; border-bottom: 1px solid var(--rule); }
  .s__steps { list-style: none; margin: clamp(28px, 5vh, 68px) 0 0; padding: 0; display: grid; gap: clamp(28px, 5vh, 60px); max-width: 68ch; }
  .s__stepn { color: var(--accent); font-size: var(--t-xs); }
  .s__steptitle { margin: 6px 0 var(--s-3); font-family: var(--display); font-weight: 500; font-size: clamp(1.1rem, 2.2vw, 1.7rem); letter-spacing: -0.02em; color: var(--bone); }
  .s__steplines p { margin: 0 0 8px; color: var(--bone-dim); }
  .s__steplines .asks { color: var(--dim); }
  .s__step .draw { margin-bottom: clamp(14px, 2.4vh, 26px); }
  .s__links { list-style: none; margin: clamp(24px, 4vh, 52px) 0 0; padding: 0; display: grid; gap: 10px; max-width: 48ch; }
  .s__links li { display: flex; gap: 14px; padding-block: 9px; border-bottom: 1px solid var(--rule-soft); }
  .s__enq { margin-top: clamp(50px, 10vh, 120px); }
  .s__enq :global(.ct__page) { padding-top: 0; }
  .hot { color: var(--accent); text-transform: none; font-family: var(--serif); font-style: italic; font-weight: 300; font-size: 1.06em; }
  .ov__cue { color: var(--dim); }

  @media (max-width: 900px) {
    .wv__stage { aspect-ratio: 16 / 9; }
    .wv__w { font-size: clamp(1.5rem, 11vw, 3rem); }
    .wv__card--2 { display: none; }
    .s__body { columns: 1; }
    .s__cols { grid-template-columns: 1fr; }
  }
'''

DRIFT_CSS = BASE + r'''
  /* ══ XL · DRIFT ══════════════════════════════════════════════════
     THE WEAVE IS ALIVE. Every card travels at its own rate as its movement
     goes past — one climbing, one falling, one barely moving — so what is in
     front of the title at the top of a section is not what is in front of it
     at the bottom. The z-order never changes; the geometry does, and that is
     enough to make the same three pictures read as a different arrangement
     every second you are looking at them.

     THE RATES ARE COPRIME-ISH ON PURPOSE — -150, 92, -44 — because rates that
     divide into one another produce cards that move together and the whole
     thing reads as one sheet sliding. These three never repeat a formation
     within a section.

     NO SCRIPT. Each card reads the movement's own --x off the shared clock and
     multiplies it by its own rate; the section clips, so nothing that drifts
     out of frame can hang a scrollbar off the page. */
  .ov--dr, .mvt--dr { position: relative; }
  .ov--dr { justify-content: center; }
  .wv__card { transform: translateY(calc(var(--x, 0) * var(--rate, 0) * 1px)); will-change: transform; }
  .wv__card--0 { --rate: -150; }
  .wv__card--1 { --rate: 92; }
  .wv__card--2 { --rate: -44; }
  /* The entrance and the drift are the same property, so the entrance wins
     while it runs and hands over cleanly when it ends. */
  @media (prefers-reduced-motion: no-preference) {
    .wv__card[data-reveal].is-in { animation: none; }
  }
  .mvt--dr.sec--works .wv__card { transform: none; }
'''

FORME_CSS = BASE + r'''
  /* ══ XLI · FORME ═════════════════════════════════════════════════
     THE PAGE AS A PRINTER'S FORME. Nothing floats: the stage is a twelve by
     six grid and every card is LOCKED into named cells, as type and blocks are
     locked into a chase before printing. No percentages, no rotation, no
     drift. The weave survives — cards still sit between the two halves of the
     title in z — but it happens inside a rigid frame instead of on a loose
     one.

     WHY THIS IS THE HARDER VERSION. Scattered cards hide a multitude; a grid
     shows every misalignment you have. Everything here shares one set of
     tracks, so the eye can check the work — which is the point of setting it
     this way rather than the collage the same content would allow.

     THE COLOUR IS THE ONLY THING THAT MOVES. Cards arrive drained and come to
     full colour as their movement takes the window, off --f. In a layout this
     fixed, a single changing property reads louder than six moving ones. */
  .ov--fo, .mvt--fo { position: relative; }
  .ov--fo { justify-content: center; }

  .wv__stage {
    display: grid; place-items: stretch;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: repeat(6, minmax(0, 1fr));
    gap: clamp(8px, 1.2vw, 18px);
  }
  .wv__w { grid-area: 2 / 1 / 6 / 13; align-self: center; }
  .wv__card { position: relative; left: auto; top: auto; width: auto; aspect-ratio: auto; border-radius: clamp(10px, 1.4vw, 22px); }
  .wv__card--0 { grid-area: 1 / 4 / 5 / 7;  z-index: 3; }
  .wv__card--1 { grid-area: 3 / 8 / 7 / 12; z-index: 3; }
  .wv__card--2 { grid-area: 4 / 1 / 7 / 3;  z-index: 5; }
  .wv__card :global(.st), .wv__card :global(.st__win) { height: 100%; }
  .wv__card {
    filter: saturate(calc(0.12 + var(--f, 1) * 0.88)) brightness(calc(0.72 + var(--f, 1) * 0.28));
  }
  .mvt--fo.sec--works .wv__card { filter: none; }
  @media (max-width: 900px) {
    .wv__stage { grid-template-rows: repeat(5, minmax(0, 1fr)); }
    .wv__card--0 { grid-area: 1 / 6 / 4 / 10; }
    .wv__card--1 { grid-area: 3 / 2 / 6 / 7; }
  }
'''

TIDE_CSS = BASE + r'''
  /* ══ XLII · TIDE ═════════════════════════════════════════════════
     THE PICTURES COME IN FROM THE EDGES. Every card is parked off its own
     margin when its movement is away from the window and slides in to close
     around the title as the movement takes the frame — then withdraws the same
     way as it leaves. The type never moves an inch. The page breathes its own
     catalogue in and out, and the weave assembles itself in front of you
     rather than arriving already made.

     DRIVEN BY --f, COVERAGE, so the tide is in exactly while you are reading
     and out at both ends. Entry alone could not do it: entry never runs
     backwards, and the cards would come in and then simply stay.

     THE TRAVEL IS IN vw, NOT PIXELS, so a card is always parked past the edge
     of the window rather than a fixed distance that is off-screen on a laptop
     and sitting in the middle of a display. The section clips, so nothing
     parked outside can be scrolled to. */
  .ov--ti, .mvt--ti { position: relative; }
  .ov--ti { justify-content: center; overflow: clip; }
  .wv__card {
    transform: translateX(calc((1 - var(--f, 1)) * var(--side, 0) * 62vw));
    will-change: transform;
  }
  .wv__card--0 { --side: -1; }
  .wv__card--1 { --side: 1; }
  .wv__card--2 { --side: -1; }
  @media (prefers-reduced-motion: no-preference) {
    .wv__card[data-reveal].is-in { animation: none; }
  }
  .mvt--ti.sec--works .wv__card { transform: none; }
'''
