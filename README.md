# Coding Tracker

A Discord bot that aggregates your daily competitive programming activity across five platforms into a single command. Built because manually tracking solved problems across LeetCode, Codeforces, CodeChef, HackerRank, and SmartInterviews every day gets old fast.

---

## What it does

Run `/check` in Discord → get a list of every problem you solved today, with direct links, grouped by platform. Works on mobile. Supports date filtering. Handles multiple users independently.

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

## Commands

| Command | Description |
|---|---|
| `/add-profile` | Register a platform account |
| `/remove-profile` | Remove a tracked account |
| `/list-profiles` | View all your registered accounts |
| `/check` | Today's solved problems (IST) |
| `/check when:yesterday` | Yesterday's problems |
| `/check date:2026-03-01` | Any specific date |
| `/help` | Command reference |

---

## Stack

**TypeScript · Node.js · PostgreSQL · discord.js · Prisma**

---

## Deployment

### Option 1 — Railway (Recommended)

1. Fork this repo
2. Connect to [Railway](https://railway.app) → New Project → Deploy from GitHub
3. Add the **PostgreSQL** plugin — Railway auto-injects `DATABASE_URL`
4. Set environment variables (see table below)
5. Register slash commands once:
   ```bash
   npx tsx bot/deploy-commands.ts
   ```

Railway Hobby plan runs ~$5/month flat. Actual compute usage is under $0.50.

### Option 2 — Local `.bat` fallback (Windows, free)

For a quick manual check from your PC without the hosted bot:

1. Set `DISCORD_WEBHOOK_URL` in `.env`
2. Run `trigger_update.bat` → posts today's links to webhook
3. Run `manual_trigger_ui.bat` → pick a date interactively

Requires your PC to be on. Reads from the same DB the bot uses.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DISCORD_BOT_TOKEN` | ✅ | From Discord Developer Portal → Bot |
| `DISCORD_CLIENT_ID` | ✅ | From Discord Developer Portal → General |
| `DISCORD_WEBHOOK_URL` | `.bat` only | For local fallback script |
| `SMARTINTERVIEWS_TOKEN` | Optional | Fallback SI token (users supply their own via `/add-profile`) |

---

## SmartInterviews Token Setup

Log into SmartInterviews → F12 → Network tab → any `/api/` request → copy the `authorization` header value (exclude the `"Token "` prefix). Pass it as the `token` option when running `/add-profile`.

---

## Project Structure

```
├── bot/
│   ├── index.ts                  # Entry point
│   ├── deploy-commands.ts        # Run once to register slash commands
│   ├── tracker.ts                # Core tracking logic
│   └── commands/
│       ├── add-profile.ts
│       ├── remove-profile.ts
│       ├── list-profiles.ts
│       ├── check.ts              # /check + re-check button handler
│       └── help.ts
├── lib/
│   ├── platforms/
│   │   ├── leetcode.ts
│   │   ├── codeforces.ts
│   │   ├── codechef.ts
│   │   ├── hackerrank.ts
│   │   └── smartinterviews.ts
│   └── prisma.ts
├── scripts/
│   └── quick-check.ts            # .bat fallback script
├── prisma/
│   └── schema.prisma
├── railway.toml
├── trigger_update.bat
└── manual_trigger_ui.bat
```

---

*Optimizing for the best time complexity, in code and in life.*
