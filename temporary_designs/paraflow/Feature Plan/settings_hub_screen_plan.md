# Settings Hub
A centralized configuration center using a Bento-grid layout where users manage their profile, account settings, profile widgets, access documentation, and (if applicable) administrative tools.

Layout Hierarchy:
- Header (Full-width, fixed/sticky)
  - Top Navigation Bar
- Main Content Container (Centered, max-width constrained)
  - Page Title Section
  - Bento-Grid Layout Section

## Top Navigation Bar
- CodeSync logo (clickable, returns to dashboard)
- Navigation links: Dashboard, Leaderboard, Settings (active state)
- Right side elements:
  - Notifications icon with badge counter
  - User avatar (small, circular) with dropdown trigger
  - Dropdown menu items: Profile, Settings (active), Documentation, Logout

## Page Title Section
- Large heading: "Settings"
- Subheading: "Manage your profile, connections, and preferences"
- Optional breadcrumb navigation: Home > Settings

## Bento-Grid Layout Section
Asymmetric grid arrangement with varied card sizes for visual interest and hierarchy

### Profile & Account Card (Large, Prominent Position)
- Card heading: "Profile & Account" with settings icon
- Content sections within card:
  - Discord Profile Display:
    - Large Discord avatar (editable with hover overlay: "Change Avatar")
    - Username with discriminator (read-only, sourced from Discord)
    - User ID (small, monospace font)
  - Visibility Settings:
    - Toggle switch: "Public Profile" (on/off)
    - Description: "Allow others to view your profile and stats"
    - Toggle switch: "Show on Leaderboards" (on/off)
    - Description: "Display your rank in server leaderboards"
    - Toggle switch: "Display Badge Collection" (on/off)
  - Account Actions:
    - Button: "Sync All Platforms" (with refresh icon and glow effect)
    - Button: "Export Data" (download JSON of user data)
    - Danger zone divider
    - Button: "Delete Account" (red accent, with warning icon)
      - Confirmation modal trigger
- Card background: Glassmorphic with prominent border glow
- Card size: Takes up 2 grid columns

### Profile Widgets Card (Medium Size)
- Card heading: "Profile Widgets" with code icon
- Content sections:
  - Widget Preview:
    - Live preview of embeddable profile widget (SVG or PNG)
    - Shows avatar, username, problems solved, current streak
    - Theme selector: Light/Dark toggle
  - Customization Options:
    - Dropdown: "Widget Style" (Compact, Full, Minimal)
    - Checkbox: "Show Contribution Heatmap"
    - Checkbox: "Show Badge Collection"
    - Checkbox: "Show Platform Breakdown"
  - Export Options:
    - Button: "Copy SVG Link" (with link icon, copies to clipboard)
    - Button: "Download PNG" (download icon)
    - Button: "Copy Markdown" (for GitHub/forum embeds)
  - Shareable Profile Link:
    - Text input (read-only): "codesync.dev/profile/[username]"
    - Button: "Copy Link" (with copy icon and success feedback)
- Card background: Glassmorphic with neon border glow on hover
- Card size: Takes up 1 grid column

### Platform Connections Card (Medium Size)
- Card heading: "Platform Connections" with link icon
- Content: Quick access to manage connected accounts
  - List of platforms with status:
    - Platform 1: LeetCode
      - Connection status badge (Connected/Disconnected)
      - Last synced timestamp
      - Button: "Manage" or "Connect"
    - Platform 2: CodeChef
      - (Same structure)
    - Platform 3: Codeforces
      - (Same structure)
    - Platform 4: HackerRank
      - (Same structure)
    - Platform 5: SmartInterviews
      - (Same structure)
  - Button at bottom: "Manage All Connections" (links to detailed connection management page)
- Card background: Glassmorphic with platform-colored accents
- Card size: Takes up 1 grid column

