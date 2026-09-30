---
title: "Ira"
year: 2024
category: "Short Film"
opening: still
# ← RATIO IS MEASURED, NOT STATED, AND IT CHANGED ONCE THE BEZELS CAME OFF.
#   The frames arrived 1672x941 and 1671x941 — 16:9 — but that was a 4:3
#   picture pillarboxed into a 16:9 export. Measured by the test
#   src/lib/frames.ts insists on, a threshold near zero read at the edge:
#   columns 0..208 are flat black on all eight and column 209 steps straight
#   into picture, 4.2 to 127.8. Symmetric, so 209 came off each side on
#   2026-09-30 and the files are now 1254x941 and 1253x941 — 1.3326 and
#   1.3316 against 4:3's 1.3333.
#
#   THE PICTURE ITSELF IS UNTOUCHED. The crop is centred and exact, so it
#   removed only the bars: 4,992 sampled pixels across the eight frames are
#   byte-identical to the originals at x+209, and PNG carries no loss through
#   a re-encode. The originals are in git at 3c0cd89 if they are ever wanted.
ratio: "4:3"
role: "Composer"
awards:
  - text: "Official Selection · Chicago South Asian Film Festival"
quote: "Sometimes the most familiar sound becomes interesting when it stops behaving like itself."
description: >
  Original score for an independent short exploring distance, isolation and
  the difficulty of belonging. Familiar instruments are deliberately removed
  from their expected roles. Mandolins become a fragmented, almost organic
  texture, while the clarinet carries a restrained human presence within it.
  Shifting harmonic colours and an unsettled 3/4 pulse keep the score
  slightly unfamiliar, mirroring a character who never quite feels at home in
  her surroundings.
# ← THE ONLY WORK THAT ANSWERS BOTH ROLE AND SCOPE. The other sixteen answer
#   one or the other, and the second row is a Platform on ten of them. Ugam's
#   list for this one names no platform, so nothing here is invented: all four
#   values are his own words. Swap Scope for { label: "Platform", value:
#   "Shorted" } if the watch destination should answer the glance instead —
#   that name is read off the URL, which is why it is not here already.
hover:
  - { label: "Format", value: "Short Film" }
  - { label: "Role", value: "Composer" }
  - { label: "Scope", value: "Original Score" }
  - { label: "Year", value: "2024" }
meta:
  - { label: "Director", value: "Varun Shivnani" }
  - { label: "Format", value: "Short Film" }
  - { label: "Scope", value: "Original Score" }
  - { label: "Approach", value: "Director-led" }
  - { label: "Year", value: "2024" }
# ← "Shorted" IS READ OFF THE URL, not given. shorted.in is where the film is
#   watchable and the page needs a name for the button; the label follows the
#   house form the other five externals use.
external:
  platform: "Shorted"
  label: "Watch on Shorted"
  url: "https://shorted.in/short-films/ira-experimental-drama/"
links:
  - { label: "Watch on Shorted", url: "https://shorted.in/short-films/ira-experimental-drama/", platform: "shorted" }
alt: "Still from Ira"
---
