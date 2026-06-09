# Dashboard (Profile View)
The personal hub where authenticated users visualize their cross-platform coding progress, contributions, connected accounts, recent activity, and earned achievements.

Layout Hierarchy:
- Header (Full-width, fixed/sticky)
  - Top Navigation Bar
- Main Content Container (Centered, max-width constrained)
  - Profile Header Section
  - Contribution Heatmap Section
  - Connected Platforms Grid Section
  - Two-Column Layout:
    - Left Column: Recent Activity Section
    - Right Column: Badges Section

## Top Navigation Bar
- CodeSync logo (clickable, returns to landing or dashboard)
- Navigation links: Dashboard (active state), Leaderboard, Settings
- Right side elements:
  - Notifications icon with badge counter
  - User avatar (small, circular) with dropdown trigger
  - Dropdown menu items: Profile, Settings, Documentation, Logout

## Profile Header Section
- Large Discord avatar (circular, glowing border based on rank tier)
- Username display (large, bold) with Discord discriminator
- Global rank badge display:
  - Rank number with ordinal suffix (e.g., "247th")
  - Rank tier indicator (e.g., "Gold Tier" with gold accent glow)
  - Percentile display (e.g., "Top 15%")
- Total problems solved counter (large, animated number with neon accent)
- Current streak display:
  - Flame icon with glow effect
  - Streak count (e.g., "23 Day Streak")
  - Longest streak reference (e.g., "Best: 45 days")
- Quick action buttons:
  - "Share Profile" button with link icon
  - "Edit Profile" button
- Background: Glassmorphic card with subtle gradient and border glow

## Contribution Heatmap Section
- Section heading: "365-Day Activity" with optional year selector dropdown
- GitHub-style contribution grid:
  - 365 cells arranged in week columns (53 columns × 7 rows)
  - Color intensity scale from dark (0 problems) to bright neon (high activity)
  - Each cell represents one day
  - Hover tooltip displays:
    - Date (e.g., "June 9, 2026")
    - Problem count (e.g., "5 problems solved")
    - Breakdown by platform if available
- Legend display:
  - Color scale reference: "Less" → "More" with sample cells
  - Activity summary: Total active days, average daily problems
- Streak indicators:
  - Visual highlighting of current streak cells
  - Optional: Longest streak period highlighted differently
- Background: Glassmorphic card with neon border that glows on hover

## Connected Platforms Grid Section
- Section heading: "Connected Platforms" with optional "Manage Connections" link
- Platform cards in responsive grid (2-3 columns):
  - Card for LeetCode:
    - Platform logo (large, with brand color accent)
    - Platform name
    - Connection status badge (Connected/Disconnected with color indicator)
    - Username on platform
    - Problems solved count (large number)
    - Recent activity indicator (e.g., "Last active: 2 hours ago")
    - Quick action button: "View Profile" or "Sync Now"
  - Card for CodeChef:
    - (Same structure as LeetCode)
  - Card for Codeforces:
    - (Same structure as LeetCode)
  - Card for HackerRank:
    - (Same structure as LeetCode)
  - Card for SmartInterviews:
    - (Same structure as LeetCode)
- Each card has:
  - Glassmorphic background
  - Hover lift effect (subtle translate and shadow)
  - Border glow matching platform brand color
  - Status-based styling (connected cards glow, disconnected cards dimmed)

## Recent Activity Section
- Section heading: "Recent Activity" with optional "View All" link
- Scrollable activity feed (max-height with custom scrollbar):
  - Activity item 1:
    - Problem title (clickable link)
    - Platform badge/icon
    - Difficulty indicator (Easy/Medium/Hard with color coding)
    - Timestamp (relative, e.g., "2 hours ago")
    - Optional: Problem tags/topics
  - Activity item 2:
    - (Same structure)
  - Activity item 3:
    - (Same structure)
  - Activity item 4:
    - (Same structure)
  - Activity item 5:
    - (Same structure)
  - [Additional items loaded dynamically or paginated]
- Each activity item has:
  - Subtle border separator
  - Hover background highlight
  - Platform-specific accent color on left border
- Empty state (if no recent activity):
  - Illustration or icon
  - Text: "No recent activity. Start solving problems!"
  - CTA button: "Connect Platforms"

## Badges Section
- Section heading: "Achievements" with optional badge filter dropdown
- Badge grid display (2-3 columns):
  - Badge card 1 (Unlocked):
    - Badge icon/illustration (glowing, colored)
    - Badge name (e.g., "First Blood")
    - Badge description (e.g., "Solved your first problem")
    - Unlock date
    - Glowing border and elevated shadow
  - Badge card 2 (Unlocked):
    - (Same structure)
  - Badge card 3 (Locked):
    - Badge icon/illustration (grayscale, dimmed)
    - Badge name
    - Badge description with unlock criteria
    - Progress bar showing completion percentage
    - Text: "X/Y problems to unlock"
    - Subtle border without glow
  - Badge card 4 (Locked):
    - (Same structure)
  - Badge card 5 (Locked):
    - (Same structure)
  - Badge card 6 (Unlocked):
    - (Same structure)
  - [Additional badges displayed with scroll or "Show More" expansion]
- Hover interactions:
  - Unlocked badges: Flip animation revealing additional stats/description
  - Locked badges: Shake animation or progress detail reveal
- Badge categories (optional filter):
  - All Badges
  - Consistency (streak-based)
  - Volume (problem count)
  - Difficulty (hard problems, contests)
  - Platform-specific

## Additional UI Elements
- Loading states for all sections with skeleton screens
- Error states with retry options for failed platform connections
- Responsive breakpoints:
  - Desktop: Full multi-column layout
  - Tablet: Adjusted grid columns, stacked sections
  - Mobile: Single column, collapsible sections
- Micro-animations:
  - Numbers count up on load
  - Cards fade in sequentially
  - Hover glow effects on all interactive elements
  - Smooth transitions for all state changes
