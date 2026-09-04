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
    },
    true // capture: media events don't bubble
  );
}

function closeFacade(facade: HTMLElement) {
  facade.classList.remove('is-playing');
  facade.querySelector('iframe')?.remove();
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
    // Never hide near the top, and never hide while an overlay is open.
    const overlayOpen = !!document.querySelector('[data-overlay]:not([hidden])');
    head.classList.toggle('is-hidden', down && y > 220 && !overlayOpen);
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
      // From any view it dismisses first, so you are never left with an
      // overlay open behind the homepage.
      const open = document.querySelector<HTMLElement>('[data-overlay]:not([hidden])');
      if (open) open.dispatchEvent(new CustomEvent('overlay:close'));
      if (location.pathname === '/') {
        e.preventDefault();
        lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
  markCurrent(null);
}

/* ── Which of the four you are looking at ─────────────────────────
   `is-current` marks the label; RunHead.astro dims the other three. */
function markCurrent(id: string | null) {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.runhead .itm'));
  const path = location.pathname.replace(/\/+$/, '') || '/';
  // An item whose own path we are standing on wins. Otherwise (Works) holds
  // the homepage and every work page beneath it.
  const here = items.find((el) => el.dataset.path && el.dataset.path !== '/' && el.dataset.path === path);
  items.forEach((el) => {
    const mine = id ? el.dataset.overlayOpen === id : here ? el === here : el.hasAttribute('data-home');
    el.classList.toggle('is-current', mine);
  });
}

/* ── Overlays: Contents, About, Contact ─────────────────────────── */
function initOverlays() {
  document.querySelectorAll<HTMLElement>('[data-overlay]').forEach((overlay) => {
    if (overlay.dataset.bound) return;
    overlay.dataset.bound = '1';

    const closer = overlay.querySelector<HTMLElement>('[data-overlay-close]');
    let lastFocused: HTMLElement | null = null;

    const open = () => {
      // Only one overlay at a time.
      document.querySelectorAll<HTMLElement>('[data-overlay]').forEach((other) => {
        if (other !== overlay && !other.hidden) other.dispatchEvent(new CustomEvent('overlay:close'));
      });
      lastFocused = document.activeElement as HTMLElement;
      markCurrent(overlay.id);
      overlay.hidden = false;
      // Next frame, so the transition has a starting state to animate from.
      requestAnimationFrame(() => overlay.classList.add('is-open'));
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
      // Focus must land inside the dialog: the Escape handler below is bound
      // to the overlay, so if focus stays outside it Escape never reaches it.
      (closer ?? overlay).focus();
    };

    const close = () => {
      if (overlay.hidden) return;
      markCurrent(null);
      overlay.classList.remove('is-open');
      document.documentElement.style.overflow = '';
      lenis?.start();
      // transitionend is the happy path, but a throttled or backgrounded tab
      // may never fire it — and a closed overlay that never gets `hidden`
      // stays a full-screen invisible click trap. The timer guarantees it.
      let timer = 0;
      const done = () => {
        overlay.hidden = true;
        overlay.removeEventListener('transitionend', done);
        clearTimeout(timer);
      };
      if (reduced()) done();
      else {
        overlay.addEventListener('transitionend', done);
        timer = window.setTimeout(done, 400);
      }
      lastFocused?.focus();
    };

    overlay.addEventListener('overlay:close', close);
    closer?.addEventListener('click', close);

    document
      .querySelectorAll<HTMLElement>(`[data-overlay-open="${overlay.id}"]`)
      .forEach((el) => el.addEventListener('click', open));

    // Navigating to a work from the Index should not leave the overlay up.
    overlay.querySelectorAll('a[href^="/"]').forEach((link) =>
      link.addEventListener('click', () => {
        overlay.classList.remove('is-open');
        overlay.hidden = true;
        document.documentElement.style.overflow = '';
        lenis?.start();
      })
    );

    overlay.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      // Trap focus inside the overlay while it's open.
      const focusable = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      // About and Contact hold no links at all. Returning here would let Tab
      // walk straight out of an aria-modal dialog and onto the page behind.
      if (!focusable.length) {
        e.preventDefault();
        overlay.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });
}

/* ── Boot ─────────────────────────────────────────────────────────
   Every initialiser is isolated. None of them can hide content — the
   reveal is additive now — but one throwing must not stop the rest
   from binding. */
function boot() {
  // Whatever happened on the previous page, this one starts scrollable.
  // An overlay left open through a browser-back, a handler that threw
  // mid-close — neither should be able to strand the site unscrollable.
  document.documentElement.style.overflow = '';
  lenis?.start();

  for (const init of [initReveal, initFrames, initCursor, initMediaBus, initFacades, initOverlays, initRunHead, initHome]) {
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
