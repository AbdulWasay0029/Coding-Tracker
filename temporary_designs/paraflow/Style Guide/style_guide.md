# CodeSync Style Guide

**Overall Theme:**
Premium, modern, and highly technical "Dark Mode". It should feel like a next-generation developer tool (think Vercel, Linear, or GitHub Dark Mode). Avoid flat UI; rely on depth, glassmorphism, and neon glowing accents.

**Color Palette:**
- **Backgrounds:** Deep, rich darks (`#05070A`, `#0B0E14`, or `#121212`). Do not use generic flat blacks like `#000000`.
- **Surfaces/Cards:** Slightly lighter shades with subtle glassmorphism or blur effects (`#1A1D24` with `rgba(255,255,255,0.05)` borders).
- **Accents:** Vibrant, glowing neon accents for interactive elements and data highlights:
  - Electric Blue (`#3B82F6` to `#60A5FA`) for primary actions.
  - Emerald Green (`#10B981`) for successful solves and positive trends.
  - Warning/Gold (`#F59E0B`) for ranks, streaks, and premium features.

**Typography:**
- **UI Text:** Modern, clean, and highly readable sans-serif (e.g., `Inter`, `Outfit`, or `Roboto`).
- **Data & Numbers:** Monospace fonts for statistics, numbers, dates, and code-like elements (e.g., `JetBrains Mono`, `Roboto Mono`).

**Visual Language & Interactivity:**
- Heavy use of subtle gradients and glowing drop-shadows (e.g., `shadow-[0_0_30px_rgba(var(--primary),0.1)]`).
- Clean grid-bento layouts for dashboard widgets.
- Micro-animations for hover states (cards lifting up slightly, borders glowing, icons translating). Data numbers should ideally feel like they "tick" or count up.
