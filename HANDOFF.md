# Handoff — Ugam Khetani portfolio

A static Astro site. Sixteen works, twenty pages. Every project is one
markdown file; every image is a file in a folder. No CMS, no database.

This file is the briefing for whoever picks the work up next — including a
fresh chat with no memory of how any of it got here. Read §1, then §5 and §6
before changing anything.

---

## 1 · How to resume in a new chat

Paste this:

> I'm continuing work on my portfolio site at
> `~/Desktop/Website Design/Website Draft 3`. It's static Astro, and it IS a git
> repo now — one commit, working tree clean — so check `git status` before you
> start and commit as you go. Read HANDOFF.md and README.md first, then tell me
> what you understand the state to be before changing anything.
>
> How I work: don't invent facts — names, credits, years and awards come from
> my documents, and anything assumed gets flagged with a `←` comment. Build
> design options as real pages under `src/pages/preview/` and wait for my
> approval before applying anything to the live site or deleting any draft.
> Verify rather than assert: if you tell me something works, show me the
> numbers you read to know it, measured in the settled state. Run the dev
> server on **port 4323** — 4321 belongs to another project. And read
> HANDOFF.md §6 before debugging anything; those traps are all real and most of
> them cost hours.
>
> Where we left off: the mosaic bed, the loading screen and the work pages are
> all live and settled. Work pages were just narrowed onto a single 760px
> measure and had their big ghosted section numerals removed. Awaiting my
> decision, with nothing applied: mosaic drafts A–I and L, recognition drafts B
> and C, and four alternate loaders. Two open questions you should raise if I
> don't — the countdown numeral over Taskaree softens to 1.6:1 against the
> brightest patches under it (dropping `brightness` in `Opening.astro` from 0.8
> to ~0.65 fixes it), and Bloody Bubbly holds the clearest cell on the mosaic
> but reads close to black at 3.7 against a ground of 10, which no frame of it
> can fix.

Then say what you want. The two files together are enough to work from.

**Two things to know about how this was built.** Decisions were made against
the uploaded PDFs as the source of truth — names, roles, credits, years,
platforms, awards. Nothing was invented; where something had to be assumed it
was flagged in the file with a `←` comment. Keep that habit. And previews were
built as pages under `src/pages/preview/` so options could be judged in the
real browser rather than described. **That folder is now KEPT, not thrown
away** — it is a library of design directions to compare against and come back
to. Do not delete any of it without asking Ugam first; the instruction has
always come as "discard X, keep the rest".

---

## 2 · Running it

```bash
npm install
npm run dev -- --port 4323
```

Then <http://localhost:4323>. Port 4323 is deliberate — 4321 belongs to
another project of Ugam's that is often running.

```bash
npm run build && npm run preview
```

A failing build names the file and line. That is deliberate: a broken build is
safer than a broken page.

---

## 3 · What this is

A premium, minimal, editorial, cinematic portfolio — "the digital evolution of
my decks, not a generic portfolio template."

The landing page is **a curated visual index**, nothing else. No bio, no
services, no CTA, no card grid. Image → interaction → project.

It is now **one page** rather than a door into others: the opening, the works,
the about material and the enquiry are all movements of it, seen through a
fixed aperture with the catalogue running as a mosaic bed behind the type. The
aperture and the bed are the two ideas that hold it together — the bed wants
something to frame it, the frame wants something inside it.

---

## 4 · Architecture — where things live

| File | Does |
| --- | --- |
| `src/data/composition.ts` | **The homepage, written as a score.** Column, span, offset, pause. Scroll order *and* catalogue numbering derive from it. |
| `src/data/contact.ts` | Every question, field, address and link on `/contact`. |
| `src/data/about.ts` | Every word on `/about`. |
| `src/content/works/*.md` | One file per project. Frontmatter validated by `src/content.config.ts`. |
| `src/pages/contents.astro` | **The catalogue read as names** — the roll, its cards and its reading line. |
| `src/components/ContactForm.astro` | The whole enquiry page: questions, pills, send, footer. |
| `src/components/Frame.astro` | A homepage thumbnail — stacked stills, crossfade, metadata. |
| `src/components/RunHead.astro` | The four bracketed nav labels. **Hidden on `/` and on work pages** — both hide it and mount `OpNav` instead. |
| `src/components/OpNav.astro` | The site menu: Ugam Khetani · Works · About · Contact. Takes `base` — empty on the one-page home, `"/"` on work pages so its anchors resolve. |
| `src/components/Opening.astro` | The loading screen: the Academy countdown, 3 · 2 · 1. |
| `src/lib/bed.ts` | **The mosaic bed's cast and frame crops.** Imported by `index.astro` and by the mosaic drafts, so the two cannot drift. |
| `src/lib/awards.ts` | Parses the `awards:` field into citation + awarding body. |
| `src/lib/_pv-mosaic.ts` | Preview-only: the measured cell map, rankings and draft placements. Nothing on the real site imports it. |
| `src/components/Overlay.astro` | The overlay shell. Only Contents uses it now. |
| `src/scripts/main.ts` | Boot: reveal, frames, cursor, media bus, facades, overlays, header, home. |
| `src/scripts/frames.ts` | Pointer scrubbing on the homepage thumbnails. |
| `src/scripts/cursor.ts` | The pointer trail, and what it is clipped by. |
| `src/styles/tokens.css` | Every colour, size, duration. Nothing outside it invents one. |

