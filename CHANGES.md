# Changes Log

Every change made to this codebase during the redesign, in chronological order. Each entry: file(s) touched, what changed, why.

---

## 2026-08-25

### Setup
- Cloned repo from `https://github.com/SHYBOYshits/yanafrench.git`, installed dependencies, ran locally on `http://localhost:3000`.

### Visual consistency pass (applied, then reverted at user's request)
- Introduced design tokens (`--stone-wash`, `--hairline-ink`, `--text-muted`, `--text-faint`, `--status-available`) in `app/globals.css` to consolidate ~20 near-duplicate hardcoded hex colors (background tones, secondary text greys, hairline borders) into a single source of truth.
- Normalized outlier paragraph line-heights to a consistent 1.85.
- Unified card shadow language.
- **Reverted in full via `git restore`** per user request — working tree returned to the original clone state.

### Redesign kickoff
- User asked for: (1) this `CHANGES.md` log going forward, (2) a full premium redesign, (3) scroll-triggered fade-in **and** fade-out animation (repeating every time an element enters/leaves the viewport, not just once).
- Redesign proceeds under full creative direction ("more premium, according to you"), keeping page count, section order, and content intact — visual language only.

### Scroll fade-in / fade-out (repeating, both directions)
- `components/Reveal.tsx` — the shared reveal wrapper used across nearly every section on every page: `viewport.once` flipped from `true` to `false`. Elements now fade+slide in every time they scroll into view, and fade+slide back out every time they scroll out of view (via Framer Motion reverting to `initial` on exit), instead of animating once and staying.
- `components/LeHubShowcase.tsx` — same `once: false` flip on the shared `reveal` object and on 4 inline `whileInView` blocks (lexique feature cards, learning-flow steps, course screen frame, workspace screen frame).
- `components/LeHubIntelligenceProgress.tsx` — same flip across all 11 `whileInView` instances (signal map paths, signal nodes, level buttons, journey metrics, journey progress line).
- Left untouched: entrance animations that run once on page load (`Hero.tsx`, mobile menu, modals) — these use `initial`/`animate`, not `whileInView`, so they're not scroll-triggered and weren't part of this ask.

