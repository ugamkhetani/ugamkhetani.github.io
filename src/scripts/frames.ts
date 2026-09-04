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
 */

const AUTO_MS = 1600;
const MIN_CUT_MS = 60;

/** The second still is the one a visitor actually reads, so it earns a longer
 *  dwell than the ones that follow: the first cut away from it costs this
 *  multiple of the normal travel. Everything after runs at the normal step. */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

/** Touch: the centred frame advances itself, and only that one. */
function initCentred(frames: HTMLElement[]) {
  let timer: number | undefined;
  let current: HTMLElement | null = null;

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

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const frame = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (current && current !== frame) {
            current.classList.remove('is-active');
            setIndex(current, 0);
          }
          current = frame;
          frame.classList.add('is-active');
          start(frame);
        } else if (current === frame) {
          frame.classList.remove('is-active');
          setIndex(frame, 0);
          current = null;
          stop();
        }
      }
    },
    // Fires only for whatever is crossing the middle band of the screen.
    { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
  );

  frames.forEach((f) => observer.observe(f));
  return () => {
    observer.disconnect();
    stop();
  };
}

let teardown: (() => void) | undefined;

export function initFrames() {
  teardown?.();
  teardown = undefined;

  const frames = Array.from(document.querySelectorAll<HTMLElement>('[data-frame]'));
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
