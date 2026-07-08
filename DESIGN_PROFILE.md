# Simplefysed Solutions: Hero & Nav Design Profile

A precise, reproducible profile of the **"Paper & Ink" editorial design** as expressed in the
landing-page hero section and the top navigation bar.

> **Scope.** This document describes **only** the current hero + nav design (warm paper
> background, ink text, rust accent, serif display headline). The legacy neon / cyberpunk
> token set (`--neon-*`, `--bg-primary`, glow utilities) that still lives in `globals.css`
> for other sections is intentionally **out of scope** and must not be treated as part of
> this profile.
>
> **Source files:** `src/components/hero/HeroSection.tsx`, `src/components/hero/HeroContent.tsx`,
> `src/components/layout/Header.tsx`, `src/components/layout/Navigation.tsx`,
> `src/components/ui/Button.tsx`, `src/styles/globals.css`, `src/app/layout.tsx`.

---

## 1. Color Palette

Five warm, low-saturation tokens carry the entire hero + nav. The mood is a printed-paper
broadsheet: a cream field, near-black warm ink, and a single vivid rust accent used sparingly.

| Token | Tailwind | Hex | RGB | Role |
|-------|----------|-----|-----|------|
| Paper | `bg-paper` | `#F3F0E9` | `243, 240, 233` | Page + hero background, translucent header fill |
| Paper Card | `bg-paper-card` | `#FBF9F4` | `251, 249, 244` | Companion raised-surface tone (defined; not used in hero/nav yet) |
| Ink | `text-ink` / `bg-ink` | `#1B1A17` | `27, 26, 23` | Primary text, wordmark, hairlines, dark button fill |
| Ink Muted | `text-ink-muted` | `#6B6760` | `107, 103, 96` | Secondary text: subhead, inactive nav, stat labels |
| Rust | `text-rust` / `bg-rust` | `#D6442F` | `214, 68, 47` | The one accent: payoff words, primary CTA, active underline, hover |

**Character of each tone**

- **Paper `#F3F0E9`** is a warm cream (roughly `hsl(42, 29%, 93%)`), not white. It sets the
  editorial, tactile tone.
- **Ink `#1B1A17`** is a *warm* near-black (`hsl(40, 8%, 10%)`), never pure `#000`. It keeps
  text soft against the cream.
- **Ink Muted `#6B6760`** is a taupe-gray for de-emphasis, warm enough to sit on paper without
  looking dirty.
- **Rust `#D6442F`** is a vermilion red-orange (`hsl(8, 68%, 51%)`). It is the brand signal and
  is rationed: one accent per unit of meaning.

### Opacity / tint usage (exact)

The design leans on alpha tints of ink and rust rather than adding new tokens:

| Usage | Where |
|-------|-------|
| `bg-paper/85` + `backdrop-blur-md` | Fixed header bar (translucent, frosted over content) |
| `border-ink/10` | Header bottom hairline; stats block top divider |
| `border-ink` (full) | Hero section bottom border |
| `bg-ink` → hover `bg-ink/90` | "Get Started" nav button (`ink` variant) |
| `bg-rust` → hover `bg-rust/90` | "Start a Project" hero CTA (`rust` variant) |
| `text-paper` | Label color on ink and rust filled buttons |
| `border-ink` → hover `border-rust` + `text-rust` | "Schedule a call" underline text-link |
| `bg-rust` (2px) | Active nav-item underline |

### Accent discipline (the single most important color rule)

Rust appears **once per logical unit**, always on the word that carries the payoff:

- Wordmark: `Simplefysed` (ink) + **`Solutions`** (rust)
- Headline: "More **output.**" (only `output.` is rust)
- Primary action only: "Start a Project" filled rust; the secondary action stays ink.
- Active nav state only: a rust underbar under the current page.

Never let rust cover more than a small fraction of any viewport. If two rust elements would
sit adjacent, demote one to ink.

---

## 2. Typography

Three typefaces, each with a strict job. A serif for the emotional display line, a neutral
grotesque for everything readable, and a monospace for anything that behaves like data.

### 2.1 Font families

| Role | Family | Fallback stack | Weights loaded | Used for |
|------|--------|----------------|----------------|----------|
| **Display / headline** | **Playfair Display** | `Georgia, 'Times New Roman', serif` | 400, 500, 600, 700 (roman + italic) | The hero `<h1>` only |
| **Body / UI** | **Inter** | `system-ui, sans-serif` | variable (via `next/font`) | Wordmark, nav links, subhead, buttons |
| **Data / mono** | **JetBrains Mono** | `'Consolas', monospace` | variable | Stat values and micro-labels |

