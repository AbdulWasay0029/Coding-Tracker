# 🚀 CodingPlatformTracker — Professional Redevelopment Plan

> **From:** A Discord bot that scrapes coding profiles and posts links
> **To:** A full SaaS platform for competitive programming accountability, analytics, and team management

---

## 📊 Current State Assessment

### What Exists Today
| Component | Status | Quality |
|---|---|---|
| 5 platform scrapers (LeetCode, Codeforces, CodeChef, HackerRank, SmartInterviews) | ✅ Working | Solid — well-structured, handles edge cases |
| Discord bot with slash commands (`/check`, `/add-profile`, etc.) | ✅ Working | Good — clean command architecture |
| PostgreSQL + Prisma ORM | ✅ Working | Minimal — only 2 tables (`UserProfile`, `SolvedProblem`) |
| [.bat](file:///c:/Users/guper/.gemini/antigravity/scratch/CodingPlatformTracker/coding-platform-tracker/trigger_update.bat) script fallback for local use | ✅ Working | Hacky but functional |
| Railway deployment | ✅ Working | Basic — single process, no scaling |
| Web UI (Next.js) | ❌ Unused | Package.json has it but no pages exist |

### Core Strengths to Preserve
1. **The scraping engine is genuinely good** — handles pagination (CodeChef 5-page), JWT auth (SmartInterviews), GraphQL (LeetCode), and deduplication
2. **Multi-platform aggregation** is the real value prop — nobody else does all 5 in one place
3. **Discord-native** fits the target audience (CS students/competitive programmers live in Discord)

### Critical Weaknesses
1. **No web dashboard at all** — Next.js is installed but zero pages exist
2. **No authentication system** — users are identified only by Discord snowflake IDs
3. **No analytics/insights** — just raw links, no trends, streaks, or progress tracking
4. **No team/group features** — can't compare with classmates or track a team
5. **No monetization infrastructure** — no payment, no tiers, no rate limiting
6. **No API layer** — scrapers are tightly coupled to bot commands
7. **No caching** — every `/check` re-scrapes all platforms from scratch
8. **No tests** — zero test coverage
9. **No observability** — console.log only, no structured logging or error tracking

---

## 🏗️ Architecture Redesign

### Current Architecture
```
Discord Bot → Scraper Functions → PostgreSQL
  (that's it)
```

### Proposed Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  Discord Bot  │  Web Dashboard  │  Mobile (PWA)  │  API     │
└──────┬────────┴───────┬─────────┴───────┬────────┴────┬─────┘
       │                │                 │             │
       ▼                ▼                 ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Next.js API Routes)          │
│  Auth · Rate Limiting · Tier Enforcement · Request Logging   │
└──────────────────────────┬──────────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐  ┌────────────────┐  ┌────────────────────┐
│ Scraping      │  │ Analytics      │  │ User Management    │
│ Engine        │  │ Engine         │  │ & Billing          │
│ (Job Queue)   │  │ (Aggregation)  │  │ (Stripe + Auth)    │
└──────┬───────┘  └───────┬────────┘  └────────┬───────────┘
       │                  │                     │
       ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  PostgreSQL (primary) · Redis (cache + jobs) · S3 (exports)  │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack (Final)
| Layer | Technology | Why |
|---|---|---|
| Frontend | **Next.js 16 (App Router)** | Already in package.json, SSR + API routes in one |
| Auth | **NextAuth.js** with Discord OAuth + Email/Password | Users already have Discord; email for non-Discord users |
| Database | **PostgreSQL** (keep) + **Redis** (add) | Prisma stays; Redis for caching & job queues |
| Job Queue | **BullMQ** (Redis-backed) | Scheduled scraping, not on-demand every time |
| Payments | **Stripe** | Industry standard, great API, handles subscriptions |
| Deployment | **Railway** (keep) or **Vercel + Railway** split | Vercel for web, Railway for bot + workers |
| Monitoring | **Sentry** + structured logging | Error tracking, performance monitoring |
| Email | **Resend** | Transactional emails (daily digests, billing) |

