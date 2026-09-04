/**
 * POINTER TRAIL
 *
 * A tapered tail that follows the pointer with a little lag, thinning and
 * fading behind it. 2D canvas rather than WebGL: the effect is a few dozen
 * short strokes a frame, which needs no shader pipeline and no dependency.
 *
 * Deliberately quiet: thin, accent-coloured, short-lived. It should read as
 * the pointer having weight, not as a graphic in its own right — the work
 * is the thing being looked at.
 *
 * Which is why the frames are punched out of the canvas as holes before
 * anything is drawn. Not faded over: genuinely clipped, so the frame
 * occludes the tail the way an object in front of it would. Entering,
 * leaving or crossing a frame, no part of the trail can ever land on an
 * image — including the length still trailing behind the pointer.
 *
 * The chips on the contact page work the same way, and are punched to their
 * real rounded shape rather than to a bounding box, so the tail passes
 * cleanly behind the curve instead of vanishing into a square hole.
 *
 * Never runs for reduced-motion or touch, never hides the real cursor, and
 * sleeps whenever the tail has collapsed so an idle tab costs nothing.
 */

const LEN = 48;        // points retained in the tail
const EASE = 0.32;     // how quickly the head chases the pointer — higher is tighter
const WIDTH = 2.8;     // head thickness, px
const ALPHA = 0.58;    // head opacity — orange sits darker than bone, so it needs more
const FALLOFF = 1.4;   // fade curve along the tail; higher concentrates opacity at the head
const IDLE_MS = 140;   // stillness before the tail is allowed to collapse
const HUE = '232, 93, 44'; // --accent

interface Pt { x: number; y: number }

let bound = false;

export function initCursor() {
  if (bound) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const canvas = document.querySelector<HTMLCanvasElement>('[data-cursor]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  bound = true;

  let w = 0;
  let h = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Anything the tail must pass behind. For a frame that is the image box
     and not the whole link, so the tail may still cross the number and title
     beneath it — only never the picture. For a chip it is the chip itself.
     The corner radius is read once here rather than every frame, because
     reading computed style per element per frame would force a style
     recalculation sixty times a second.

     .st__win IS THE ONE THAT MATTERS NOW. This read `.frame__window` only,
     which is Frame.astro's class — and when the one-page design became the
     site, its works are drawn by Still.astro, whose window is `.st__win`.
     The selector silently stopped matching anything, so the tail ran straight
     across every image instead of behind it. Frame's class is kept beside it
     so the punch still works wherever that component is used.

     AND IT HAS TO BE SCOPED TO .sec--works. Still also draws the mosaic bed —
     thirty fixed tiles covering the whole viewport — so an unscoped .st__win
     would punch a hole the size of the screen and the tail would never be
     painted anywhere at all. */
  const OCCLUDES = '.sec--works .st__win, .sec--works .frame__window, .pill, .opt > span';
  interface Occluder { el: HTMLElement; r: number }
  let occluders: Occluder[] = [];
  const collect = () => {
    occluders = Array.from(document.querySelectorAll<HTMLElement>(OCCLUDES)).map((el) => ({
      el,
      r: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
    }));
  };
  collect();

  /* ── WHERE THE TAIL IS ALLOWED TO EXIST ────────────────────────────
     The trail belongs to the works and nowhere else: it reads as the pointer
     having weight while you are moving through the catalogue, and as a
     graphic in its own right anywhere else on the page. Outside the works
     section nothing is drawn, and a page with no works section never draws
     it at all.

     A rect test per move rather than pointerenter/pointerleave on the
     section, because the section is a pinned 3D scene whose children capture
     their own pointer events — enter/leave fire constantly as the pointer
     crosses cards inside it, and the tail would strobe. One rect against the
     section's own box is both cheaper and stable. */
  const ZONE = '.sec--works';
  let zones: HTMLElement[] = [];
  const collectZones = () => {
    zones = Array.from(document.querySelectorAll<HTMLElement>(ZONE));
  };
  collectZones();
  const inZone = (x: number, y: number) =>
    zones.some((z) => {
      const r = z.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });

  document.addEventListener('astro:page-load', () => { collect(); collectZones(); });

  const canRound = typeof ctx.roundRect === 'function';

  const target: Pt = { x: -100, y: -100 };
  const head: Pt = { x: -100, y: -100 };
  const pts: Pt[] = [];
  let raf = 0;
  let lastMove = 0;
  let seen = false;

  const frame = () => {
    head.x += (target.x - head.x) * EASE;
    head.y += (target.y - head.y) * EASE;

    pts.push({ x: head.x, y: head.y });
    while (pts.length > LEN) pts.shift();

    ctx.clearRect(0, 0, w, h);
    ctx.save();

    // Punch every on-screen occluder out of the drawable area. Even-odd
    // turns the inner shapes into holes in the outer one, so a stroke
    // crossing one is simply not painted there — no fade, no timing to get
    // wrong. Even-odd is direction-independent, so mixing rects and rounded
    // rects in one path is safe.
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    for (const o of occluders) {
      const r = o.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) continue;
      // A pill declares 999px; what it actually draws is half its height.
      const rad = Math.min(o.r, r.width / 2, r.height / 2);
      if (rad > 0.5 && canRound) ctx.roundRect(r.left, r.top, r.width, r.height, rad);
      else ctx.rect(r.left, r.top, r.width, r.height);
    }
    ctx.clip('evenodd');

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Oldest → newest, thinning and fading toward the tail. Each span is a
    // quadratic through the point itself, anchored on the midpoints either
    // side — straight segments leave visible facets on a fast flick.
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const t = i / pts.length;

      ctx.beginPath();
      ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
      ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      ctx.lineWidth = WIDTH * t;
      ctx.strokeStyle = `rgba(${HUE}, ${ALPHA * Math.pow(t, FALLOFF)})`;
      ctx.stroke();
    }

    ctx.restore();

    // Sleep once there is nothing left to draw: either the pointer settled
    // and the tail caught up, or it has faded out over a frame.
    const settled =
      performance.now() - lastMove > IDLE_MS &&
      Math.hypot(target.x - head.x, target.y - head.y) < 0.4;

    if (settled) {
      ctx.clearRect(0, 0, w, h);
      pts.length = 0;
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  let inside = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;

      /* Leaving the works takes the whole tail with it, immediately — not a
         fade. The tail is a property of that section, so it should not be
         seen finishing its collapse somewhere the section is not. */
      if (!inZone(e.clientX, e.clientY)) {
        if (inside) {
          inside = false;
          pts.length = 0;
          ctx.clearRect(0, 0, w, h);
        }
        return;
      }

      /* Re-entering starts the tail where the pointer is. Without this the
         head is still parked wherever it was when the pointer left, and the
         first frame back draws one long stroke across the section to catch
         up with it. */
      if (!inside) {
        inside = true;
        head.x = e.clientX;
        head.y = e.clientY;
        pts.length = 0;
      }

      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();

      if (!seen) {
        head.x = target.x;
        head.y = target.y;
        seen = true;
      }
      if (!raf) raf = requestAnimationFrame(frame);
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', () => {
    inside = false;
    pts.length = 0;
    ctx.clearRect(0, 0, w, h);
  });
}
