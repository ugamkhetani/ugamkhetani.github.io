import type Lenis from 'lenis';
import { initFrames } from './frames';
import { initCursor } from './cursor';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Smooth scroll ──────────────────────────────────────────────────
   Loaded on its own, after everything else. Smooth scrolling is a
   nicety; if it fails to load it must not take the page down with it. */
let lenis: Lenis | undefined;

async function initScroll() {
  if (reduced() || lenis) return;
  try {
    const { default: LenisCtor } = await import('lenis');
    lenis = new LenisCtor({ duration: 1.1, smoothWheel: true });
    const raf = (time: number) => {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  } catch {
    /* Native scrolling is a perfectly good fallback. */
  }
}

/* ── Scroll reveal ──────────────────────────────────────────────── */
let revealObserver: IntersectionObserver | undefined;

function initReveal() {
  revealObserver?.disconnect();
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  if (reduced()) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  );
  targets.forEach((el) => revealObserver!.observe(el));
}

/* THE OPENING'S CONTROL STANDS DOWN WHILE THE WORK IS PLAYING.

   A facade already does this on its own: pressing it adds `is-playing` and
   its CSS hides the control with the poster. This covers the other two ways a
   work page can play something — a film's own <video> once the .mp4 lands, and
   a song's <audio> — so the rule is true of every control rather than true by
   accident of which one you happen to press.

   THE SCOPE IS THE CONTROL'S OWN FRAME, NOT THE PAGE. A film in a grid marks
   only its own cell, so playing episode one does not blank the marks on
   episodes two to six; anything else marks the block, which is what puts a
   song's audio and the sleeve's "Listen on Spotify" together. Getting this
   wrong in the other direction is the obvious bug and it is why the closest()
   list is ordered. */
function mediaFrame(el: Element): HTMLElement | null {
  return el.closest<HTMLElement>('.film') ?? el.closest<HTMLElement>('.blk');
}

/* WHO STANDS DOWN, DERIVED FROM THE DOM EVERY TIME RATHER THAN TRACKED.

   A control is down if it is inside the frame of whatever just started, or
   inside a facade that is currently mounted. Both are read off the document,
   so there is no state to get out of step and calling this twice is the same
   as calling it once.

   <- IT USED TO BE A CSS RULE IN VideoFacade REACHING `.wm`, WHICH IS
     WatchMark'S ELEMENT, and that coupling is what made the failure
     invisible: when the facade's button became WatchMark the old selector
     `.facade.is-playing .facade__play` stopped matching anything and nothing
     anywhere errored. The rule that hides the control now lives in the
     component that owns it, keyed on a class this function sets, so the two
     cannot drift apart again. */
function syncStandDown(playing?: Element | null) {
  const frame = playing ? mediaFrame(playing) : null;
  document.querySelectorAll<HTMLElement>('.wm').forEach((wm) => {
    const inPlayingFrame = !!frame && frame.contains(wm);
    const inLiveFacade = !!wm.closest('[data-facade].is-playing');
    wm.classList.toggle('is-stood-down', inPlayingFrame || inLiveFacade);
  });
}

/* ── One piece of media at a time. Enforced globally. ───────────── */
function initMediaBus() {
  if ((window as any).__mediaBus) return;
  (window as any).__mediaBus = true;

  document.addEventListener(
    'play',
    (e) => {
      const playing = e.target as HTMLMediaElement;
      document.querySelectorAll<HTMLMediaElement>('video, audio').forEach((el) => {
        if (el !== playing && !el.paused) el.pause();
      });
      // A YouTube facade that has mounted its iframe counts as playing media.
      document.querySelectorAll<HTMLElement>('[data-facade].is-playing').forEach((el) => {
        if (!el.contains(playing)) closeFacade(el);
      });
      /* Whatever just started owns its frame; every other frame releases. */
      syncStandDown(playing);
    },
    true // capture: media events don't bubble
  );

  /* Both, because `ended` does not fire a `pause` in every engine and a
     scrubbed-to-the-end element can sit paused without ever ending. */
  (['pause', 'ended'] as const).forEach((type) =>
    document.addEventListener(type, () => syncStandDown(null), true)
  );
}