---

## 🎨 Web Dashboard — Feature Breakdown

### Phase 1: Core Dashboard (MVP)

#### 1.1 Landing Page / Marketing Site
- Hero section explaining the product
- Platform logos (LeetCode, Codeforces, etc.)
- Pricing table
- Testimonials / social proof
- "Sign in with Discord" CTA

#### 1.2 User Dashboard
- **Today's Activity Feed** — same data as `/check` but beautiful, with:
  - Problem cards showing title, platform icon, difficulty badge, direct link
  - Grouped by platform with collapsible sections
  - Timestamp of when solved
- **Streak Tracker** — GitHub-style contribution heatmap
  - Shows daily solve count across all platforms
  - Current streak counter prominently displayed
  - Longest streak record
- **Weekly/Monthly Summary Cards**
  - Total problems solved
  - Platform breakdown (pie chart)
  - Difficulty distribution
  - Comparison vs. previous period (↑12% this week)
- **Profile Management**
  - Add/remove platform usernames (same as Discord `/add-profile` but with a UI)
  - Platform connection status indicators (green ✓ / red ✗)
  - Token management for SmartInterviews (with secure input + expiry warning)

#### 1.3 History & Search
- Searchable table of all solved problems
- Filter by: platform, date range, difficulty
- Sort by: date, platform, title
- Export to CSV / PDF

### Phase 2: Social & Team Features

#### 2.1 Teams / Groups
- Create a "Team" (class, study group, company)
- Invite members via link or Discord server sync
- **Team Leaderboard** — ranked by:
  - Daily solve count
  - Weekly streak
  - Total problems
  - Custom scoring formula (admin-configurable)
- **Team Activity Feed** — see what your teammates solved in real-time
- Admin panel for team owners (manage members, set goals)

#### 2.2 Challenges & Goals
- **Daily Goals** — "Solve at least 2 problems today" with notifications
- **Team Challenges** — "First to solve 50 problems this month wins"
- **Streak Challenges** — maintain a streak for X days
- Push notifications (web + Discord DM) for goal reminders

#### 2.3 Comparison View
- Head-to-head comparison between two users
- "Who solved more this week?" with visual charts
- Fun rivalry system (optional gamification)

### Phase 3: Intelligence & Premium Features

#### 3.1 Smart Insights (AI-Powered)
- **Weak Topic Detection** — "You haven't solved any Graph problems in 3 weeks"
- **Problem Recommendations** — based on what you've solved + difficulty progression
- **Optimal Practice Schedule** — suggest which platform to focus on today
- **Interview Readiness Score** — based on topic coverage + difficulty distribution

#### 3.2 Automated Reports
- **Daily Digest Email** — morning summary of yesterday's activity
- **Weekly Report** — PDF emailed every Monday with charts
- **Manager/Mentor View** — share a read-only dashboard link with your mentor

#### 3.3 Integrations
- **GitHub contribution sync** — show coding activity alongside CP activity
- **Google Calendar** — block practice time, show solve events
- **Notion** — export problem logs to a Notion database
- **Slack** — for workplace teams that don't use Discord

---

## 💳 Monetization & Pricing Strategy

### Tier Structure

