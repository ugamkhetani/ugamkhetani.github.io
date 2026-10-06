/**
 * Contact — the questions, the lines, the fields.
 *
 * Everything a visitor is asked lives here. Adding, removing or reordering a
 * question is an edit to this file and nothing else; the numbering is derived
 * from position, so nothing has to be renumbered by hand.
 */

export const EMAIL = 'khetaniugam@gmail.com';
export const PHONE = { value: '+91 88494 93751', href: 'tel:+918849493751' };

/** Paste a Cal.com or Calendly link here and the "book a call" line appears.
 *  Leave it empty and that line simply isn't rendered — never a dead link. */
/** Verified: wa.me accepts the number in international form with no plus or
 *  spaces, and returns "Chat on WhatsApp" rather than an invalid-number page.
 *  ?text= can prefill a message, which the footer link does not use. */
export const WHATSAPP = 'https://wa.me/918849493751';

export const CALL_URL = '';
export const CALL_LABEL = 'Book a free discovery call';

export interface Question {
  key: string;
  q: string;
  hint?: string;
  /** true = tap as many as apply (checkbox); false = one answer (radio) */
  multi: boolean;
  /** Label used in the composed email. */
  line: string;
  options: string[];
}

export const QUESTIONS: Question[] = [
  {
    key: 'need',
    q: 'What do you need?',
    hint: 'Tap as many as apply',
    multi: true,
    line: 'Needed',
    options: [
      'Original score', 'Sound design', 'Voice direction & casting',
      'Final mix', 'Sonic identity', 'Song production', 'Not sure yet',
    ],
  },
  {
    key: 'kind',
    q: 'What is it?',
    multi: false,
    line: 'Format',
    options: [
      'Feature film', 'Series / OTT', 'Short film', 'Brand film / reel',
      'Campaign', 'Trailer', 'Song / album', 'Something else',
    ],
  },
  {
    key: 'stage',
    q: 'Where is it right now?',
    hint: 'The earlier the better — but late is workable',
    multi: false,
    line: 'Stage',
    options: [
      'Just an idea', 'In development', 'In production', 'In edit',
      'Close to final cut', 'Locked', 'Already out',
    ],
  },
  {
    key: 'scale',
    q: 'How much music?',
    multi: false,
    line: 'Scale',
    options: [
      'A single cue or reel', 'Under 10 minutes', '10 – 40 minutes',
      'Feature length', 'A full series', 'Not sure yet',
    ],
  },
  {
    key: 'when',
    q: 'When do you need it?',
    // Reels and campaigns turn round in days; a feature takes months. One
    // scale has to cover both, so the bands run from days upward.
    multi: false,
    line: 'Timeline',
    options: [
      'Within days', 'Under 2 weeks', '2 – 4 weeks', '1 – 3 months',
      '3 – 6 months', '6 months +', 'Not fixed yet',
    ],
  },
];

/** The three questions actually asked: what, for what, by when.
 *  `RESERVE` below holds two more that were built and tried. Move one into
 *  QUESTIONS to ask it — numbering is derived from position, so nothing else
 *  needs touching. */
export const ASKED = ['need', 'kind', 'when'];
export const asked = () => QUESTIONS.filter((q) => ASKED.includes(q.key));
export const reserve = () => QUESTIONS.filter((q) => !ASKED.includes(q.key));

/** `label` is the accessible name only — it is never drawn. The details are
 *  set as pills, so the prompt lives inside the field the way an option's
 *  words are the option, and it disappears the moment it is answered.
 *
 *  No prompt says "optional". `required` splits the row: the fields that
 *  need filling come first, then a marker, then the rest drawn with a dashed
 *  hairline. Saying it three times cost 186px and told nobody anything the
 *  shape doesn't. */
/* `type` IS ANNOTATED, NOT INFERRED. Left to itself the literal 'text' widens
   to `string`, and <input type={f.type}> in ContactForm.astro will not take a
   bare string — the attribute wants one of the input types. Naming the four we
   use keeps the check honest and the error at this end if a fifth appears. */
export const FIELDS: {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url';
  required?: boolean;
  placeholder: string;
  autocomplete?: string;
}[] = [
  { key: 'name',  label: 'Name',    type: 'text',  required: true, placeholder: 'Your name', autocomplete: 'name' },
  { key: 'email', label: 'Email',   type: 'email', required: true, placeholder: 'Your email', autocomplete: 'email' },
  { key: 'phone', label: 'Phone',   type: 'tel',   placeholder: 'Your number', autocomplete: 'tel' },
  { key: 'title', label: 'Project', type: 'text',  placeholder: 'Project title' },
  { key: 'link',  label: 'Link',    type: 'url',   placeholder: 'A cut, a brief, or a reference' },
];

/** Carried over from the old Contact overlay — these were already published
 *  and must not be lost in the move to a page. */
export const ELSEWHERE = [
  { label: 'Spotify', value: 'Artist page', href: 'https://open.spotify.com/artist/36D3Qnoj1FO92GaEOZ88Xd?si=rkxQM2U2TcehJY_eyzGhIA' },
  { label: 'Apple Music', value: 'Artist page', href: 'https://music.apple.com/in/artist/ugam-khetani/1654384018' },
  { label: 'Instagram', value: '@ugam.wav', href: 'https://www.instagram.com/ugam.wav' },
  { label: 'Behance', value: 'ugamkhetani1', href: 'https://www.behance.net/ugamkhetani1' },
];