**Pages:** `/` · `/contents` · `/about` · `/contact` · `/work/<slug>` ×16,
plus 66 under `/preview/`. **86 pages build.**

**Overlays:** none. All three outgrew them — Contents was the last, and
`Overlay.astro` plus the `overlay` branch in `RunHead.astro` are now unused.

**The home page is one page.** It carries the opening, the menu, the mosaic
bed, the aperture mat and every movement — `#top`, `#works`, `#about`,
`#contact` are sections of it. `/about` and `/contact` still exist as separate
pages and are still reachable; whether they should remain is an open question,
listed in §7.

---

## 5 · Decisions that should not be quietly undone

**The scroll reveal is additive and never hides anything.** It animates
`translateY` only, and the from-state lives *inside the keyframe*, applied by
`.is-in`. Written the other way — a base `opacity: 0` or a base `translateY`
inside `overflow: hidden` — a stalled observer, a background tab or a script
that never ran leaves the page blank. **This has now bitten three times.** The
third was on `/about`, where a masked line reveal had a pre-hidden base state.
Test it by loading with the observer prevented from firing: every word must
still be readable.

**/about is a ruled page, and the rules are the design.** Each movement
draws the site's own twelve column boundaries as hairlines down its full
height. They are decoration — `aria-hidden`, `pointer-events: none`, and
rendered only above 901px, where `--cols` is still twelve; below that they
would describe a grid the page is not using. The hairline nearest the pointer
lifts to **white, deliberately not to the accent**: the accent is this page's
marker for information — movement numbers, the seat under a statement, the
caption tick — and a line that follows your cursor is light, not meaning.

**Movement 01's prose is a stair, and it lands on the rules.** Each of the
five paragraphs begins one column further right than the last. That is not a
decorative indent: the well spans section columns 4–12, so paragraph *i*
starts on section column 4+*i*, which is exactly where a ledger hairline is
drawn. Measured at 1440: 409, 516, 624, 732, 839, every one a rule position,
off by zero. It is the thing that makes the ledger structural rather than
drawn over the top, so if the grid maths ever changes, re-measure rather than
eyeballing it. The measure is held at 44ch and only the start moves.

**The ledger is ONE system, not one per section.** Column *i* has the same x
in every ledger on the page, so it is not seven hairlines — it is a single
line running the height of the document, drawn in pieces. The pointer
response is therefore bound **once, on the page**, and drives every ledger
together. Bound per section, each ran its own loop and crossing a seam fired
one `pointerleave` while the next fired `pointermove`, so the light died and
was reborn at every boundary. If this is ever refactored, keep it global.

**The tone band carries NO ledger, deliberately.** It is the one place in
the site where the ground changes, and it is left clean so the change of
tone is the only thing happening there. The cost is known and accepted: the
ledger runs the height of the document everywhere else, and this is the one
interval where it stops — a 676px break, the band plus its two 46px margins.
The pointer's lit segment fades out entering the band and returns below it,
and the vertical coordinate system stays continuous across the gap, so it
resumes in the right place.

It did carry one for a while, inset `0 var(--margin)` and pulled out
vertically by `calc(clamp(24px, 5vh, 64px) * -1)`. That is the recipe if the
break ever reads as a fault rather than as a rest.

**Reading light floors at `--bone-dim`, never lower.** /about's prose
brightens word by word as you scroll. The unlit state is the site's own
body-copy colour at 14:1, so the page is completely readable with no script
running at all. Anything that dims text below that floor reintroduces exactly
the failure §5 opens with.

**Movement 02's questions are split on the copy's own punctuation.**
`clauses()` in `about.astro` breaks a line after a question mark and `asks()`
tests whether a fragment ends in one; a question takes the serif, everything
else stays in the sans. Three questions were packed into a single string and
read as one long sentence. Nothing is added, removed or reordered — a line
without a question mark comes back whole — so the passage still reads
identically aloud. Verified by rebuilding every step from its rendered
clauses and comparing to the source string.

**Movement 02 reads at the same size as movement 01.** It was set at 16px
against 01's 19px for the same kind of writing, which is a hierarchy saying
something nobody meant. If the type scale moves, move both.

**Two voices, split on punctuation the copy already has.** Sans states a
fact, Fraunces italic turns it over, and where one sentence does both it
changes face at its own comma. `cut()` in `about.astro` splits on the comma
and falls back to a single voice if there isn't one — it never invents a
break. `about.ts` is untouched by any of it; the words are re-set, not
rewritten.

**Contents is the roll, and it is a page.** The catalogue read as an
end-credit crawl: the work set at title scale, grouped into cards by
category, read by scrolling. It was chosen from four thematic directions
built as real pages and judged in the browser — Score (eight staves, a work's
ratio as its pitch), Desk (sixteen channel strips, the fader carrying its
place in the running order), Transport (one continuous waveform, scrubbed)
and Roll. The other three are gone with `src/pages/preview/`; the ideas are
recorded here in case any of them is wanted later.

