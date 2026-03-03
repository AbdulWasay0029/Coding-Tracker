# 🚀 CodeSync — Coding Platform Tracker Bot

**CodeSync** is a Discord bot that tracks your competitive programming activity across **LeetCode**, **Codeforces**, **CodeChef**, **HackerRank**, and **SmartInterviews**, posting direct problem links on demand.

---

## ✨ Features

- 🤖 **Discord Bot** — slash commands, works from any device including mobile
- 👥 **Multi-user** — each person sets up their own accounts, results are isolated
- 🔁 **Re-check Button** — click to re-run without retyping the command
- 📅 **Date Filtering** — today, yesterday, or any specific date (IST)
- 🔐 **SmartInterviews JWT support** — per-user token stored securely in DB
- 🖥️ **`.bat` fallback** — run manually from PC via webhook (no bot needed)

---

## 🛠️ Supported Platforms

| Platform | Auth Required | Notes |
| :--- | :--- | :--- |
| **LeetCode** | None | Public API |
| **Codeforces** | None | Public API |
| **CodeChef** | None | Public profile scraping |
| **HackerRank** | None | Public API |
| **SmartInterviews** | JWT token | See token guide below |

---

## 🤖 Bot Commands

| Command | Description |
| :--- | :--- |
| `/add-profile` | Add a platform account to track |
| `/remove-profile` | Remove a tracked account |
| `/list-profiles` | Show all your tracked accounts |
| `/check` | Today's solved problems (IST) |
| `/check when:yesterday` | Yesterday's problems |
| `/check date:2026-03-01` | Specific date (YYYY-MM-DD) |
| `/help` | Show command reference in Discord |

---

## 🚀 Deployment

### Option 1 — Railway (Hosted, $5/month)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Add **PostgreSQL** plugin → Railway auto-injects `DATABASE_URL`
3. Set `DISCORD_BOT_TOKEN` and `DISCORD_CLIENT_ID` in Variables tab
4. Railway uses `railway.toml` automatically — no extra config needed
5. Run `npx tsx bot/deploy-commands.ts` locally once to register slash commands

> Railway Hobby plan = $5/month flat fee. Bot uses ~$0.50 of actual compute. No surprise charges — Railway stops services before going over.

---

### Option 2 — Local `.bat` Fallback (PC only, Free)

For running a quick check from your PC without needing the hosted bot.

**Setup:**
1. Make sure `DATABASE_URL` in `.env` points to your cloud DB
2. Add your webhook URL to `.env`:
   ```
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```
   Get it from: Discord server → **Settings → Integrations → Webhooks → New Webhook → Copy URL**

**Usage:**
- Double-click `trigger_update.bat` → posts today's links to webhook
- Double-click `manual_trigger_ui.bat` → pick today / yesterday / custom date

> Requires your PC to be on. Reads profiles from the same DB the bot uses.

---

## 🔐 SmartInterviews Token

Log in to SmartInterviews → **F12** → **Network** tab → any `/api/` request → copy the `authorization` header value (without the word `"Token "`).

Pass it as the `token` option in `/add-profile`. Stored per-user in the database.

---

## 🏗️ Project Structure

```
coding-platform-tracker/
├── bot/
│   ├── index.ts              ← Bot entry point
│   ├── deploy-commands.ts    ← Run once to register slash commands
│   ├── tracker.ts            ← User-aware tracker logic
│   └── commands/
│       ├── add-profile.ts
│       ├── remove-profile.ts
│       ├── list-profiles.ts
│       ├── check.ts          ← /check + Re-check button
│       └── help.ts
├── lib/
│   ├── platforms/            ← Platform scrapers
│   │   ├── leetcode.ts
│   │   ├── codeforces.ts
│   │   ├── codechef.ts
│   │   ├── hackerrank.ts
│   │   └── smartinterviews.ts
│   └── prisma.ts
├── scripts/
│   └── quick-check.ts        ← .bat fallback script
├── prisma/
│   └── schema.prisma
├── railway.toml              ← Railway deployment config
├── trigger_update.bat        ← Quick bat: today's check
└── manual_trigger_ui.bat     ← Interactive bat: pick date
```

---

## 🌍 Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Railway auto-sets this) |
| `DISCORD_BOT_TOKEN` | ✅ | From Discord Developer Portal → Bot |
| `DISCORD_CLIENT_ID` | ✅ | From Discord Developer Portal → General |
| `DISCORD_WEBHOOK_URL` | `.bat` only | For local bat script fallback |
| `SMARTINTERVIEWS_TOKEN` | Optional | Fallback SI token (users supply their own) |

---

*Optimizing for the best time complexity, in code and in life :D*