Loaded through `next/font/google` in `app/layout.tsx` and exposed as CSS variables
(`--font-playfair`, `--font-inter`, `--font-jetbrains-mono`) mapped to Tailwind
`font-serif`, `font-sans` (default body), and `font-mono`.

> Note: `Space Grotesk` (`--font-display`) is also loaded but is **not used** anywhere in the
> hero/nav; the display voice here is Playfair serif, not the grotesk. In offline dev, Playfair
> may fall back to Georgia; the intended face is Playfair Display.

### 2.2 Type scale (exact, as authored)

| Element | Size (responsive) | Weight | Tracking | Leading | Family / style |
|---------|-------------------|--------|----------|---------|----------------|
| Hero headline `h1` | `text-5xl` → `sm:text-6xl` → `lg:text-[4.2rem]` (48 → 60 → 67px) | 500 (`font-medium`) | `-0.02em` (tight) | `1.02` (very tight) | Playfair, mixed roman + *italic* |
| Hero subhead `p` | `text-lg` (18px) | 400 | normal | `relaxed` (1.625) | Inter, `text-ink-muted`, `max-w-lg` |
| Wordmark | `text-xl` (20px) | 600 (`font-semibold`) | tight | normal | Inter |
| Nav link | `text-[15px]` | 500 (`font-medium`) | normal | normal | Inter |
| Nav button ("Get Started") | `text-[14px]` | 600 | normal | normal | Inter |
| Hero primary CTA | `text-[15px]` | 600 | normal | normal | Inter |
| Stat value | `text-2xl` → `sm:text-3xl` (24 → 30px) | 400 | tight | normal | JetBrains Mono |
| Stat micro-label | `text-[10px]` | 400 | `0.1em` (wide) | normal | JetBrains Mono, `uppercase` |

### 2.3 Typographic signatures

- **Serif + italic mix in one headline.** Lines alternate roman and italic for rhythm:
  "Fewer tools." (roman) / "*Fewer people.*" (italic, muted) / "More output." (roman, accent).
- **Tight display metrics.** Big serif line runs at `leading-[1.02]` and `-0.02em` tracking so
  the three short lines read as one dense block.
- **Data wears monospace.** Any number or metric switches to JetBrains Mono, small-caps-styled
  via `uppercase` + wide `0.1em` tracking on labels. This is the visual cue for "measured fact."
- **Muted = recessive.** `text-ink-muted` is the workhorse for supporting copy; full `text-ink`
  is reserved for things that must lead.

---

## 3. Copywriting Style

The voice is **calm, confident, efficiency-first**. It sells *less* (fewer tools, fewer people,
less busywork) as the path to *more* (output). It never shouts, never hypes, never pads.

### 3.1 Voice & tone

- **First-person plural, active.** "We craft…", "They transform…", "…automate…". The company
  does things; the software does things. No passive constructions.
- **Understated confidence.** Claims are concrete, not superlative. It says what the work does,
  not that it is "revolutionary" or "world-class."
- **Outcome over feature.** Copy resolves to business results ("transform business operations",
  "automate redundant company workflows"), not tech name-drops.
- **No exclamation marks. No ALL-CAPS shouting** in prose. Emphasis comes from structure and the
  rust accent, not punctuation volume.

### 3.2 Structural devices (with live examples)

- **Fragments as headline.** The hero headline is three sentence fragments, each ending in a
  period for a full-stop, staccato beat:
  > Fewer tools. Fewer people. More output.
- **Anaphora + antithesis.** Repeat the frame, then flip it: "**Fewer** … **Fewer** … **More** …".
  Less-input / more-output is the core rhetorical move.
- **Rule of three.** Lists come in triads: "web applications, mobile experiences, and AI solutions."
- **One accent word per line.** Each headline unit has exactly one word that could carry the rust;
  only the final payoff ("output.") actually does.
- **Two short sentences beat one long one.** The subhead is split into two clean sentences rather
  than joined with connective punctuation.

### 3.3 Hard formatting rules

- **Never use an em dash (`—`).** Restructure instead: split into two sentences, or use a comma,
  colon, or parentheses. This applies to every piece of copy on the site. (Do not substitute a
  hyphen or en dash as a stand-in; rework the sentence.)
- **Accent the payoff word, once.** Wrap a single word per unit in rust
  (`<span className="text-rust">`), always the word that lands the point.
- **Metrics have a house format:**
  - Monospace, with an `uppercase` wide-tracked micro-label beneath.
  - Thousands separated by commas: `3,876`.
  - Approximations prefixed with a tilde: `~30`.
  - Rates use a slash with spaces: `Tasks / month`, `Hours saved / wk`. Units abbreviate
    (`wk`, `/ month`).
  - Keep the three metrics internally consistent (derive one from the others rather than picking
    numbers that contradict each other).