**The reading line is /about's reading light at title scale.** A hairline
fixed across the viewport at 46vh; whatever title crosses it is lit and the
readout takes its catalogue number and category. Proximity drives colour and
0.022 of scale, nothing else. **The floor is `--bone-dim` and never lower** —
brightness is added, never subtracted, and no title is ever dimmed with
opacity, which is exactly the failure §5 opens with. Verified with the scroll
handler prevented from running: all sixteen titles, numbers, roles, years and
ratios stay legible and the page is a plain, complete index. Measured at
1440x900: the title on the line reads `--near` 0.999 and true white, its
neighbour 0.369 and `rgb(230,230,230)`, everything else the `--bone-dim`
floor at `rgb(216,216,216)`.

**Contents stopped being an overlay.** It was the last one in the site and
outgrew it the way About and Contact did: at title scale over sixteen works
it wants the height of a document and a URL that can be sent to someone.
`RunHead.astro`'s Contents item is now an ordinary link, so `markCurrent()`
marks it from `data-path` with no special case. `Base.astro` lost the overlay
markup and the `grouped`/`ordered` data that existed only to feed it, along
with four imports. **`Overlay.astro` is now dead code** — kept, not deleted,
because it is the only thing that would have to be rewritten to put a view
back in an overlay. `initOverlays()` in `main.ts` simply finds nothing.

**Catalogue numbers are derived, never stored.** `numberFor()` reads position
in `composition.ts`. Reordering renumbers the index, every project eyebrow and
the next-work chain in one move. Don't reintroduce a `number:` field.

**The Contents overlay has its own order.** `indexOrder` in `composition.ts`
sorts first within category; everything else falls back to homepage order.

**Aspect ratio is metadata, not styling.** Each frame is cropped to the format
the work was genuinely made in. That is the idea the homepage rests on.

**The header is `mix-blend-mode: difference`.** It measures distance from the
backdrop, so **hue and tone are both unreliable** there. Measured: the accent
turns cyan over a bright still; reduced opacity *inverts* over bright ground.
Eleven of sixteen works put a mid-to-bright band under the header at some
scroll position. Any header marker must be structure or motion, not colour.

**The current view is marked by dimming the other three labels.** Known
trade-off, accepted: over a bright still the dimmed labels read *stronger*
than the current one. Hovering isolates whatever you point at — that label
holds full strength and every other steps back, the current one included.

**Whites are true white; the ground stays warm.** `--bone #FFFFFF` with
neutral greys. The ground is deliberately `#0A0908`, a +2 red cast, which is
what stops the page reading as flat digital black. A neutral darker ground
(`#050505`) was tried and reverted; the values are recorded in `tokens.css`.

**Contact composes a mailto; there is no backend.** The answers write the
email and the visitor's mail app sends it. Nothing is stored. The disabled
send action is **not** `pointer-events: none` — it stays reachable, is
`aria-disabled`, and swallows its own click, because a control that cannot be
pointed at cannot explain itself.

**One piece of media at a time,** site-wide. Starting anything stops
everything else.

**The send action wakes letter by letter.** When the enquiry becomes sendable
the seventeen letters of "Send this enquiry" each lift from `--dim` to the
action's own white in turn, 520ms apiece on a 26ms stagger, so the wave
crosses the words in 416ms. It was chosen over four alternatives (a step
forward, the words rising from a masked edge, the arrow redrawing, the arrow
travelling) because it is the only one that reads as the action coming alive
without moving anything — and because `.send__ink` already runs exactly this
wave through the refusal note on hover, so a refusal and an opening are
spoken in the same voice at two different scales.

**The wave is gated on the line's arrival, not on the form becoming valid.**
`is-ready` carries the functional state (cursor, hover, aria) the instant the
enquiry is valid; a second class, `is-woken`, carries only the gesture, and a
bounded rAF watcher adds it when the orange line's leading edge reaches the
words. The watcher compares the fill's rect to the label's rect **in the same
frame**, so scroll position cancels out and there is no stored offset to go
stale — and it reads the rendered line rather than predicting it from the
duration and easing, so retiming the fill in CSS cannot put the two out of
step. It stops on arrival, and on a 1400ms bound if the light settles above
the words. Below 901px there is no line, so the letters wake immediately
rather than never.

**Becoming sendable carries the light to the words.** The line moves in
fifths, but the enquiry becomes sendable at two of them — name and email —
while the words sit at 0.816 of the track. Those two numbers were never going
to meet: measured at 1440 before the fix, a *valid* enquiry stopped 579px
short of the words at 0 of 3 questions, 301px short at 1 of 3 and **22px**
short at 2 of 3, so the letters woke only on a fully answered one. At 22px the
light looks like it tried to arrive and failed, which reads as a fault rather
than as a state. So the fraction has a **floor**: once the enquiry can
actually be sent, the light is at least at the words, and whatever is still
unanswered carries it on to the crossing.

What the line measures is therefore readiness to send, not raw completeness.
In the order the page actually asks — questions first, details second — the
two agree anyway and the floor never engages: measured 0.2, 0.4, 0.6, 0.8,
1.0, because a complete enquiry is already past it. It engages only for
someone who skips the questions, and what it buys them is the light arriving
on the words at the exact keystroke that makes the enquiry sendable. The cost
is known and accepted: that visitor sees the line jump 580px in one keystroke
and then hold still through all three questions before moving again.

