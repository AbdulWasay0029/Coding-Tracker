# CodeSync Website Redesign Brief

*Note for User: Copy and paste everything below this line to your AI Designer tool, and optionally attach a few screenshots of our current dashboard and leaderboard.*

***

## 1. Design Assets & Style Guide

**Vibe & Theme:** 
Premium, modern, and highly technical "Dark Mode". It should feel like a next-generation developer tool (think Vercel, Linear, or GitHub Dark Mode). 

**Color Palette:**
- **Backgrounds:** Deep, rich darks (e.g., `#05070A`, `#0B0E14`, or `#121212`). No generic flat blacks.
- **Surfaces/Cards:** Slightly lighter borders with subtle glassmorphism or blur effects (`#1A1D24` with `rgba(255,255,255,0.05)` borders).
- **Accents:** Vibrant, glowing neon accents for interactive elements and data highlights:
  - Electric Blue (`#3B82F6` to `#60A5FA`)
  - Emerald Green for Success/Solves (`#10B981`)
  - Warning/Gold for Ranks (`#F59E0B`)
  - Neon Purple/Pink for specific platform branding

**Typography:**
- Clean, modern sans-serif for UI (e.g., `Inter`, `Outfit`, or `Roboto`).
- Monospace fonts for data, numbers, and code-like elements (e.g., `JetBrains Mono`, `Roboto Mono`).

**Visual Language:**
- Heavy use of subtle gradients and glowing drop-shadows (e.g., `shadow-[0_0_30px_rgba(var(--primary),0.1)]`).
- Clean grid-bento layouts for dashboard widgets.
- Micro-animations for hover states (cards lifting up slightly, borders glowing).

## 2. Strategic Context

**Target Audience:**
Competitive programmers, computer science students, and developer communities on Discord. They are highly technical, data-driven, and care deeply about aesthetics, statistics, and bragging rights.

**Core Purpose:**
CodeSync acts as a "Unified Developer Identity." It tracks and aggregates a user's problem-solving progress across multiple competitive programming platforms (LeetCode, CodeChef, Codeforces, HackerRank, SmartInterviews) and presents it in beautiful, gamified leaderboards and personal dashboards.

## 3. Content & Functionality (Required Pages)

The website follows a standardized 4-page architecture. 

### A. Landing Page (`/`)
- **Main Job:** Sell the bot and get users to invite it to their Discord or login.
- **Key Elements:** 
  - Massive, high-impact hero section with a glowing gradient mesh background.
  - Headline: "Your Unified Developer Identity."
  - Call to Action: "Login with Discord".
  - A futuristic, floating mock-up of the dashboard/leaderboard UI.

### B. Leaderboard (`/leaderboard`)
- **Main Job:** Social engagement and ranking developers within a specific Discord server.
- **Key Elements:**
  - A server-selection dropdown at the top.
  - A beautifully styled ranking table. 
  - Ranks #1, #2, and #3 need distinct, highly celebrated visual treatments (gold/silver/bronze glowing avatars or borders).
  - Columns: Rank, Developer (Avatar + Name), Problems Solved (Last 7 Days), and Top Platform.

### C. Personal Dashboard (`/dashboard`)
- **Main Job:** The user's personal hub for their stats and platform connections.
- **Key Elements:**
  - **Header:** User Avatar, Discord Name, Total Solves, and Global Rank.
  - **Contribution Graph:** A GitHub-style commit heatmap showing their coding consistency over the last 365 days.
  - **Platform Cards:** A grid showing connected platforms (LeetCode, Codeforces, etc.) with their specific usernames.
  - **Recent Activity:** A scrolling list of recently solved problems.
  - **Badges Section:** A display of earned achievements (e.g., "Master Chef", "Early Bird", "Weekend Warrior") with glowing icons and locked/unlocked states.

### D. Settings Hub (`/dashboard/settings`)
- **Main Job:** A centralized configuration center.
- **Key Elements:**
  - A grid of large, clickable "Bento" cards linking to different configuration areas.
  - Cards needed: "Profile & Account", "Profile Widgets" (for generating GitHub readme images), "Documentation" (for bot commands), and "Admin Portal".
  - Hovering over these cards should reveal a subtle glow or icon animation.