| Feature | **Free** | **Pro** ($5/mo) | **Team** ($12/mo per seat) | **Enterprise** (Custom) |
|---|:---:|:---:|:---:|:---:|
| Platform connections | 2 | 5 (all) | 5 (all) | Unlimited + custom |
| Daily check (Discord + Web) | ✅ | ✅ | ✅ | ✅ |
| Contribution heatmap | 30 days | Full history | Full history | Full history |
| Problem history | 7 days | Unlimited | Unlimited | Unlimited |
| Daily digest email | ❌ | ✅ | ✅ | ✅ |
| Weekly PDF reports | ❌ | ✅ | ✅ | ✅ |
| Export (CSV/PDF) | ❌ | ✅ | ✅ | ✅ |
| Teams | ❌ | 1 team (5 members) | Unlimited teams | Unlimited |
| Team leaderboards | ❌ | ❌ | ✅ | ✅ |
| Challenges & Goals | Basic (1 active) | Unlimited | Unlimited | ✅ |
| AI Insights | ❌ | ❌ | ✅ | ✅ |
| API access | ❌ | 100 req/day | 1000 req/day | Unlimited |
| Custom integrations | ❌ | ❌ | ❌ | ✅ |
| Priority support | ❌ | ❌ | ✅ | Dedicated |
| SSO / SAML | ❌ | ❌ | ❌ | ✅ |
| Whitelabel | ❌ | ❌ | ❌ | ✅ |

### Revenue Projections (Conservative)
- **Target:** Competitive programming students + bootcamp organizers + CS professors
- **TAM:** ~500K active competitive programmers globally (LeetCode alone has 3M+ users)
- **Realistic Year-1 Goal:** 500 Pro + 50 Team seats = **$2,500 + $600 = $3,100/mo MRR**

### Why Users Would Pay
1. **Pro users** — serious LeetCode grinders who want streak tracking, history, and daily digests across platforms. $5/mo is nothing compared to LeetCode Premium ($35/mo)
2. **Team leads** — CS professors, bootcamp managers, study group leaders who need visibility into their cohort's practice habits. This doesn't exist anywhere else
3. **Enterprise** — coding bootcamps (100+ students) who want branded dashboards and custom integrations

---

## ⚡ Rate Limiting Strategy

### Per-Tier API Limits

| Tier | Requests/min | Requests/day | Concurrent scrapes | Webhook events/day |
|---|---|---|---|---|
| Free | 10 | 100 | 1 | 5 |
| Pro | 30 | 1,000 | 3 | Unlimited |
| Team | 60 | 5,000 | 5 | Unlimited |
| Enterprise | Custom | Custom | Custom | Custom |

### Implementation
- **Redis-backed sliding window** rate limiter on API Gateway
- **Token bucket** algorithm for burst tolerance
- Rate limit headers in every response (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)
- Graceful 429 responses with `Retry-After` header
- Discord bot rate limiting per-user (prevent abuse even on free tier)

### Scraping Rate Limits (Internal)
- **Debounce** — if the same user's same platform was scraped < 5 min ago, serve from cache
- **Queue priority** — paid users' scrape jobs run first
- **Platform-specific cooldowns** — respect each platform's rate limits to avoid IP bans
- **Distributed scraping** — rotate outbound IPs for high-volume (Enterprise tier)

---

## 🗄️ Database Schema Redesign