Two other fixes were built as real pages and measured side by side before this
one was taken. Ending the line's full extent *at* the words makes a complete
enquiry land exactly on them but leaves 2 of 3 **228px** short — worse, not
better, because the words move to 1.0 while the fill still stops at 0.8.
Firing the wave when the light comes to rest as well as when it arrives fixes
2 of 3, but also fires at 0 of 3 where the light rests 579px away, so the
gesture stops reading as caused by the light at all. **The arrival watcher is
untouched by the decision taken** — it still waits on the rendered line and
nothing else, which is why retiming the fill in CSS still cannot put the two
out of step.

Verified at 1440x900 on `/contact`: a valid enquiry at 0 of 3 and at 2 of 3
both put the light 1.6px past the words with the letters woken; 3 of 3 fills
to 1.0 and stops at the crossing with **0px** of overshoot, the crossing
still sits **0px** off the footer rule, and the tail is still 260px measured
plus 36px of overhang, finishing 35.6px past the last line of text. All 17
letters carry `send-open` on a 0-416ms stagger and share one top once
settled. Below 901px the floor does not engage — there is no track to measure
— and the letters wake immediately as before.

Three things about it are load-bearing. The animation carries **no
fill-mode**, so every letter releases back to `inherit`; with a fill the first
hover after activation would find seventeen letters holding a colour of their
own and the accent would never arrive. The sentence is written **twice** —
once plain for assistive tech, once as `aria-hidden` letters — or a screen
reader announces seventeen characters instead of three words; verified the
link still exposes the name "Send this enquiry". And the letters are **in the
template, not built in JS**, so Astro stamps them with the scope attribute
itself and no `stamp()` helper is needed.

**The grey line runs the whole page; the orange stops at the crossing.**
`.divide` spans the enquiry and ends on the footer rule — that is the
crossing, and it is also the fill's track, so `.divide__fill` is at most 100%
of it and can never follow the grey down. The stop is structural, not a
number kept in step. Below the crossing the grey continues as `.divide::after`
at `top: 100%`, sized in two parts: `height: calc(var(--tail, 0px) +
clamp(28px, 4vh, 46px))`. `--tail` is the MEASURED distance from the crossing
down to the footer's **last line of text**; the clamp is the overhang past
it, and it stays in CSS because it is a design value rather than a
measurement — the same little-way-past the line has always carried, so there
is one number for the overhang and not two. Before the first measurement
lands `--tail` falls back to `0px`, leaving exactly the clamp. The
measurement takes a `Range` over the footer's contents rather than the
footer's own box: the two coincide today only because `.ft` has no bottom
padding, and reading the box would quietly grow the tail the day it gains
some. Measured rather than declared because that distance is not something
the CSS can read, and it moves when the footer reflows. It is re-measured from `render()` (the note and the peek
change the page's height), on `resize`, and after `document.fonts.ready`. The
value is floored so a sub-pixel overshoot cannot grow the scroll area it was
just measured against, and skipped entirely below 901px where the line is
`display: none` and has no box to measure. Verified at 1440x900: crossing 1527
sits exactly on the footer rule, the line starts at delta 0 from the top of
"Let's talk.", and the grey runs 260px measured plus 36px of overhang to
finish 35.6px past the last line of text. The orange at full fill stops at
the crossing with 0px of overshoot. The overhang follows the clamp across
window heights — 28px at 600, 36px at 900, 46px at 1200 — and never reaches
the page's padding edge, leaving 104/162/218px below it, so it cannot grow
the scroll area.

At some widths the line passes through a footer link — "Instagram" near
1100, "Behance" near 1300, clean at 1200 and 1440. It does not read as a
strike-through: the links are pure white and the rule is 7% white, so the
line changes those glyphs by 0/255. It is visible only in the gaps between
letters, where it is crossing the ground as it does everywhere else.

**The refusal note fits beside the action; the ready note does not.** At 1440
the label is 383.3px and the gap is 16px in a 606.4px band. "Name and email
required" is 202.5px, so the pair needs 601.8px and sits on one line with
baselines shared exactly. The ready note, "Opens as a draft. Send it when
you're ready.", is 211.2px — needing 610.5px — and drops to a second line by
4.1px. That is pre-existing and independent of the letters, which changed the
label width by 0.1px. Left alone deliberately: the one-line requirement was
about the refusal state, which is the one a visitor sits with.

---

**The ghost folio is gone.** Work pages used to carry the section's number at
13vw behind each heading at 0.04 opacity — the one ornament on the page.
Removed on request. `.blk { position: relative }` and the `.blk > :not(.fol)`
layering went with it: the only thing needing a positioned ancestor was the
folio, and `.rl` anchors to `.blk__lbl`, which carries its own. The pages are
still numbered where it counts — `hd__folio` at the top still reads "007 / 16",
the stills are still captioned 01, 02, and the recognition index is still
numbered.

**Work pages sit on one 760px measure.** Borrowed from preview XXII
"Measure": `.hd`, `.q` and `.blk` all take `--measure: min(760px, 100%)`, so
the page has exactly two vertical edges and every block begins and ends on
them. The body loses its own 60ch cap so it fills the measure rather than
sitting narrower still inside it. Mobile is untouched — 100% wins there.

Two consequences, both carried deliberately:

- **The credit table drops to two columns.** Three cells on a 760px measure
  leaves about 215px each, not enough for a value on one line. The existing
  860px rule cannot do it; that is a viewport query and the viewport is wide.
- **The head caps at 7.25rem, down from 8rem.** At 128px the longest word in
  the catalogue — "Reflections" — set 807px against a 760px column and spilled
  47px past the right edge. Measured across all sixteen titles it is the only
  one that overflows, and the ceiling that fits it is 120px; 116px leaves 29px
  of margin.

**The stills grid is deliberately NOT forced to two columns**, which is where
this departs from the reference. XXII hardcodes `repeat(2, …)` because it was
built for Aasha. Measured across the catalogue, the live grid's ratio-aware
`auto-fill` already lands on two for thirteen of the sixteen works at this
measure and on three for the three 9:16 portrait works — better than two would
be for them. Forcing it would throw that away to match a draft that only ever
had one ratio to satisfy.

**The opening is the Academy countdown, and its three frames are named.**
`COUNTDOWN` in `index.astro` lists slug, frame index and an optional aim.
Behind 3 is Book My Yamraj frame 1, behind 2 Taskaree frame 1, behind 1
Special Ops frame **2** — everywhere else on the site a work shows its first
frame, so the index is carried explicitly rather than implied. The aim is a
zoom and a shift that centre the FACE in the ring, because `object-fit` centres
the frame. A shift alone cannot do it for a landscape frame in a square ring:
cover fits it by height, so there is no vertical slack, and the zoom is what
creates the room. Its floor is set by how far off-centre the face is — a face
at 0.31 of the height can only be centred by discarding everything above 0.62.
The shift can be at most half the slack the zoom created or the frame pulls off
an edge; Taskaree at 1.12 left 3.7px of a 368px ring, one rounding from a
hairline, so it runs at 1.15.

**The mosaic bed's cast is a swap table keyed on the SCORE'S slug.**
`BED_SWAPS` in `src/lib/bed.ts` is read against the unmodified sequence, which
is what lets a pair exchange rather than one replacing the other. **It also
means a second swap does not compose the way it reads.** Mere Ho, Moholla and
Bloody Bubbly are now a three-way rotation and had to be written as their end
state; adding `mere-ho ↔ moholla` on top of the existing pair would have
collided with the Bloody Bubbly entry and produced something else. Check the
rendered cells after any edit, not the table.

**Two bed frames carry letterbox bars burned into the file.** Broken
Reflections 115px top and bottom of 1080, Diwali 180 top and 115 bottom of
2234 — 21.3% and 13.2% of the frame. Both are cropped in `BED_CROP`; Diwali
needs a shift as well because its bars are uneven. The factors that put the bar
edges exactly on the tile edges measured 0.0 and −0.2px of margin, so both
carry about 1% more. There is nothing to give back: the floor for a 1px margin
is 1.292 and 1.171 against the 1.29 and 1.175 in use.

**Recognition takes two shapes and they are set differently.** Counts —
"7 Official Selections · 10 Nominations · 6 Wins" — are figures, and Aasha and
Broken Reflections keep the ruled band. Every other awarded work carries
citations, an honour and the body that gave it, and those set as a numbered
index. The test is unchanged: if every dot-separated part opens with a figure
it is a tally. The old code joined every entry with " · " and split on "·",
which threw away the entry boundary — invisible on fifteen works and fatal on
the one with two.

## 6 · Traps — every one of these cost real time

**Astro scopes component CSS with a `data-astro-cid-*` attribute, and
JavaScript-created elements never get it.** A scoped `.foo` compiles to
`.foo[data-astro-cid-x]` and will not match an element built at runtime. Hit
three times: the pill-measuring span (fixed with inline styles), the refusal
note's characters (fixed by copying the attribute off a template element —
see `setNote` in `ContactForm.astro`), and once in a *test*, where an injected
mirror rule lost the cascade to the scoped original.

