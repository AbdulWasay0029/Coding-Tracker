# CodeSync React Component Integration Guide

## Overview
All 4 HTML layouts have been created with modular, production-ready code that can be easily converted to React/Next.js components.

## Design System Foundation

### Colors (CSS Custom Properties)
```css
--bg-primary: #05070A;
--bg-surface: #1A1D24;
--primary: #3B82F6;
--primary-light: #60A5FA;
--accent-emerald: #10B981;
--accent-gold: #F59E0B;
--border-glass: rgba(255, 255, 255, 0.05);
```

### Typography
- **UI Font**: Inter, system fonts
- **Data/Mono Font**: JetBrains Mono
- Use monospace for: numbers, usernames, timestamps, code

### Glassmorphism Pattern
```css
background: rgba(26, 29, 36, 0.4);
border: 1px solid var(--border-glass);
backdrop-filter: blur(20px);
border-radius: 20px-24px;
```

### Glow Effects
```css
box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
```

## Component Extraction Strategy

### 1. Landing Page Components

#### `<HeroSection />`
- Gradient text headings
- Platform badges with hover effects
- Dual CTA buttons

#### `<PlatformShowcase />`
- Grid of 5 platform cards
- Hover lift animations
- Status badges

#### `<FeatureGrid />`
- Bento-style asymmetric grid
- Feature cards with icons
- Preview code snippets

#### `<StatsSection />`
- Animated counter numbers
- 4-column responsive grid
- Gradient text effects

### 2. Dashboard Components

#### `<ProfileHeader />`
- Large avatar with glow
- Username + discriminator
- Inline stats display
- Rank badge

#### `<ContributionHeatmap />`
**Key Features:**
- 365-cell grid (53 weeks × 7 days)
- 5 activity levels (0-4)
- Hover tooltips showing date + count
- Color intensity: `rgba(59, 130, 246, 0.1 to 0.9)`
- Legend at bottom

**React Implementation Tips:**
```javascript
const generateHeatmapData = (days = 365) => {
  return Array.from({ length: days }, (_, i) => ({
    date: subDays(new Date(), days - i - 1),
    count: Math.floor(Math.random() * 8),
    level: Math.min(Math.floor(Math.random() * 8 / 2), 4)
  }));
};
```

#### `<PlatformCards />`
- 5 connected platform cards
- Problems solved count (monospace font)
- Last synced timestamp
- Connection status badge

#### `<ActivityFeed />`
- Scrollable list with left accent border
- Problem title + platform + difficulty
- Difficulty badges (Easy/Medium/Hard)
- Relative timestamps

#### `<BadgesGrid />`
**Locked vs Unlocked States:**
- **Unlocked**: Full color, glow effect, hover flip
- **Locked**: Grayscale, 50% opacity, progress bar

**Progress Bar Component:**
```javascript
<div className="progress-bar">
  <div className="progress-fill" style={{ width: `${progress}%` }} />
</div>
```

### 3. Leaderboard Components

#### `<LeaderboardControls />`
- Server dropdown selector
- Time period tabs (Weekly/Monthly/All-Time)
- Active tab underline glow

#### `<Top3Podium />`
**Visual Hierarchy:**
- **1st Place (Center)**: Tallest, gold glow (#F59E0B)
- **2nd Place (Left)**: Medium, silver glow (#94A3B8)
- **3rd Place (Right)**: Medium, bronze glow (#D97706)

**Card Structure:**
- Medal icon with glow
- Large avatar
- Username
- Problems solved (last 7 days)
- Top platform indicator
- "View Profile" button

#### `<RankingTable />`
- Alternating row backgrounds
- Current user row highlighted (electric blue border)
- Rank change arrows (↑ green, ↓ red, — gray)
- Hover glow effect

### 4. Settings Hub Components

#### `<BentoGrid />`
**Asymmetric Layout:**
```css
.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.card-large {
  grid-column: span 2;
}
```

#### `<ProfileAccountCard />` (Large)
- Avatar upload preview
- Visibility toggles (Public Profile, Show on Leaderboards)
- Sync All Platforms button
- Danger Zone: Delete Account

#### `<WidgetGeneratorCard />`
- Live widget preview
- Theme toggle (Light/Dark)
- Export buttons: SVG, PNG, Markdown
- Shareable profile link

#### `<PlatformConnectionsCard />`
- Mini list of 5 platforms
- Connection status indicators
- Last synced timestamp
- "Manage All" link

#### `<DocumentationCard />`
- Quick links with icons
- Discord invite button
- GitHub repository link

#### `<AdminPortalCard />` (Conditional)
- Only shown if user.role === 'admin'
- Purple/gold accent glow
- Admin functions list
- "Enter Admin Portal" CTA

## Micro-Animations

### Hover Effects
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
}
```

### Glow Pulse (for CTAs)
```css
@keyframes pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}
```

### Number Count-Up Animation
Use libraries like:
- `react-countup`
- `framer-motion` for value transitions

### Badge Flip Effect
```css
.badge-card:hover {
  transform: translateY(-4px) rotateY(5deg);
}
```

## Responsive Breakpoints

```css
/* Desktop: 1200px+ */
/* Tablet: 768px - 1199px */
@media (max-width: 1024px) {
  .two-column { grid-template-columns: 1fr; }
}

/* Mobile: < 768px */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero h1 { font-size: 2.5rem; }
}
```

## Interactivity States

### Button States
1. **Default**: Glassmorphic background
2. **Hover**: Lift (`translateY(-2px)`), enhanced glow
3. **Focus**: Visible outline with primary color
4. **Active**: Slight scale down (`scale(0.98)`)

### Platform Card States
1. **Connected**: Green badge, full opacity, hover glow
2. **Disconnected**: Red badge, reduced opacity, no hover glow
3. **Syncing**: Animated spinner, pulsing border

### Badge States
1. **Unlocked**: Full color, box-shadow glow, interactive
2. **Locked**: Grayscale filter, 50% opacity, progress bar
3. **Hover (Unlocked)**: Flip animation, reveal stats
4. **Hover (Locked)**: Shake animation, show unlock criteria

## Performance Optimizations

### For Heatmap (365 cells)
- Use `React.memo()` for individual cells
- Virtualize if rendering multiple years
- Throttle hover events

### For Leaderboard Table
- Implement virtual scrolling for 100+ rows
- Use `react-window` or `@tanstack/react-virtual`
- Paginate at 20-50 rows per page

### For Activity Feed
- Lazy load older activities
- Infinite scroll with intersection observer
- Cache recent activities in state

## Integration with Next.js App Router

### File Structure
```
app/
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx          // Dashboard
│   ├── leaderboard/
│   │   └── page.tsx          // Leaderboard
│   └── settings/
│       └── page.tsx          // Settings Hub
├── page.tsx                  // Landing Page
└── layout.tsx                // Root layout with nav