function closeFacade(facade: HTMLElement) {
  facade.classList.remove('is-playing');
  facade.querySelector('iframe')?.remove();
  syncStandDown(null);
}

/* ── YouTube facade: nothing third-party loads until you press play ── */
function initFacades() {
  document.querySelectorAll<HTMLElement>('[data-facade]').forEach((facade) => {
    if (facade.dataset.bound) return;
    facade.dataset.bound = '1';

    facade.addEventListener('click', () => {
      if (facade.classList.contains('is-playing')) return;

      // Stop anything else first — one piece of media at a time.
      document.querySelectorAll<HTMLMediaElement>('video, audio').forEach((el) => el.pause());
      document
        .querySelectorAll<HTMLElement>('[data-facade].is-playing')
        .forEach((other) => other !== facade && closeFacade(other));

      const yt = facade.dataset.youtube;
      const vm = facade.dataset.vimeo;
      const ig = facade.dataset.instagram;
      if (!yt && !vm && !ig) return;

      const iframe = document.createElement('iframe');
      if (yt) {
        iframe.src =
          `https://www.youtube-nocookie.com/embed/${yt}` +
          `?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`;
      } else if (vm) {
        /* Vimeo ids arrive as "<id>/<hash>" for an unlisted film; the hash is
           what makes an unlisted one playable and goes in h=. dnt=1 is the
           same choice as youtube-nocookie above — no tracking cookie unless
           the visitor actually presses play, and none from Vimeo even then. */
        const [vid, hash] = String(vm).split('/');
        iframe.src =
          `https://player.vimeo.com/video/${vid}` +
          `?autoplay=1&title=0&byline=0&portrait=0&dnt=1` +
          (hash ? `&h=${hash}` : '');
      } else {
        /* Instagram has no autoplay parameter and no way to ask for one: the
           embed mounts paused and the visitor presses Instagram's own control.
           That is the platform's constraint, not a choice — and it is still
           better than sending them away from the page. */
        iframe.src = `https://www.instagram.com/p/${ig}/embed/`;
        iframe.scrolling = 'no';
      }
      iframe.title = facade.dataset.title ?? 'Video player';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';

      facade.querySelector('.facade__stage')?.append(iframe);
      facade.classList.add('is-playing');
      syncStandDown(null);
    });
  });
}

/* ── Running head retreats on the way down ──────────────────────── */
function initRunHead() {
  const head = document.querySelector<HTMLElement>('.runhead');
  if (!head || head.dataset.bound) return;
  head.dataset.bound = '1';

  let last = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const down = y > last;
    last = y;
    // Never hide near the top.
    head.classList.toggle('is-hidden', down && y > 220);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

/* ── (Works) is the homepage ────────────────────────────────────── */
function initHome() {
  document.querySelectorAll<HTMLElement>('.runhead [data-home]').forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = '1';
    el.addEventListener('click', (e) => {
      if (location.pathname === '/') {
        e.preventDefault();
        lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
  markCurrent();
}

/* ── Which of the four you are looking at ─────────────────────────
   `is-current` marks the label; RunHead.astro dims the other three. */
function markCurrent() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.runhead .itm'));
  const path = location.pathname.replace(/\/+$/, '') || '/';
  // An item whose own path we are standing on wins. Otherwise (Works) holds
  // the homepage and every work page beneath it.
  const here = items.find((el) => el.dataset.path && el.dataset.path !== '/' && el.dataset.path === path);
  items.forEach((el) => {
    el.classList.toggle('is-current', here ? el === here : el.hasAttribute('data-home'));
  });
}

/* ── Boot ─────────────────────────────────────────────────────────
   Every initialiser is isolated. None of them can hide content — the
   reveal is additive now — but one throwing must not stop the rest
   from binding. */
function boot() {
  for (const init of [initReveal, initFrames, initCursor, initMediaBus, initFacades, initRunHead, initHome]) {
    try {
      init();
    } catch (err) {
      console.error(`[${init.name}] failed`, err);
    }
  }

  // Async, last, and self-contained — smooth scroll is the least important
  // thing on the page and must load like it.
  void initScroll();
}

document.addEventListener('astro:page-load', boot);