**A scoped `> *` blanket outranks a scoped single class.** Astro compiles
`.bay > *` with the `data-astro-cid-*` attribute on *both* compounds, which
scores higher than `.s-statement[data-astro-cid-*]`. A blanket
`grid-column: 1 / -1` therefore beats every by-name placement written after
it, and the whole composition silently flattens to full width with no error
anywhere. Measured on /about: every child computed `1 / -1` while the
stylesheet plainly said otherwise. **Place grid children by name, never with
a `> *` blanket** — and when a media query has to override those, write the
overrides at the same `.parent > .child` specificity or they lose too.

**`text-indent` inherits, and every inline-block re-applies it.** The hanging
indent on /about's statements was inherited into each masked word, and since
each `.line` is an `inline-block` with `overflow: hidden` it pushed its own
word straight out of its own clip box. Measured: `.line` boxes collapsed from
full word width to 4px — exactly the padding — and the statement rendered as
fragments. Reset `text-indent: 0` on `.line` and `.line__in`.

**A line box tighter than 1em is shorter than the glyphs it holds.** At
`line-height: 0.96` and 124px, the descender of "working" was being shaved
off by the mask. Give `.line` `padding-bottom: 0.24em` with
`margin-bottom: -0.24em` so the clip box gains room and the layout does not,
and push the keyframe's travel past it (135%, not 105%).

**A cached viewport offset is only correct at scroll position zero.** The
lit-segment effect derived its vertical position from `rect.top` captured once
at load. It therefore worked in the first movement and nowhere below it, off
by exactly the scroll distance — which reads as "the effect is broken further
down the page" rather than as an arithmetic error. **Store vertical offsets
document-relative** (`rect.top + scrollY`) and they survive scrolling for
free; only a resize can stale them.