```prisma
// ─── Authentication ─────────────────────────────────────
model User {
  id              String    @id @default(cuid())
  email           String?   @unique
  name            String?
  avatarUrl       String?
  discordId       String?   @unique
  stripeCustomerId String?  @unique
  tier            Tier      @default(FREE)
  
  profiles        PlatformProfile[]
  solvedProblems  SolvedProblem[]
  teamMembers     TeamMember[]
  goals           Goal[]
  apiKeys         ApiKey[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum Tier {
  FREE
  PRO
  TEAM
  ENTERPRISE
}

// ─── Platform Connections ───────────────────────────────
model PlatformProfile {
  id          String    @id @default(cuid())
  userId      String
  platform    Platform
  username    String
  token       String?   // encrypted at rest
  isValid     Boolean   @default(true) // false if auth fails
  lastSynced  DateTime?
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, platform, username])
}

enum Platform {
  LEETCODE
  CODEFORCES
  CODECHEF
  HACKERRANK
  SMARTINTERVIEWS
  GITHUB           // future
}

// ─── Solved Problems ────────────────────────────────────
model SolvedProblem {
  id          String    @id @default(cuid())
  userId      String
  platform    Platform
  problemId   String
  title       String
  difficulty  String?   // "Easy", "Medium", "Hard" (where available)
  topics      String[]  // ["Array", "DP", "Graph"] (where available)
  url         String
  solvedAt    DateTime
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, platform, problemId])
  @@index([userId, solvedAt])
  @@index([userId, platform])
}

// ─── Teams ──────────────────────────────────────────────
model Team {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  ownerId     String
  discordGuildId String?   // auto-sync team with Discord server
  maxMembers  Int          @default(5)
  
  members     TeamMember[]
  challenges  Challenge[]
  
  createdAt   DateTime     @default(now())
}

model TeamMember {
  id      String   @id @default(cuid())
  teamId  String
  userId  String
  role    TeamRole @default(MEMBER)
  
  team    Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user    User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([teamId, userId])
}

enum TeamRole {
  OWNER
  ADMIN
  MEMBER
}

// ─── Goals & Challenges ────────────────────────────────
model Goal {
  id          String    @id @default(cuid())
  userId      String
  type        GoalType
  target      Int       // e.g., solve 3 problems
  period      String    // "daily", "weekly", "monthly"
  isActive    Boolean   @default(true)
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum GoalType {
  SOLVE_COUNT
  STREAK_DAYS
  PLATFORM_SPECIFIC
}

model Challenge {
  id          String    @id @default(cuid())
  teamId      String
  title       String
  description String?
  startDate   DateTime
  endDate     DateTime
  target      Int
  
  team        Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
}

// ─── API Keys (for programmatic access) ─────────────────
model ApiKey {
  id          String    @id @default(cuid())
  userId      String
  key         String    @unique
  name        String
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─── Billing Events (Stripe webhook log) ────────────────
model BillingEvent {
  id              String   @id @default(cuid())
  stripeEventId   String   @unique
  type            String   // "invoice.paid", "subscription.updated", etc.
  userId          String?
  data            Json
  processedAt     DateTime @default(now())
}
```

---

## 🔨 Implementation Phases & Timeline

### Phase 0: Foundation (Week 1-2) — "Clean Room"
> [!IMPORTANT]
> Everything below builds on this. Don't skip steps.

- [ ] **Decouple scraping engine** from bot commands into standalone service layer
  - `services/scraper.ts` — pure functions, no Discord dependency
  - `services/analytics.ts` — aggregation, streak calculation
  - `services/user.ts` — user management CRUD
- [ ] **Migrate schema** — run Prisma migrations from old 2-table → new schema
- [ ] **Add Redis** — install `ioredis` + `bullmq`, configure cache layer
- [ ] **Add auth** — NextAuth.js with Discord OAuth provider
- [ ] **Set up Next.js App Router** — layout, middleware, route groups
- [ ] **Structured logging** — replace all `console.log` with `pino` or `winston`
- [ ] **Environment config** — proper env validation with `zod`
- [ ] **Testing foundation** — Vitest setup, first scraper unit tests

