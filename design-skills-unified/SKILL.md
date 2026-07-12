---
name: design-skills-unified
description: The master unified anti-slop design intelligence system combining Taste Skill, UI/UX Pro Max v2.0, Impeccable (Neo Kinpaku tokens), and Bencium Marketplace (controlled UX, kinetic typography, and impact design). Use this single skill for all UI/UX audits, frontend creation, and product polishing.
---

# Unified Design System: The Master Anti-Slop & UI/UX Pro Max Guide

> **Combined Intelligence from:**
> 1. **Taste Skill:** The Anti-Slop Frontend Framework (Dials, Brief Inference, Non-templated Layouts)
> 2. **UI/UX Pro Max v2.0:** Searchable databases of 67+ UI styles, color systems, typography pairings, and reasoning rules
> 3. **Impeccable (Neo Kinpaku System):** Deep lacquer grounds, high-contrast metallic/patina accents, and token discipline
> 4. **Bencium Marketplace:** Controlled UX Designer, Kinetic Typography, Impact Designer, and rigorous Design Audits

---

## 0. PRE-FLIGHT BRIEF INFERENCE (Read the Room Before Coding)

Before touching code or suggesting a single Tailwind utility, **infer what the product actually needs**. Most AI-generated interfaces feel "sloppy" or templated because the model defaults to a generic purple-gradient SaaS card instead of analyzing the domain.

### 0.A Read These Signals First
1. **Page/App Kind:** Landing page, data dashboard, server admin portal, developer tool, or consumer app.
2. **Audience:** Technical developers/coordinators (requires precision, high data density, keyboard accessibility, clear error handling) vs. casual consumers (requires emotional hooks, micro-animations, airy spacing).
3. **Existing Brand & Constraints:** For redesigns or feature additions, **preserve existing core branding and user flows** (`discordUserId` links, OAuth, server admin role checks). Do not invent fake features or placeholder stats. Every UI element must reflect real system capabilities.

### 0.B Mandatory One-Line "Design Read"
Before generating or auditing frontend code, explicitly state:
> *"Reading this as: `[Page/App Kind]` for `[Audience]`, with a `[Vibe]` language, leaning toward `[Design System / Archetype]`."*

### 0.C Anti-Default Discipline
**Never** default to:
- Generic AI-purple/pink radial gradients on every single section.
- Centered 3-column equal feature cards with identical icons and vague placeholder copy.
- Unnecessary glassmorphism with low contrast text that fails WCAG AA standards.
- Infinite-loop bouncing or spinning micro-animations that distract from core workflows.

---

## 1. THE THREE CORE DIALS (Global Configuration)

Every layout, motion, and density decision is gated by these three dials (Scale: `1` to `10`):

| Dial | Scale Definition | Baseline Default | Dashboard / Admin Override |
| :--- | :--- | :--- | :--- |
| **`DESIGN_VARIANCE`** | `1` = Perfect Symmetry & Grid <br> `10` = Asymmetric / Bento / Artsy | **`8`** | **`6`** (Structured bento boxes for clean data scannability) |
| **`MOTION_INTENSITY`** | `1` = Completely Static <br> `10` = Cinematic / Physics-driven | **`6`** | **`4`** (Fast, snappy transitions; zero blocking animations) |
| **`VISUAL_DENSITY`** | `1` = Art Gallery / Ultra-Airy <br> `10` = Cockpit / Terminal Data Grid | **`4`** | **`7`** (High density tables, clear badges, compact spacing) |

---

## 2. COLOR SYSTEMS & NEO KINPAKU DISCIPLINE

Draw from **Impeccable** and **UI/UX Pro Max** token systems to build rich, state-of-the-art dark/light modes without visual noise.

### 2.A The Lacquer & Patina Architecture (Dark Mode Mastery)
- **Lacquer Grounds:** Never use pure black (`#000000`). Use deep warm-black (`#05070A` to `#0B0E14`) as the page ground, and slightly raised lacquer panels (`#1A1D24`) for cards and interactive surfaces.
- **Brand Accents (Kinpaku Gold / Patina / Electric Blue):**
  - Primary Action / Brand: `oklch(84% 0.19 80.46)` (Gold) or `#3B82F6` (Electric Blue).
  - Success / Active State: `#10B981` (Emerald Patina).
  - Warning / Defaulter State: `#EF4444` (Vermilion / Rose) or `#F59E0B` (Amber).