**Binding an effect per element cuts a continuous system into pieces that
cannot see each other.** Nothing was wrong with the ledger's drawing when the
light broke at every section seam: each section simply ran its own loop and
handed off at the boundary. When an effect is supposed to read as one thing
across the page, bind it once at the top and let it drive the parts.

**A colour effect can do nothing and still look perfectly fine.** The stair's
paragraphs sit in `.stair__p`, not in a `.read` element, so `.read p { color:
var(--bone-dim) }` never reached them and they inherited the page's white.
The reading light was then lighting white onto white: measured lit *and*
unlit both `rgb(255,255,255)`. Nothing looked broken, because white prose on
this ground looks correct — the effect was simply absent. **When a class
carries a colour floor, check the floor is actually applied**, by comparing a
word against the same kind of word elsewhere on the page rather than by
looking at it.

**A tolerance test never writes the last step home.** The ledger loop only
wrote a rule's value to the DOM when it differed from the last written value
by more than a threshold — so a value easing to zero from just under that
threshold left a stale figure in the DOM for ever while the internal state
said zero. Invisible here (0.0019 of alpha on a 1px line) but it means the
rest state is not the rest state. **Any eased value needs an explicit final
write when it lands.** Worth knowing it was hidden for a whole round because
the check rounded to two decimals, which turned 0.002 into 0.

**Read a computed colour after a class change and you get the transition's
START value.** Cost twenty minutes twice: a rule that had just been given
`.is-near` still reported its resting colour, which looked exactly like a
broken selector. Collapse `transition-duration` before reading, the same way
you already have to for the preview pane.

**A ratio is only as good as the box you divide by — and the box may be
about to change in the same pass.** The floor above measures where the words
sit as a fraction of the track. Computed in the pass that also swaps the
note, it divided by a track 54.8px shorter than the one it would be drawn
against, and put the words at 0.849 instead of 0.816 — the light overshot
them by 48.9px. The label never moved: it sits 1136.5px down the track in
both states. What moved was the **denominator** — the ready note wraps to a
second line where the refusal note does not, growing `.send__band` by 54.8px,
which grows `.ct__page`, which grows `.divide`. Write the measurement *after*
the DOM changes that pass is going to make, not before them. Looking for a
moving label here wastes the time; measure both terms.

**Stale dev CSS is the most frequent trap of all.** Fresh HTML, old or absent
stylesheet. Symptom: the markup changed but nothing looks different, or a
whole block renders unstyled. The nastiest form is a **split** state — the
script is live while the stylesheet is not, so a custom property reads
correctly on the element (`--tail: 458px`) while the rule still resolves the
old value (`height: 36px`). That looks exactly like a CSS bug and is not one.

**Stop the server before clearing the cache.** Clearing it underneath a
running server causes the very problem it is meant to fix.

```bash
# stop the dev server first, then:
rm -rf node_modules/.vite .astro && npm run dev -- --port 4323
```

Before blaming a rule, ask the build what actually ships — it is
authoritative and takes a second:

```bash
npm run build && grep -rho "\.divide[^{]*:after{[^}]*}" dist/_astro/contact.*.css
```

Do this after any structural edit before concluding something is broken.

**Sticky elements are bounded by their container, not their grid row.** The
contact masthead is `position: sticky` with `min-height: 80vh`; while the
footer was a *child* of the same grid, the masthead slid over it and silently
ate clicks and text selection. The footer is now a sibling. **Whenever
anything gains `sticky` or `fixed`, hit-test what is underneath it** —
`document.elementFromPoint` at an element's own centre should return that
element.

**The browser preview pane is not a browser.** It runs as a hidden document:
`requestAnimationFrame` never fires, CSS transitions freeze at their start
value, IntersectionObserver never delivers, and the viewport is frequently
`0×0` so every geometry reading and every media query is wrong. Anything
measured there needs one of: transitions disabled with
`*,*::before,*::after{transition-duration:0s!important}` — note `*` does **not**
match pseudo-elements, so include `*::before,*::after`; a shimmed
`requestAnimationFrame`; or reading the built CSS instead. Worse, `requestAnimationFrame` there is
not simply absent but **bursty**: it ticks a few frames around an interaction
and then stops. Measured while verifying the floor — 7861ms of wall clock
produced **4 rAF frames**, so a transition sat frozen at its start value and
an rAF-driven watcher had not run, which looks *exactly* like "the watcher is
broken". It is not. Timers still fire, and taking a screenshot pumps enough
frames to let a transition finish, so: act, screenshot, then measure.

**`:hover` cannot be forced from script.** Mirror the rule with a class of
identical specificity — and carry the `data-astro-cid-*` attribute, or the
mirror loses to the scoped original.

**`background-clip: text` clips every background on its box.** Painting text
with a gradient on an element that also has a fill destroys the fill. Wrap the
text in its own element.

**`:has()` does not always re-evaluate on descendant state changes.** A
`.parent:has(input:not(:placeholder-shown))` rule matched by `matches()` while
the painted style stayed stale. Back it with a JS-toggled class.

**Vite's `import.meta.glob` is case-sensitive.** `.JPG` files were invisible
until both cases were listed in `src/lib/frames.ts`.

**`margin-inline: auto` collapses a grid item.** Auto inline margins override
`stretch`; add `width: 100%`.

