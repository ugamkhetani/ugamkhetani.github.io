/**
 * FRAME SCRUBBING
 *
 * Arriving on a frame cuts it from the first still to the second. From
 * there each increment of pointer travel advances one more, wrapping back
 * to the first and continuing for as long as the pointer keeps moving —
 * so the work reveals itself by exploring it, not by where you happen to
 * be standing. Stills crossfade on a soft landing curve while the window
 * drifts, so a change reads as one movement rather than a switch.
 *
 * No pointer (touch): a frame advances its own stills only while it is
 * the most-centred object in the viewport, and stops when it isn't.
 *
 * Reduced motion: neither. The first still, the title, and a working link.
 *
 * WHERE THIS RUNS, counted off the built pages rather than assumed: the home
 * page only. A work page has no [data-frame] at all — its stills are the cut
 * strip, which is plain images. The home page has 48: thirty bed tiles, all
 * single-frame, and the eighteen cards of Selected works.
 */

const AUTO_MS = 1600;
const MIN_CUT_MS = 60;

/** The second still is the one a visitor actually reads, so it earns a longer
 *  dwell than the ones that follow: the first cut away from it costs this
 *  multiple of the normal travel. Everything after runs at the normal step. */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* <- DO NOT EXPORT THIS TO SHARE IT WITH A DRAFT. Tried on 2026-11-27 so the
   mobile rail drafts could cut frames through the same function, on the
   assumption that a keyword changes nothing. It changes every page: a second
   importer makes Rollup split this module into its own chunk, which rewrites
   the hash of the script all 19 pages load. Measured — 19 of 19 HTML files
   differed and the main bundle was replaced. The draft carried a copy of
   this function instead, marked as one. */
function setIndex(frame: HTMLElement, index: number) {
  const layers = Array.from(frame.querySelectorAll<HTMLElement>('.frame__layer'));
  const i = Math.max(0, Math.min(index, layers.length - 1));
  const prev = Number(frame.dataset.index ?? 0);
  if (prev === i) return;
  frame.dataset.index = String(i);

  // Layers are cumulative: showing still 03 means 01, 02 and 03 are all
  // opaque, stacked. That keeps a forward cut clean, because the incoming
  // layer dissolves over a solid one. Wrapping back to 01 is the awkward
  // direction — it clears several layers at once, and if they all animate
  // together you look through a half-faded 03 onto a half-faded 02 and see
  // a third image flash by. So only the topmost changing layer animates;
  // everything beneath it switches instantly and is never seen mid-dissolve.
  const top = Math.max(prev, i);

  for (let n = 0; n < layers.length; n++) {
    const layer = layers[n];
    const shouldShow = n > 0 && n <= i;
    if (shouldShow === layer.classList.contains('is-cut')) continue;

    if (n === top) {
      layer.classList.toggle('is-cut', shouldShow);
    } else {
      layer.style.transition = 'none';
      layer.classList.toggle('is-cut', shouldShow);
      void layer.offsetHeight; // flush the change before easing is restored
      layer.style.transition = '';
    }
  }
}

/** The second still is the one a visitor actually reads, so it earns a longer
 *  dwell than the ones that follow: the first cut away from it costs this
 *  multiple of the normal travel. Everything after runs at the normal step.
 *  Coupled to the step on purpose — the dwell scales with cutting speed. */
const FIRST_HOLD = 2.0;

/** Pointer travel needed before the next cut, scaled to the frame so a
 *  small thumbnail doesn't feel frantic next to a full-bleed one. Kept
 *  short on purpose — the cut should feel like it's tracking the hand. */
function stepFor(frame: HTMLElement) {
  const w = frame.getBoundingClientRect().width || 600;
  return Math.min(160, Math.max(110, w * 0.126));
}

function initPointer(frame: HTMLElement, count: number) {
  let travel = 0;
  let step = stepFor(frame);
  let lastX = 0;
  let lastY = 0;
  let lastCut = 0;
  let inside = false;
  let held = false;

  const enter = (e: PointerEvent) => {
    step = stepFor(frame);
    travel = 0;
    lastX = e.clientX;
    lastY = e.clientY;
    lastCut = performance.now();
    inside = true;
    held = false;
    // Arriving is itself the first cut: 01 → 02.
    setIndex(frame, 1);
  };

  // Deliberately synchronous. The work is one hypot and, occasionally, a
  // class toggle on a handful of layers — cheap enough that deferring it to
  // an animation frame bought nothing and cost a frame of latency.
  const onMove = (e: PointerEvent) => {
    // pointerenter can be missed after a client-side navigation, so the
    // first move doubles as the arrival.
    if (!inside) {
      enter(e);
      return;
    }

    travel += Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;

    // Image 02 holds longer than everything after it.
    if (travel < (held ? step : step * FIRST_HOLD)) return;

    // Hold the accumulated travel rather than dropping it, so a fast flick
    // cuts at a steady cadence instead of strobing.
    const now = performance.now();
    if (now - lastCut < MIN_CUT_MS) return;

    travel = 0;
    lastCut = now;
    held = true;
    setIndex(frame, (Number(frame.dataset.index ?? 0) + 1) % count);
  };

  const onLeave = () => {
    inside = false;
    travel = 0;
    held = false;
    setIndex(frame, 0);
  };

  frame.addEventListener('pointerenter', enter);
  frame.addEventListener('pointermove', onMove, { passive: true });
  frame.addEventListener('pointerleave', onLeave);
  frame.addEventListener('pointercancel', onLeave);
}

