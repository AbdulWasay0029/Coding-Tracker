# CodeSync 🚀

A highly professional, autonomous Discord bot designed to track and aggregate daily coding problem submissions across multiple platforms. Perfect for coding boot camps, academic clubs, and competitive programming communities.

## 🌟 Supported Platforms
- **LeetCode**
- **Codeforces**
- **CodeChef**
- **HackerRank**
- **SmartInterviews**

## 🏗️ Architecture (The Permanent Setup)
CodeSync has evolved from local `.bat` scripts into a robust, cloud-native application:
1. **Hosting**: Hosted 24/7 on **HeavenCloud** (Pterodactyl Panel) as a compiled Node.js bot. Uses `express` to bind a port and maintain a permanent "Online" status.
2. **Database**: Serverless PostgreSQL via **Neon**. This acts as the long-term memory for users' profiles, mapped platform usernames, and historical solved problems (preventing duplicate counting across multiple checks).
3. **Daily Automation**: A strictly scheduled **GitHub Actions** workflow (`daily-tracker.yml`) runs every day at 9:00 PM IST. It interacts directly with the database to generate a comprehensive daily report of all students and pushes it via Webhook to the `📊・daily-links` channel.

## 🛠️ Bot Commands
- `/setup` - Server administrators run this to configure the tracking channel and announcement channel.
- `/add-profile` - Users map their Discord account to their various coding platform usernames (and SmartInterviews JWT).
- `/remove-profile` - Users can unlink an incorrect mapping.
- `/list-profiles` - Confirms which platforms are currently mapped to the user.
- `/check [date]` - Manually generates a personal progress report for the current day (or a specific past date formatted as DD/MM/YYYY).
- `/help` - Displays the command list and usage.

## 💻 Local Development

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd coding-platform-tracker
   npm install
   ```

2. **Environment Variables**
   Ensure your `.env` contains:
   ```env
   DATABASE_URL="your-neon-postgres-url"
   DISCORD_BOT_TOKEN="your-discord-bot-token"
   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_GUILD_ID="your-discord-server-id"
   DISCORD_WEBHOOK_URL="your-channel-webhook-for-testing"
   ```

3. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Register Slash Commands** (Run once if you add/modify commands)
   ```bash
   npm run bot:deploy
   ```

5. **Run Locally**
   ```bash
   npm run dev
   ```

## ☁️ Deployment Guide (HeavenCloud / Pterodactyl)

Because `node_modules` containing developer tools can exceed free-tier disk limits (1GB), this bot should be **compiled locally before uploading**:

1. Compile the code:
   ```bash
   npm run build
   ```
2. Create a ZIP file containing ONLY:
   - `dist/` directory contents (`bot/`, `lib/`, `scripts/`)
   - `prisma/schema.prisma`
   - `package.json` (Ensure it is a "slim/production" version without devDependencies)
   - `.env`
3. Upload and extract to HeavenCloud.
4. On the HeavenCloud Startup tab, set `MAIN FILE` to `bot/index.js`.
5. Start the server (NPM will auto-install production dependencies, run `prisma generate`, and boot the `index.js` file).