**A staggered animation puts every element at a different offset at once.**
Asking "are these letters on one row?" while a 416ms stagger is in flight
reports two rows that differ by the 1.7px of `translateY(0.06em)` — a wrap
that does not exist. Worse in the preview pane, which freezes animations so
they sit at staggered offsets indefinitely. Settle first:
`el.getAnimations().forEach(a => a.finish())`.

**`align-items: baseline` means two flex children never share a top or a
bottom edge.** Detecting a wrap by counting distinct bottom edges therefore
always answers "wrapped", and comparing tops always answers "different line",
at any font size. Test the two things that are actually true on one line:
the second box starts at or after the first one ends, *and* their vertical
extents overlap.

**Adding up child widths does not tell you whether a flex row wrapped.** A
block-level flex container is as wide as its parent lets it be, not as wide
as its contents, so the sum can miss the container width and still be one
line — or match it and be two. Read the gap with `getComputedStyle`
(guessing it is how a wrap gets talked out of existence) and test geometry,
not arithmetic.

**`Range.getBoundingClientRect()` includes live transforms.** Measuring a
masked label mid-animation reported the text sitting 50px below its own
mask. Nothing was wrong with the mask.

**Canvas `measureText` ignores the element's `letter-spacing`.** Set
`ctx.letterSpacing` from the computed style or the width will not match, and
a mismatch there is easy to mistake for the wrong font having been measured
— which then discredits the vertical ink metrics, which were fine all along.

**A range rect is the font's line box, not the glyph ink.** It reported a
4.5px ascender overshoot inside a clipping mask where the real ink had 6.3px
of clearance. For "does this clip?", measure ink:
`measureText().actualBoundingBoxAscent/Descent` against a baseline found with
a zero-height `vertical-align: baseline` probe.

---

**`getAnimations()` drops a finished animation that does not fill.** The
countdown's frames and numerals use `animation: ldr-cut … steps(1, end)` with
no `forwards`, so once they end they leave the timeline. A probe that grabs
`getAnimations()` *after* that point can only move what survived — the sweep
and the lift — and setting `currentTime` silently does nothing to the frames,
so every count renders empty. Reload and pause while they are all still live.
This produced two rounds of "the loader is broken" that were the probe, not the
page.

**A gradient's tile IS the element box, so shifting by the box size is a
no-op.** Two sticks a stick-height apart had their diagonals out of phase.
`background-position: 0 <stick-height>` looked like the fix, computed
correctly, and changed nothing — the box is exactly one stick-height tall, so
that is a shift of exactly one whole tile. Offset the gradient's stops instead.
Shifting sideways works too but exposes the tile seam where the box is not a
whole number of periods.

**A percentage translate resolves against the element's own box.** A 1px line
translated by `var(--x)` moves 1px, not the width of the track. Put the line in
a full-width carrier and translate the carrier.

**`findIndex` by slug finds the FIRST match, which may not be the one a swap
table produced.** Aasha appears twice in the bed's cast — its own slot and the
one borrowed from Ve Maahi. Matching on the slug alone found the wrong one and
put Aasha in both of the two best cells with Mere Ho pushed out of sight. Match
on the marker that distinguishes them.

**Reaching past a component's own scoped image rule needs the extra class.**
`Still` sets `transform: scale(1.001)` on its image at specificity (0,2,1). A
rule from the page at `.ms__tile :global(img)` is (0,2,1) and loses; naming
`.frame__layer` as well makes it (0,3,1) and wins — including over Still's
reduced-motion reset. `!important` is not needed and hides the reasoning.

**A draft that imports the live tables inverts the moment it is applied.** The
mosaic drafts read `bed.ts` so they cannot drift from the site. That is right
while they are proposals — but once a swap is applied, the draft that proposed
it applies it a second time and shows the state *before* the decision, labelled
as the proposal. Neutralise the draft's own exchange when it is adopted, or it
actively misleads. `mosaic-m` is kept as a record of exactly this.

**Subject-detection heuristics disagree with each other and with the eye.** A
skin-tone centroid sits well below the face because it counts hands and neck;
the upper third of the skin mass sits above it, on the hairline. Both were
wrong by 10–20% of the frame. Read the position off a rendered grid with a
centre cross and verify the result the same way — the heuristic is a hint, not
a measurement.

## 7 · State of play

### What the site is, as of now
**86 pages build clean** — 20 real, 66 under `/preview/`.

The home page is **one page**: the Academy-countdown opening, the `OpNav`
menu, a fixed mosaic bed of the catalogue behind everything, the aperture mat,
and every movement as a section of it.

Work pages sit on **one 760px measure** — head, quote and every block on the
same narrow column, so the page has exactly two vertical edges. They mount the
same menu with `base="/"`. They came from the "Ghost" draft but no longer carry
its folios: the big ghosted section numerals were removed, and `.blk` is
`static` again as a result.

### Supplied and working
All sixteen works have real stills. Homepage, sixteen project pages, Contents,
About, Contact.

### Outstanding — things only Ugam can provide
1. **Neue Haas Grotesk Display** — licensed. Drop three `.woff2` into
   `public/fonts/` and they self-activate. Currently falling back to Helvetica
   Neue, so any "set in Neue Haas" colophon line would be false today. Note the
   countdown's aim figures were read against the fallback; they are positions
   in a photograph, so a font swap does not disturb them.