- **Glassmorphism Hierarchy:**
  - `glass-subtle`: `backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05);` for background containers.
  - `glass-strong`: `backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08);` for active modals, hero cards, or key control matrices.

### 2.B Contrast & Accessibility (WCAG AA Minimum)
- **Primary Text:** `rgba(255, 255, 255, 0.95)` (Never `100%` pure white to avoid eye fatigue on OLED screens).
- **Secondary/Muted Text:** `rgba(255, 255, 255, 0.60)` for captions, metadata, and timestamps.
- **Disabled/Faint Text:** `rgba(255, 255, 255, 0.35)` for inactive or placeholder text.

---

## 3. TYPOGRAPHY & KINETIC SCALE

Draw from **Bencium Typography & UI/UX Pro Max** font pairing archetypes.

### 3.A Font Archetypes by Domain
- **Developer Tools / SaaS (CodeSync Default):**
  - Sans-serif headings & UI: `Inter`, `Outfit`, or `Geist Sans`.
  - Monospace (Roll numbers, handles, ranks, problem counts): `JetBrains Mono`, `Fira Code`, or `Geist Mono`.
- **Editorial / Premium Wellness:**
  - Serif headings: `Cormorant Garamond` or `Playfair Display`.
  - Sans-serif body: `Montserrat` or `Plus Jakarta Sans`.

### 3.B Scale & Tracking Rules
- **Hero / Section Titles:** Use tight letter spacing (`tracking-tight` or `-0.03em`) with high line-height control (`leading-[1.05]`).
- **Data Tables / Monospace Metrics:** Use explicit font weights (`font-mono font-bold`) and tabular figures (`tabular-nums`) so numbers align vertically in tables without jumping during updates.

---

## 4. LAYOUT, BENTO GRIDS & MICRO-INTERACTIONS

Draw from **Bencium Impact Designer** and **Taste Skill Layout Rules**.

### 4.A Asymmetric & Bento Architecture
- Avoid repetitive grids where every card has the exact same dimensions.
- Use `col-span-2` or `row-span-2` for primary features (e.g., *Contribution Heatmap* or *Zero-Friction Tracking* hero card) to establish immediate visual anchor points.
- Separate distinct administrative layers with clear horizontal rules (`border-t border-border/50`) or distinct container backgrounds (`bg-surface vs bg-background`).

### 4.B Snappy Micro-Interactions
- **Hover Lifts:** Add `transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5 shadow-sm` to interactive cards.
- **Table / Row Hover:** Give data rows subtle hover feedback (`hover:bg-white/[0.03]`) so users easily track large rosters across wide viewports.
- **Atmospheric Background Glows:** Always wrap radial gradient blurs in `pointer-events-none absolute inset-0 overflow-hidden z-0` so they never block button clicks or table selection.

---

## 5. DESIGN AUDIT & TRUTH-IN-ENGINEERING DISCIPLINE

Draw from **Bencium Design Audit**. When reviewing or upgrading an existing web application:

1. **Verify Real vs. Fake Features:** Never invent UI elements for features your backend doesn't support. If the backend supports `LeetCode`, `Codeforces`, `HackerRank`, `CodeChef`, and `SmartInterviews`, make sure your landing page badges and dropdowns match exactly.
2. **Check Navigation Integrity:** Audit every `<Link>` in `Navbar.tsx` and `Footer.tsx`. Ensure no link points to a broken or non-existent route (`/docs` must accurately point to `/dashboard/settings/docs` or wherever real documentation lives).
3. **Respect Existing User Muscle Memory:** When upgrading complex administrative dashboards (like `AdminClient.tsx` or `GuildRosterManager.tsx`), keep primary navigation tabs in predictable locations while upgrading typography, color coding, sorting (`UNLINKED` defaulters strictly at top), and one-click actions (`[ 📥 Export to Excel ]`).

---

## SUMMARY CHECKLIST FOR EVERY UI/UX TURN
- [ ] **Design Read Declared:** Did you state the page kind, audience, and vibe?
- [ ] **Dials Checked:** Are `VARIANCE / MOTION / DENSITY` appropriate for the exact route?
- [ ] **Token Discipline:** Are colors using official design tokens (`bg-surface`, `border-border`, `text-primary`) rather than random inline hex codes?
- [ ] **Zero Placeholder Slop:** Does the page accurately represent the backend database and actions without invented fake metrics?
- [ ] **Responsive & Accessible:** Do tables scroll smoothly (`overflow-x-auto`) on mobile, and does text meet WCAG AA contrast over dark lacquer grounds?