components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Badge.tsx
├── dashboard/
│   ├── ContributionHeatmap.tsx
│   ├── ActivityFeed.tsx
│   └── BadgesGrid.tsx
├── leaderboard/
│   ├── Top3Podium.tsx
│   └── RankingTable.tsx
└── settings/
    └── BentoGrid.tsx
```

### Example Component Conversion

**HTML Card:**
```html
<div class="platform-card">
  <div class="platform-name">LeetCode</div>
  <div class="platform-stat">487</div>
</div>
```

**React Component:**
```tsx
interface PlatformCardProps {
  name: string;
  username: string;
  problemsSolved: number;
  lastSynced: Date;
  isConnected: boolean;
}

export function PlatformCard({ 
  name, 
  username, 
  problemsSolved, 
  lastSynced, 
  isConnected 
}: PlatformCardProps) {
  return (
    <div className="platform-card">
      <div className="platform-header">
        <PlatformLogo name={name} />
        <h3>{name}</h3>
      </div>
      <p className="platform-username">@{username}</p>
      <div className="platform-stat">{problemsSolved}</div>
      <span className={cn(
        "platform-status",
        isConnected && "connected"
      )}>
        {isConnected ? '✓ Connected' : 'Disconnected'}
      </span>
    </div>
  );
}
```

## Styling Approach Options

### Option 1: Tailwind CSS (Recommended)
- Use provided color values in `tailwind.config.js`
- Custom backdrop-blur utilities
- JIT mode for dynamic values

### Option 2: CSS Modules
- Extract each card style into module
- Compose shared styles
- Maintain glassmorphism patterns

### Option 3: styled-components
- Theme provider with color system
- Dynamic props for states
- Keyframe animations

## Data Fetching Patterns

### Server Components (Next.js 14+)
```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const userData = await fetchUserData();
  const heatmapData = await fetchHeatmapData(userData.id);
  
  return (
    <>
      <ProfileHeader user={userData} />
      <ContributionHeatmap data={heatmapData} />
      <ActivityFeed userId={userData.id} />
    </>
  );
}
```

### Client Components (for Interactivity)
```tsx
'use client';

export function BadgesGrid({ initialBadges }: Props) {
  const [badges, setBadges] = useState(initialBadges);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  // Client-side filtering and interactions
}
```

## Testing Checklist

- [ ] All hover states work correctly
- [ ] Glassmorphism renders across browsers
- [ ] Heatmap cells are clickable and show tooltips
- [ ] Badges flip/shake on hover based on state
- [ ] Podium cards render in correct size order (1st tallest)
- [ ] Mobile navigation collapses properly
- [ ] Platform cards show connection status accurately
- [ ] Progress bars animate smoothly
- [ ] Leaderboard highlights current user row
- [ ] Settings Bento grid reflows responsively

## Accessibility Considerations

- Add ARIA labels to icon-only buttons
- Ensure keyboard navigation for all interactive elements
- Provide focus states with visible outlines
- Use semantic HTML (`<nav>`, `<main>`, `<section>`)
- Add alt text to all avatars and icons
- Ensure sufficient color contrast (WCAG AA)
- Announce dynamic content updates to screen readers

## Known Limitations & Future Enhancements

### Current Implementation
- Static data (no real API integration)
- Placeholder avatars (SVG with initials)
- Simulated heatmap data (random values)

### Recommended Enhancements
1. **Real-time Updates**: WebSocket for live leaderboard
2. **Animations**: Framer Motion for page transitions
3. **Charts**: Recharts for advanced data viz
4. **Notifications**: Toast system for actions
5. **Theme Toggle**: Light mode support
6. **Export**: PDF report generation
7. **Sharing**: Social media og:image generation