### Phase 1: Web Dashboard (Week 3-5) — "The Product"
- [ ] Landing page (marketing, pricing, CTA)
- [ ] Auth flow (sign in → onboard → connect platforms)
- [ ] Dashboard home (today's solves, streak, weekly stats)
- [ ] Problem history page (searchable table)
- [ ] Contribution heatmap component
- [ ] Profile settings (manage platforms, account)
- [ ] **Polish the Discord bot** to link to web dashboard
- [ ] Responsive design (mobile-first PWA)

### Phase 2: Monetization (Week 6-7) — "The Revenue"
- [ ] Stripe integration (checkout, portal, webhooks)
- [ ] Tier enforcement middleware
- [ ] Rate limiting middleware (Redis sliding window)
- [ ] Billing settings page (subscribe, manage, cancel)
- [ ] Free tier limitations enforcement
- [ ] Usage dashboard (API calls remaining, etc.)

### Phase 3: Teams & Social (Week 8-10) — "The Moat"
- [ ] Team CRUD (create, invite, manage)
- [ ] Team leaderboard with real-time updates
- [ ] Team activity feed
- [ ] Goals & challenges system
- [ ] Notification system (Discord DM + email + web push)
- [ ] Comparison view (head-to-head)

### Phase 4: Intelligence (Week 11-13) — "The Premium"
- [ ] Daily digest email (Resend integration)
- [ ] Weekly PDF report generation
- [ ] Topic/difficulty analysis engine
- [ ] AI-powered recommendations (Gemini API)
- [ ] Export functionality (CSV, PDF, Notion API)
- [ ] Public profile pages (shareable link)

### Phase 5: Scale & Harden (Week 14+) — "Production Grade"
- [ ] Sentry error tracking
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Database backups + disaster recovery
- [ ] CDN for static assets
- [ ] SEO optimization for public profiles
- [ ] Legal (Terms of Service, Privacy Policy)

---

## 📈 Key Metrics to Track

| Metric | Why |
|---|---|
| **DAU / MAU** | Core engagement — are people checking daily? |
| **Streak retention** | Users with streaks churn less |
| **Free → Pro conversion rate** | Monetization health (target: 5-8%) |
| **Team creation rate** | Viral coefficient — teams bring more users |
| **API usage per tier** | Rate limit calibration |
| **Scraper success rate** | Core reliability — if scrapers break, product is dead |
| **MRR** | Revenue |
| **Churn rate** | Monthly, per tier |

---

## 🎯 Competitive Advantage (Why This Wins)

1. **Nobody aggregates all 5 platforms** — LeetCode has its own stats, Codeforces has its own, but nobody shows you YOUR day across all of them in one place
2. **Discord-native** — the audience lives there. Web dashboard is a bonus, not a replacement
3. **Team accountability** — professors and bootcamp managers have no tool for this today. They literally ask students to screenshot their profiles. This replaces that workflow entirely
4. **Low price vs. value** — $5/mo vs. LeetCode Premium $35/mo. Easy upsell
5. **The scrapers are hard to build** — CodeChef HTML scraping, SmartInterviews JWT juggling, multi-page pagination. This is a real technical moat — new competitors need months to replicate

---

## ⚠️ Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Platform APIs change/break | 🔴 Critical | Automated health checks, Sentry alerts, graceful degradation |
| IP rate-limiting/banning by platforms | 🔴 Critical | Caching (5-min debounce), rotating proxies for Enterprise |
| SmartInterviews JWT expiry | 🟡 Medium | Token refresh reminders, expiry detection + user notification |
| Low initial adoption | 🟡 Medium | Free tier is generous, Discord bot is free to use, virality through teams |
| Stripe payment failures | 🟢 Low | Dunning emails, grace period before downgrade |
| GDPR/data privacy | 🟡 Medium | Only store what's needed, user data export/delete, privacy policy |

---

## 🏁 Summary: What Makes This "Industry Standard"

| Aspect | Current | After Redevelopment |
|---|---|---|
| **Product** | Discord bot only | Full SaaS (Web + Discord + API + PWA) |
| **Auth** | Discord ID | OAuth + Email + API Keys |
| **Data** | Links dumped in chat | Analytics, heatmaps, trends, insights |
| **Social** | Single-user | Teams, leaderboards, challenges |
| **Revenue** | $0 | Stripe subscriptions, 4-tier pricing |
| **Scale** | Single Railway process | Queue-based workers, Redis cache, CDN |
| **Reliability** | `console.log` | Sentry, structured logging, health checks |
| **Testing** | None | Unit + Integration + E2E |
| **DX** | Manual deploy | CI/CD, env validation, type safety |

> The core idea — "show me what I solved today across all platforms" — is genuinely useful. The redevelopment doesn't change the idea; it builds a real business around it.