function initKeyboard(frame: HTMLElement, count: number) {
  frame.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const cur = Number(frame.dataset.index ?? 0);
    setIndex(frame, e.key === 'ArrowRight' ? (cur + 1) % count : (cur - 1 + count) % count);
  });
  frame.addEventListener('blur', () => setIndex(frame, 0));
}

/**
 * Touch: the centred frame advances itself, and only that one.
 *
 * THE BAND ALONE WAS NOT ENOUGH AND THE RAIL IS WHY. Applied 2026-11-27 from
 * /preview/ab-rail2, chosen against three other readings of the same
 * question. Those four drafts were never committed and were deleted once
 * this was applied, so the name is provenance and not somewhere to look —
 * everything they established is in this comment. The observer below reports
 * whatever crosses the middle band of the screen, and the band is inset 42%
 * top and bottom and NOT AT ALL left or right — down a page that names one
 * thing, which is all this was written against. Below 900px Selected works
 * is a horizontal snap rail, two cards qualify at once, and the old code
 * took whichever entry came last.
 *
 * MEASURED ON THE LIVE SITE AT 375px BEFORE THE FIX: the driven card was one
 * to the RIGHT at every scroll position tried. At rest card 0 was fully
 * visible and sitting on its first still while card 1 — forty-five pixels of
 * a 293-pixel card, a sliver at the screen edge — was four stills deep. The
 * section read as static on a phone while still paying for the stills.
 *
 * SO THE BAND NOW CHOOSES CANDIDATES AND THE HORIZONTAL CENTRE DECIDES. One
 * extra rule, and it generalises: on a tablet, where the conveyor is still
 * the 3D stage and several cards cross the band, the nearest to the middle
 * is the one being looked at there too.
 *
 * AND IT RE-PICKS ON SCROLL, NOT ONLY ON INTERSECTION. A snap can finish
 * without anything crossing the band, and then the choice is stale — the
 * drafts showed exactly that: a drag ended with card 1 centred and the clock
 * still running on card 0. The listener is on `document` in the capture
 * phase because a scroll event does not bubble and the rail is an inner
 * scroller; it is rAF-throttled, and it does nothing at all unless more than
 * one frame is in the band, which is the only case that can be ambiguous.
 */
function initCentred(frames: HTMLElement[]) {
  let timer: number | undefined;
  let current: HTMLElement | null = null;
  /** Everything in the band right now, not just what last changed. */
  const live = new Set<HTMLElement>();

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const start = (frame: HTMLElement) => {
    stop();
    const count = Number(frame.dataset.count ?? 1);
    if (count < 2) return;
    timer = window.setInterval(() => {
      const next = (Number(frame.dataset.index ?? 0) + 1) % count;
      setIndex(frame, next);
    }, AUTO_MS);
  };

  /* The frame whose own centre is nearest the middle of the screen. A
     single-frame work can win this and should: landing on Mere Ho has to
     stop the last card rather than leave it cutting off-screen. start()
     declines to run a clock for it, which is the right nothing. */
  const choose = () => {
    const mid = window.innerWidth / 2;
    let best: HTMLElement | null = null;
    let bestD = Infinity;
    for (const frame of live) {
      const r = frame.getBoundingClientRect();
      if (!r.width) continue;
      const d = Math.abs((r.left + r.right) / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = frame;
      }
    }
    if (best === current) return;

    if (current) {
      current.classList.remove('is-active');
      setIndex(current, 0);
    }
    current = best;
    stop();
    if (current) {
      current.classList.add('is-active');
      start(current);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const frame = entry.target as HTMLElement;
        if (entry.isIntersecting) live.add(frame);
        else live.delete(frame);
      }
      choose();
    },
    // Reports whatever is crossing the middle band of the screen.
    { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
  );

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (live.size > 1) choose();
    });
  };

  frames.forEach((f) => observer.observe(f));
  document.addEventListener('scroll', onScroll, { capture: true, passive: true });

  return () => {
    observer.disconnect();
    stop();
    document.removeEventListener('scroll', onScroll, { capture: true });
  };
}

let teardown: (() => void) | undefined;

export function initFrames() {
  teardown?.();
  teardown = undefined;

  /* THE BED IS NOT A CANDIDATE AND NEVER WAS MEANT TO BE. Thirty of the
     home page's forty-eight frames are mosaic tiles inside an
     aria-hidden .ms__ground — decoration, one frame each, and fixed, so
     they sit in the middle band permanently. The old picker tolerated them
     by accident: they fire once at observe time and never again, and a
     single-frame tile starts no clock. The centred rule below would not
     tolerate them at all — a fixed tile is always nearest the middle of the
     screen, and it would win every time.

     A FRAME NOBODY IS MEANT TO READ IS NOT A FRAME TO DRIVE, which is the
     rule rather than naming .ms__ground here. It costs one closest() per
     frame at startup and nothing after.

     Desktop is untouched by this line: the only frames it removes are
     single-frame ones, and initPointer already declines those. */
  const frames = Array.from(document.querySelectorAll<HTMLElement>('[data-frame]')).filter(
    (f) => !f.closest('[aria-hidden="true"]')
  );
  if (!frames.length) return;

  if (reduced()) return;

  if (fine()) {
    for (const frame of frames) {
      const count = Number(frame.dataset.count ?? 1);
      if (count < 2) continue;
      initPointer(frame, count);
      initKeyboard(frame, count);
    }
  } else {
    teardown = initCentred(frames);
  }
}
