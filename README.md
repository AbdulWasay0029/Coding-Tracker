# 🚀 CodeSync — Coding Platform Tracker Bot

**CodeSync** is a Discord bot that tracks your competitive programming activity across **LeetCode**, **Codeforces**, **CodeChef**, and **SmartInterviews**, posting direct problem links on demand — right in your Discord server.

---

## ✨ Features

- 🤖 **Discord Bot** — slash commands, works from any device including mobile
- 👥 **Multi-user** — each person sets up their own accounts, results are isolated
- 🔁 **Re-check Button** — click to re-run a check without retyping the command
- 📅 **Date Filtering** — check today, yesterday, or any specific date (IST)
- 🔐 **SmartInterviews JWT support** — per-user token stored securely in DB
- ☁️ **Hosted on Railway** — runs 24/7, no laptop required

---

## 🛠️ Supported Platforms

| Platform | Status | Notes |
| :--- | :--- | :--- |
| **LeetCode** | ✅ Active | Full submission history |
| **Codeforces** | ✅ Active | Real-time monitoring |
| **CodeChef** | ✅ Active | Smart date parsing |
| **SmartInterviews** | 🔐 Token Required | JWT from browser DevTools |

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
| `/help` | Show this reference in Discord |

---

## 🚀 Setup Guide

### 1. Discord Bot

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications) → **New Application**
2. **Bot** tab → **Reset Token** → copy your `DISCORD_BOT_TOKEN`
3. **General Information** → copy **Application ID** → your `DISCORD_CLIENT_ID`
4. **OAuth2 → URL Generator**: scopes `bot` + `applications.commands`, permissions `Send Messages` + `Use Slash Commands` → invite to your server

### 2. Railway Hosting

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Add **PostgreSQL** plugin → Railway auto-injects `DATABASE_URL`
3. Set variables on your bot service:
   ```
   DISCORD_BOT_TOKEN=...
   DISCORD_CLIENT_ID=...
   DATABASE_URL=...   (auto-linked from Postgres plugin)
   ```
4. Deploy — Railway runs `prisma db push` then starts the bot

### 3. Register Slash Commands (once)

```bash
# Fill in .env first, then:
npx tsx bot/deploy-commands.ts
```

### 4. Use It

```
/add-profile platform:LeetCode username:yourname
/add-profile platform:SmartInterviews username:yourname token:eyJhbGci...
/check
```

---

## 🔐 SmartInterviews Token

Log in to SmartInterviews → **F12** → **Network** tab → any `/api/` request → copy the `authorization` header value (without the word `"Token "`).

Pass it as the `token` option in `/add-profile`. It's stored per-user in the database.

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
│   ├── platforms/            ← Platform scrapers (LeetCode, CF, CC, SI)
│   └── prisma.ts
├── prisma/
│   └── schema.prisma         ← PostgreSQL schema
└── railway.toml              ← Railway deployment config
```

---

*Optimizing for the best time complexity, in code and in life :D*