2. **Fourteen MP4s** — 4 Dinshaw's, 6 Book My Yamraj, 4 Aladdin. Players are
   built and show a still with an external link until the file appears.
3. **Bloody Bubbly** — four assumed fields, marked `←` in its markdown.
4. **A portrait for `/about`** — `PORTRAIT` in `about.ts` is empty.
5. **A booking link** — `CALL_URL` in `contact.ts` is empty.
6. **Audio excerpts** — optional; the player is built and waiting.

### The preview library — 66 pages, kept deliberately
Homepage directions (Helix, Deck, Marquee, Weave, Ticket, Monogram, Aperture
XLV), 37 work-page drafts, 4 loaders, 3 recognition drafts and 13 mosaic-bed
drafts. **Ask before deleting any of it.** The shared preview components are
`_pv-*` in `src/components/`, and `_pv-mosaic.ts` in `src/lib/`.

### Awaiting a decision — nothing applied
- **Mosaic bed:** drafts A–I and L are unapplied. A–C predate the "same
  geometry" constraint and propose new geometry. D–I are placements of a ranked
  twelve. **L** proposes swapping My Red Crayon and The Shiva Trilogy. **J** and
  **M** are applied and kept as records.
- **Recognition:** **B · Plate** and **C · Register** unapplied; **A · Index**
  is live on the six citation works.
- **Loading screen:** Gate, Contact, Scope and Slats are unapplied alternates;
  **Leader** is live. Each is drop-in — one import in `index.astro`.
- **The countdown's brightness.** The three frames are brighter than the set
  they replaced, and under the numeral they mean 72.9, 84.7 and 61.4. The white
  numeral clears 7.5:1, 6.3:1 and 9.0:1 against those, but against the
  brightest patches inside the glyph the **2** falls to 1.6:1 and softens.
  Dropping `brightness` in `Opening.astro` from 0.8 to about 0.65 would leave
  the centres at roughly 50–69 and lift all three clear. One value, one file.
- **Bloody Bubbly holds the best cell on the bed and reads close to black.**
  Under the bed's filter it means 3.7 against a ground of 10, and none of its
  five frames clears the ground — the brightest is 7.9. A different still will
  not fix it; it needs either a different cell or a per-tile exception to the
  0.30 cap.
- **`/about` and `/contact` are now redundant as separate pages**, since the
  home page carries both as sections. They still exist and still work.
- **Four ratio mismatches** between a declared `ratio:` and the stills' true
  aspect: Diwali 16:9 vs 1.55 (crops ~13%), Moholla 3:2 vs 1.78 (~19%), Special
  Ops 16:9 vs 1.71 plus a stray `00.jpg` at 2.11 that sorts first, Book My
  Yamraj 9:16 vs 0.53 (~6%). Broken Reflections' 2.35 vs 1.85 is intentional.

### Housekeeping
**This IS now a git repository** — initialised at the handoff, one commit on
`main`, 275 files, working tree clean. `node_modules`, `dist`, `.astro` and
`.DS_Store` are ignored; `src/media` (279MB of stills) and `_originals` (34MB)
are tracked, because they are source the site builds from and there is no other
copy. No single file exceeds 7.5MB, so nothing approaches GitHub's 100MB limit,
but `.git` is ~293MB — a first clone will take a while.

Identity is set **repo-locally only** (`Ugam Khetani <khetaniugam@gmail.com>`);
the global git config was left untouched.

Three things committed but safe to delete now that history exists:
- the six `*-backup` files at the root — snapshots from before version control;
- `build12.py`, `chrome12.py`, `css12.py` — dead scaffolding from an earlier
  generator workflow. `build12.py` imports a module (`inner7`) that is not in
  the folder, so it cannot run;
- `Overlay.astro`, unused since Contents became a page.

Also worth knowing: the project sits under `~/Desktop`, which is iCloud-synced.
A dev server once died with an `EPERM` reading a frame mid-build — the file was
intact, and it has not recurred, but moving the project off the Desktop would
remove the cause.

### Measured facts about the bed, worth not re-deriving
The bed is 6 × 5 = 30 tiles behind an aperture measuring 1101 × 624 in a
1280 × 800 viewport. **Only 12 cells are ever clear** of both the aperture edge
and the text over them; 14 are never visible at either end of the scroll and
decode an image for nothing. Ranked by how often each is unobstructed:

```
cell  15    14    13    16    9     8     20    21    19    22    7     10
clear 0.48  0.47  0.29  0.29  .175  .175  0.15  0.15  0.12  0.12  .115  .115
```

The inner columns sit inside the aperture far more (0.33–1.00 against
0.11–0.33) but behind panels far more (0.387 against 0.13), which is why more
than one placement is defensible. Full workings in `src/lib/_pv-mosaic.ts`.

---

## 8 · Publishing

Push to GitHub, connect to Vercel or Netlify, take the defaults — both detect
Astro. Build `npm run build`, output `dist`. Every push republishes.

---

## 9 · Reference

Design reference: <https://ghuynguyen.vercel.app>
Contact and About reference: <https://www.danielvaszka.com>

Read against the reference rather than copied from it. Where a reference was
measured rather than guessed at, the numbers are in the relevant CSS comment —
e.g. its contact page is a true 50/50 flex split with a 3.4em gutter and an
80vh left column using `justify-content: space-between`, which is why ours is.
