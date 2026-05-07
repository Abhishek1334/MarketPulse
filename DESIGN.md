# MarketPulse — Design system

## Aesthetic direction
**Editorial financial.** Morning newspaper finance section meets a quiet trading workstation. Confident type, generous space, single warm accent.

## Typography
- **Display (serifs, headlines):** Fraunces (variable: weight 100–900, optical size 9–144, soft 0–100, slnt -10–0)
  - Use weight 600+ for hero headings, optical size 144 for the largest sizes (more dramatic contrast).
  - Use a slight `font-variation-settings: "SOFT" 30` for warmer feel.
- **Body (UI, paragraph):** Plus Jakarta Sans (weight 400, 500, 600, 700)
- **Numbers (prices, percentages, ticker symbols):** JetBrains Mono (weight 400, 500)
  - Apply `font-variant-numeric: tabular-nums` so columns of prices align.
- **Scale ratio:** 1.333 (perfect fourth) — `12 → 14 → 18 → 24 → 32 → 42 → 56 → 75 → 100`. No "step every 4px" linear scale — that's monotonous.

## Color tokens (OKLCH)

### Brand (shared light + dark)
- `--accent-500`: `oklch(72% 0.16 60)` — burnt amber, warm orange-gold. Used SPARINGLY: hero CTA, link hover underline, focus ring. Max ~5% of any surface.
- `--accent-600`: `oklch(64% 0.16 60)` — hover state.
- `--accent-700`: `oklch(56% 0.15 60)` — pressed.

### Light mode (warm paper)
- `--bg`: `oklch(98% 0.005 60)` — off-white tinted slightly toward accent hue
- `--surface`: `oklch(96% 0.006 60)` — slight shift for cards
- `--surface-2`: `oklch(94% 0.007 60)` — modal, popover
- `--border`: `oklch(88% 0.005 60)` — hairline borders
- `--text`: `oklch(22% 0.01 60)` — ink black, NOT pure black; tinted toward accent
- `--text-muted`: `oklch(45% 0.01 60)` — secondary text
- `--text-subtle`: `oklch(60% 0.005 60)` — tertiary

### Dark mode (cool night)
- `--bg`: `oklch(15% 0.01 250)` — deep blue-tinted near-black
- `--surface`: `oklch(18% 0.01 250)`
- `--surface-2`: `oklch(22% 0.012 250)`
- `--border`: `oklch(28% 0.012 250)`
- `--text`: `oklch(95% 0.005 60)` — warm near-white, tinted toward accent
- `--text-muted`: `oklch(72% 0.008 60)`
- `--text-subtle`: `oklch(55% 0.008 60)`

### Semantic (finance — gain/loss only)
- `--gain`: `oklch(70% 0.15 145)` — restrained green; used ONLY for positive P&L numbers
- `--loss`: `oklch(62% 0.20 25)` — restrained red; used ONLY for negative P&L numbers
- Do NOT use these for status, success/error toasts, or anything that isn't literally a P&L direction. Toasts use the accent color (warning is amber-shifted, error gets `--loss` only because red error is universal).

## Layout
- **Page max-width**: 1200px (large surfaces feel generous, not cramped)
- **Body line-length**: 65ch (standard editorial)
- **Section spacing**: vary deliberately. Hero = 12rem top, 8rem bottom. Features = 6rem. CTA = 4rem. Same padding everywhere = monotony.
- **Asymmetry over centering.** Hero text left-aligned, accompanying visual pulled right. Avoid the "everything-centered" Tailwind default.

## Motion
- **Single signature**: a hero number/chart that draws or counts in on first view. Once. Not on scroll triggers.
- **Hover**: 150ms ease-out on color and underline thickness.
- **Theme switch**: instant — no fades. Theme transitions look fancy but feel laggy.
- **Eases**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce, no elastic.
- **No animations on layout properties** (width, height, margin) — transform/opacity only.

## Components
- **Cards**: not the default. Use horizontal rules + spacing for sections; reserve cards for genuinely contained units (a single watchlist, a single holding).
- **Buttons**:
  - Primary: solid `--accent-500` text, white-on-accent fill, 0 border-radius corners (or 4px max — current `rounded-2xl` is too friendly).
  - Secondary: ghost — text-only with underline appearing on hover.
- **Numbers**: ALWAYS in JetBrains Mono with tabular-nums. Prices, percentages, dates.
- **Borders**: 1px hairline, never side-stripe accents.
- **NO glassmorphism**. The current backdrop-blur navbar can stay (it's a small surface), but stop using it on cards.

## Banned patterns (from impeccable's absolute bans + project specifics)
- Side-stripe colored borders >1px
- Gradient text via background-clip
- Decorative glassmorphism beyond the nav
- Hero-metric template (big number, small label, supporting stats, gradient accent)
- Identical card grids (the 6-feature grid on current Homepage is the exact failure mode)
- Modals as first thought
- Em dashes in copy (use commas, colons, parens)
- The `from-purple-500 to-pink-500` lucide-icon-in-gradient-square pattern