- **Casing:** Title Case for actions and nav ("Start a Project", "Get Started", "Case Studies").
  Sentence case for descriptive stat labels ("Agents deployed", "Hours saved / wk").

### 3.4 Calls to action

- **Imperative, verb-first, short.** "Start a Project", "Schedule a call", "Get Started".
- **Primary vs secondary pairing.** One high-commitment action (filled rust: "Start a Project")
  paired with one low-friction alternative (ink text-link with a trailing arrow:
  "Schedule a call →"). Never two filled buttons competing.

### 3.5 Quick do / don't

| Do | Don't |
|----|-------|
| "Fewer people. More output." | "We help you do more with less!!!" |
| "They transform business operations." | "Revolutionary, world-class, next-gen solutions" |
| "Start a Project" | "Click here to learn more" |
| Two short sentences | One sentence stitched with an em dash |
| `~30` `3,876` in mono | `about thirty` `3876` in prose |
| One rust word per line | A whole sentence in rust |

### 3.6 On-voice templates (reusable)

- Headline: `Less {input}. Less {input}. More {outcome}.`
- Subhead: `We {build verb} {triad of offerings}. They {transform verb} {business area} and {automate verb} {the drudgery}.`
- Metric: `{number} · {sentence-case label with abbreviated unit}` in mono, one approximated with `~`.

---

## 4. Layout & Composition

Editorial, asymmetric, and airy. The left column reads like a magazine opener; the right holds a
single floating illustration on the same paper.

- **Two-column hero.** `grid-cols-1 lg:grid-cols-[1fr_0.85fr]`, each column `min-h-screen`.
  Content left (wider), graphic right (narrower). Collapses to one column below `lg`.
- **Deep left margin.** Content and header share a large left inset: `lg:pl-32 xl:pl-40`
  (8rem / 10rem). This oversized margin is the editorial signature.
- **Vertical centering with breathing room.** Hero content is vertically centered with `py-28`
  (7rem) top/bottom padding.
- **Floating graphic, no panel.** The right illustration sits directly on paper via
  `mix-blend-multiply` (line art multiplies into the cream), capped at
  `max-h-[calc(100vh-6rem)]`, `object-contain`. There is deliberately **no** background fill
  behind it.
- **Solid paper field, hairline structure.** Hero background is flat `bg-paper` with a full
  `border-ink` bottom edge; internal dividers are `border-ink/10` hairlines.

### Header treatment

- **Fixed, thin, frosted.** `fixed top-0`, `h-16` (64px), `bg-paper/85` + `backdrop-blur-md`,
  `border-b border-ink/10`. It floats over the hero, which clears it via the hero's `py-28`.
- **Left wordmark, right cluster.** `justify-between`: wordmark left; nav links + "Get Started"
  grouped right (`gap-10`, nav internal `gap-8`).

### Buttons

- **Square corners on purpose.** Hero/nav buttons override the component default `rounded-lg`
  with `rounded-none` for a crisp, editorial edge.
- **Two fills, defined roles.** `rust` variant (`bg-rust text-paper`) = primary/marketing action.
  `ink` variant (`bg-ink text-paper`) = utility/nav action. Both hover to a `/90` tint.
- **Text-link as tertiary.** Ink label with a `1.6px` bottom border and a Lucide `ArrowRight`
  that slides on hover; the whole link shifts to rust on hover.

### Motion (Framer Motion)

- **Staggered fade-up entrances.** Header slides in from `y: -100`; hero content fades up
  (`y: 30 → 0`) with delays `0.15` (block) and `0.35` (CTAs); the graphic fades up at delay `0.3`.
- **Restrained micro-interactions.** Buttons use `whileHover scale 1.02` / `whileTap 0.98`.
  Nothing bounces or spins; motion is quiet, like the copy.

---

## 5. One-line reproduction summary

> Warm cream paper (`#F3F0E9`), warm near-black ink (`#1B1A17`), taupe muted text (`#6B6760`),
> and a single rationed rust accent (`#D6442F`). Playfair Display for a tight, italic-mixed serif
> headline; Inter for all UI and body; JetBrains Mono for metrics. Big left margins, a fixed
> frosted header, square-cornered buttons, and quiet fade-up motion. Copy is first-person,
> active, outcome-focused, built on fragments, anaphora, and triads, with one rust payoff word
> per line, house-formatted metrics, and never an em dash.

---
*Profile derived directly from the live local build of the hero section and navigation bar.*