### Premium redesign pass — `app/globals.css`
Design tokens added to `:root`:
- `--stone-wash` (#ece6dd) — replaces 3 near-duplicate hardcoded section-background hexes (`#ebe5dc`, `#eae4db`, plus the existing `#ece6dd`) with one deliberate tone, used on `.max-four`, `.approach`, `.results-page`, `.result-card`.
- `--hairline-ink` (rgba(23,23,25,.08)) — the "soft rule on light background" hairline, now referenced by name instead of repeated as a literal.
- `--text-muted` (#64615b) / `--text-faint` (#75716a) — two clear tiers for secondary body copy vs. small caption/meta text, replacing ~15 near-identical (but not identical) hardcoded greys scattered across the stylesheet.
- `--status-available` (#4e7a5c) — the "batch available" green, previously two slightly different greens in two places.
- `--shadow-soft` / `--shadow-lift` — two standard elevation shadows for cards and lifted surfaces, matching the depth language that was already used in the Le Hub interactive components (`0 18px 50px rgba(23,40,59,.05)`-style) but hadn't been applied to the main site's cards.

Visual upgrades:
- **Eyebrows**: every `.eyebrow` label site-wide now gets a small leading rule (`::before`, an 18px hairline) before the uppercase kicker text — a magazine-editorial touch applied in one place that shows up on every section head across all 7 pages.
- **Buttons**: added hover shadow-bloom to `--accent`, `--dark`, `--ghost`, `--light` variants (on top of the existing `translateY(-2px)` lift) for a more tactile, premium press-state.
- **Section backgrounds**: `.pathways`, `.yana-section`, `.class-format`, `.program-detail`, `.about-page` were flat solid porcelain with zero texture; added the same subtle radial-gradient sheen already used on the hero and the batch-finder section, so the whole site shares one consistent "textured paper" background language instead of only 2 sections having it.
- **Images**: `.hero__image-wrap`, `.yana-section__image`, `.about-page__portrait img` gained a soft drop shadow (`--shadow-lift`) to lift portraits off the page like a printed photograph; `.personality-band__media img` (on the dark `--ink` section) got a subtle 1px light edge instead, since a drop shadow wouldn't read against a dark background.
- **Cards**: `.result-card` gained `--shadow-soft` at rest and `--shadow-lift` + a 4px lift on hover (it was previously a flat color block with no depth or interactivity). `.approach__item` gained a hover background tint — previously the only interactive section on the homepage with zero hover feedback.
- Body-copy line-heights normalized to a consistent `1.85` (several were `1.7`–`1.8` for no clear reason): `.hero__dek`, `.section-head--split > p`, `.tef-feature__body > p`, `.program-detail__item p`.
- Border consolidation: `#c9c1b7` (approach dividers) and `#cfc7bd` (results-page dividers) → `var(--stone)`, matching the border color used everywhere else on the site.

### Premium redesign pass — module CSS files
- `components/BatchFinder.module.css` — same token substitutions (`--porcelain-2`, `--hairline-ink`, `--text-muted`, `--text-faint`, `--status-available`). Added shadow depth: `.courseCardActive` (soft shadow), `.slot:hover` (soft shadow on top of its existing lift), `.selection` panel (lift shadow, it was a flat blue block).
- `components/LeHubInteractive.module.css` — token substitutions for the 3 remaining stray `#f1ece4`/`#eee8df` backgrounds → `var(--porcelain-2)`, and 4 `#777` caption greys → `var(--text-faint)`; 2 stray `line-height:1.8` → `1.85` to match the site-wide paragraph rhythm.
- `components/LeHubPolish.module.css` — `.flowIndex` background and `.flowStep small` color moved onto the shared tokens. Fixed a pseudo-element collision: `.dashboardEyebrow`'s own dot-indicator `::before` would have silently fought the new global `.eyebrow::before` rule (same specificity, order-dependent winner) — made it `:global(.eyebrow).dashboardEyebrow:before` so it deterministically wins and keeps its dot instead of getting the generic line.

Deliberately left alone (documented reasoning, not oversights):
- The "bordeaux-on-dark" large-headline accent family (8 distinct pink/rose hex values spread across `tef-feature`, `personality-band`, `language-journey`, Le Hub's workspace/lexique/final sections, `final-cta`) — these sit on the biggest display type on the page; some genuinely need to be lighter for contrast against a bordeaux background specifically, so unifying them risked a highly visible, hard-to-predict color shift without live visual verification available. Left as-is.
- Neutral UI greys (`#777`/`#888`/`#666`) inside Le Hub's fake "product mockup" screens (dashboard/course/workspace/lexique) — these are deliberately neutral to read as a software screenshot rather than warm editorial copy; folding them into the warm text tokens would blur an intentional distinction.
- Card-internal border hierarchy inside `.result-card` (`#cec7bd`, `#d4cdc4`, `#8f8982`) — three deliberately graduated tones for internal structure on the card's own stone-wash background, not page-level dividers.

Verification: `npm run build` succeeds, all 8 routes prerender cleanly, dev server hot-reloads with no errors. Automated browser screenshot verification was not performed — the user's first instruction in this session was explicitly not to auto-open the site in a browser.

## 2026-08-25 (cont.) — Placement / layout redesign

User asked for a deeper redesign: actual placement changes, not just color/depth polish — "replace the info wherever necessary," full creative license, but content, animations, and font family all stay the same. Interpreted as: real compositional/layout changes are in scope; the words on the page, the Framer Motion animation system, and the two typefaces are not.

### New file: `components/Icons.tsx`
Added 7 small inline-SVG line icons (no new dependency — same hand-built style as the existing `Arrow.tsx`): `IconPersonal`, `IconAdaptive`, `IconFocused`, `IconEngaging` (for the homepage "Approach" section) and `IconOnline`, `IconStudents`, `IconCalendar`, `IconGuidance` (for "Class format"). Both of those sections previously showed only a number (01–04) with no visual icon — the most text-only, visually flattest sections on the homepage.

### `components/Approach.tsx` + `app/globals.css`
Added an icon above the existing number on each of the 4 "L'approche" cards. New `.approach__icon` (a bordered 46px square, fills solid bordeaux on hover) sits above the renamed `.approach__num`. Also gave `.approach__item` a hover background tint — previously the only section on the homepage with interactive cards and zero hover feedback.

### `components/ClassFormat.tsx` + `app/globals.css`
Same treatment: each of the 4 rows ("100% online," "Up to 4 students," etc.) now shows an icon next to its number instead of just the number. Grid changed from a 2-column (`60px 1fr`) to 3-column (`40px 44px 1fr`) row layout to fit it.

### `components/Hero.tsx` + `app/globals.css` — biggest placement change
The three credential tags ("TEF / TCF · CLB 7+", "DELF · A1–B2", "Online only") used to sit as a plain horizontal list under the CTA buttons, in the text column. Moved them into a new floating card (`.hero__credentials`) that overlaps the top-right corner of the hero photo itself — a porcelain, blur-backed card in the same visual language as the existing "Bonjour, I'm Yana" bottom-left label, giving the hero two anchored floating elements instead of one, and pulling the credentials out of the text column entirely. Same fade-in animation and timing as before (`initial`/`animate`, delay .78s) — only its position in the layout changed, not its motion. Added matching responsive overrides at the 800px and existing breakpoints so it sits safely inside the image on mobile instead of floating outside it.

### `components/AboutYana.tsx` + `app/globals.css`
Added a floating "C1 · Certified French tutor" badge overlapping the bottom-right corner of Yana's portrait — same floating-card idea as the hero, applied to the second portrait section on the homepage, for a consistent motif. Existing tags row and copy are unchanged.

### `app/globals.css` — watermark motif extended
The site already used a giant, near-invisible serif "ç" character as a background watermark on 4 sections (`tef-feature`, `page-hero`, `final-cta`, `resources-feature__paper`). Extended the same motif to `.pathways` and `.results-preview` — two prominent homepage sections that were previously flat with no depth layer — using `::after` pseudo-elements with careful `z-index` scoping (`.section-head`, `.pathways__list`, `.results-preview__grid` etc. bumped to `position:relative; z-index:1`) so the giant faint character sits behind all real content rather than on top of it.

Verification: `npm run build` succeeds (TypeScript check included, validates the new `Icons.tsx` prop types and the tuple-destructured icon components in `Approach.tsx`/`ClassFormat.tsx`), all 8 routes prerender cleanly.