### Documentation Card (Small to Medium Size)
- Card heading: "Documentation" with book icon
- Content: Quick links to help resources
  - Link list:
    - "Getting Started Guide" (with arrow icon)
    - "API Documentation" (with code icon)
    - "FAQ & Troubleshooting" (with question icon)
    - "Video Tutorials" (with play icon)
    - "Release Notes & Changelog" (with list icon)
  - Additional resources:
    - Button: "Join Discord Community" (with Discord icon and invite link)
    - Button: "View GitHub Repository" (with GitHub icon)
- Card background: Glassmorphic with subtle border
- Card size: Takes up 1 grid column

### Admin Portal Card (Conditional - Only if User Has Admin Role)
- Card heading: "Admin Portal" with shield icon and "Admin" badge
- Content: Administrative access controls
  - Admin functions list:
    - "Server Management" (with server icon)
      - Subtext: "Manage Discord server integrations"
    - "User Moderation" (with user icon)
      - Subtext: "Review flagged accounts and reports"
    - "Analytics Dashboard" (with chart icon)
      - Subtext: "View platform-wide statistics"
    - "System Settings" (with cog icon)
      - Subtext: "Configure platform behavior"
  - Button: "Enter Admin Portal" (prominent, glowing with admin accent color)
- Card background: Glassmorphic with special admin accent glow (purple or gold)
- Card size: Takes up 1-2 grid columns depending on screen size

### Notifications & Preferences Card (Medium Size)
- Card heading: "Notifications & Preferences" with bell icon
- Content sections:
  - Notification Settings:
    - Toggle: "Email Notifications" (on/off)
    - Toggle: "Discord DM Notifications" (on/off)
    - Toggle: "Rank Change Alerts" (on/off)
    - Toggle: "Achievement Unlocked Notifications" (on/off)
  - Preferences:
    - Dropdown: "Default Leaderboard View" (Weekly, Monthly, All-Time)
    - Dropdown: "Dashboard Theme" (Auto, Light, Dark)
    - Checkbox: "Show Tutorial Tips" (on/off)
- Card background: Glassmorphic with border glow
- Card size: Takes up 1 grid column

### Security & Privacy Card (Medium Size)
- Card heading: "Security & Privacy" with lock icon
- Content sections:
  - Connected Sessions:
    - List of active sessions with device info and last active timestamp
    - Button for each session: "Revoke" (red accent)
  - Privacy Controls:
    - Toggle: "Allow Data Collection for Analytics" (on/off)
    - Toggle: "Share Profile with Third-Party Apps" (on/off)
  - Security Actions:
    - Button: "Review Permissions" (opens modal with OAuth scope details)
    - Button: "Download Privacy Report" (generates PDF)
- Card background: Glassmorphic with security-themed accent
- Card size: Takes up 1 grid column

## Grid Layout Characteristics
- Asymmetric Bento-grid arrangement:
  - Profile & Account card spans 2 columns (prominent)
  - Remaining cards in varied single-column placements
  - Responsive reflow: Desktop (3-column grid), Tablet (2-column), Mobile (1-column stack)
- Card visual design:
  - All cards have glassmorphic backgrounds
  - Subtle border glow effects (intensified on hover)
  - Consistent internal padding and spacing
  - Hover effects: Slight lift (translateY), enhanced glow, background brighten
  - Cards maintain equal heights within rows where appropriate
- Spacing and gaps:
  - Consistent gap between cards (1.5rem or similar)
  - Cards maintain internal hierarchy with clear section dividers

## Additional UI Elements
- Loading states for card content (skeleton screens)
- Success/error toast notifications for actions:
  - "Profile updated successfully"
  - "Widget link copied to clipboard"
  - "Account sync completed"
  - Error messages with retry options
- Modal dialogs:
  - Account deletion confirmation with multi-step verification
  - Permission review modal showing OAuth scopes
  - Session revocation confirmation
- Micro-animations:
  - Toggle switches with smooth transitions
  - Button hover glows
  - Card entrance animations (staggered fade-in on page load)
  - Copy-to-clipboard success feedback (checkmark animation)
- Accessibility:
  - Keyboard navigation for all interactive elements
  - Focus states with visible glowing outlines
  - ARIA labels for icon-only buttons
  - Screen reader-friendly form labels
