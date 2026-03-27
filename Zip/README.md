# CodeSync

A Discord bot that tracks students' daily competitive programming activity across five platforms and posts all links automatically every night — no manual effort needed.

---

## Architecture

```
Neon PostgreSQL (Free Forever)
    ↕               ↕
HeavenCloud Bot    GitHub Actions (Nightly)
/add-profile       Runs every night at 9 PM IST
/check             Posts ALL students' links to Discord
/setup             No one needs to do anything manually
/help
```

---

## Platforms

| Platform | Method | Notes |
|---|---|---|
| LeetCode | Public API | No auth required |
| Codeforces | Public API | No auth required |
| CodeChef | HTML scraping | Fetches up to 5 pages to filter out WA spam |
| HackerRank | Public API | No auth required |
| SmartInterviews | JWT auth | Per-user token, stored securely in DB |

---

## Bot Commands

| Command | Who | Description |
|---|---|---|
| `/add-profile` | Students | Register a platform account |
| `/remove-profile` | Students | Remove a tracked profile |
| `/list-profiles` | Students | View all your registered accounts |
| `/check` | Students | View today's solved problems, grouped by platform |
| `/check when:yesterday` | Students | Yesterday's problems |
| `/check date:2026-03-01` | Students | Any specific date |
| `/setup` | Admins only | Configure welcome channel and daily reminder channel |
| `/help` | Everyone | Full command reference |

---

## Stack

**TypeScript · Node.js · PostgreSQL (Neon) · discord.js · Prisma · GitHub Actions**

---

## Deployment

### 1. Database — Neon (Free Forever)
1. Go to [neon.tech](https://neon.tech) → Create account (no card needed)
2. Create a new project → Copy the `DATABASE_URL`
3. Run `npx prisma db push` locally to create tables

### 2. Bot — HeavenCloud (Free)
1. Go to [heavencloud.in](https://heavencloud.in) → Create account (no card needed)
2. Create server → Select **Node.js 20**
3. Set environment variables (see table below)
4. Upload a ZIP of this project (exclude `node_modules`)
5. Set startup command: `npm run bot:setup`
6. Register slash commands once (run locally):
   ```bash
   npx tsx bot/deploy-commands.ts
   ```

### 3. Auto-Tracker — GitHub Actions
- Runs every night at 9 PM IST automatically
- Posts all students' daily links to your Discord webhook
- Workflow file: `.github/workflows/daily-tracker.yml`
- No setup needed beyond adding GitHub Secrets (see below)

---

## Environment Variables

| Variable | Required For | Description |
|---|---|---|
| `DATABASE_URL` | Bot + GitHub Actions | Neon PostgreSQL connection string |
| `DISCORD_BOT_TOKEN` | Bot | From Discord Developer Portal → Bot |
| `DISCORD_CLIENT_ID` | Bot | From Discord Developer Portal → General |
| `DISCORD_GUILD_ID` | Local deploy only | Your server ID for instant command registration |
| `DISCORD_WEBHOOK_URL` | GitHub Actions | Webhook URL for nightly auto-post |

> **Note**: Set these as **Secrets** in HeavenCloud (under Environment tab) and as **Repository Secrets** in GitHub (Settings → Secrets and variables → Actions). Never commit these to git.

---

## SmartInterviews Token Setup

1. Login to [hive.smartinterviews.in](https://hive.smartinterviews.in)
2. Press **F12** → open the **Network** tab
3. Refresh the page (**F5**) and search for `populateProfile` in the filter
4. Click that request → **Headers** tab
5. Find the `authorization` header → copy the value starting with `ey...`
6. Paste this when running `/add-profile` for SmartInterviews

---

## Project Structure

```
├── bot/
│   ├── index.ts                  # Entry point + health check server
│   ├── deploy-commands.ts        # Run once to register slash commands
│   ├── tracker.ts                # Core tracking + grouping logic
│   └── commands/
│       ├── add-profile.ts        # /add-profile
│       ├── remove-profile.ts     # /remove-profile
│       ├── list-profiles.ts      # /list-profiles
│       ├── check.ts              # /check + re-check + copy-links buttons
│       ├── setup.ts              # /setup (admins only)
│       └── help.ts               # /help
├── lib/
│   ├── platforms/
│   │   ├── leetcode.ts
│   │   ├── codeforces.ts
│   │   ├── codechef.ts
│   │   ├── hackerrank.ts
│   │   └── smartinterviews.ts
│   └── prisma.ts                 # Prisma client singleton
├── scripts/
│   └── quick-check.ts            # Local CLI runner (uses config.json)
├── .github/
│   └── workflows/
│       └── daily-tracker.yml     # Nightly GitHub Actions workflow
├── prisma/
│   └── schema.prisma
├── codesync.bat                  # Windows shortcut for local quick-check
└── config.json                   # Local profiles config (not committed)
```

---

## Discord Server Channel Setup

```
📂 CODESYNC
  📌 #cs-how-to-use     ← Pinned setup instructions
  🤖 #cs-commands       ← Where students run bot commands
  📊 #cs-daily-links    ← GitHub Actions posts here nightly (read-only)
```

---

*Optimizing for the best time complexity, in code and in life.*
