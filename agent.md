# CodeSync Agent Context & Guidelines
*This file serves as the permanent memory bank for all future agent interactions.*

## 🎨 Design & Aesthetic Rules
- **Aesthetic Core**: CodeSync is a premium, high-performance tracking engine. We use a strict "gamified glassmorphism" aesthetic with vibrant accents against a dark/sleek background.
- **Discord Bot Colors**:
  - Primary Brand Colors: **CodeSync Blue** (`#3B82F6` / `0x3B82F6`) & **Premium Toxic Green** (`#10B981` / `0x10B981`)
  - Warning / Empty: **Red** (`#EF4444` / `0xEF4444`)
- **Hierarchy**: Do NOT clutter Discord Embeds. Main stats and success messages go into large Embed Fields. Minor warnings (like API fetch failures) must be pushed gracefully to the **Embed Footer** to maintain the success aesthetic.
- **Utility First**: Always keep raw URLs explicitly visible and easily copyable for Auto-Reports, do not hide them completely behind markdown hyperlink text.

## 🤖 Bot Architecture
- **Tech Stack**: Discord.js, Prisma (SQLite/Postgres), Node-cron.
- **Security**: NEVER use global aggregations for Server/Guild commands. Always filter database queries by the current Discord Server's members using `interaction.guild.members.fetch()` -> `discordUserId: { in: guildMemberIds }`.
- **Active Slash Commands**:
  - `/check` (Daily sync)
  - `/leaderboard` (Weekly top 10 for the current server)
  - `/export-report` (Admin CSV)
  - `/refresh` (Admin force-sync for the current server)
  - `/list-profiles` (View linked accounts)
  - `/stats` (All-time Gamer Card for a user)
  - `/badges` (Displays gamification badges synced exactly with web dashboard logic)
  - `/compare` (Competitive VS card for two users)
  - `/help`
- *Note: Setup and profile management slash commands are deprecated and redirect to the Web Dashboard.*

## ☁️ Deployment & Environment
- **Heavon Cloud Deployments**: The production environment involves compiling the project via `tsc` into the `dist` directory and uploading ONLY the contents of `dist` to the cloud. Because of this, **never use `__dirname`** for resolving paths (especially `.env` files). Always use `process.cwd()` (e.g. `dotenv.config({ path: path.resolve(process.cwd(), '.env') })`) to ensure relative paths don't break between the `src` and `dist` environments.
- **Monorepo Separation (Vercel vs HeavonCloud)**: Vercel acts *strictly* as a frontend/API server and its build root is restricted to the `/web` folder. NEVER attempt to `import` or `require` code from the Discord bot (`../../src/...`) inside Next.js API routes; doing so crashes the Turbopack build because Vercel blocks traversing outside the defined root.
- **Database Message Queueing**: Since Vercel cannot invoke bot code directly, all background processing (like "Sync Profiles") must be offloaded by inserting a row into the `ScrapeJob` table. The HeavonCloud bot continuously polls this table (`src/jobs/worker.ts`) and executes the heavy scraping logic independently.
- **Environment Variable Syncing**: If a feature requires encryption/decryption (like the JWT `ENCRYPTION_KEY`), you MUST ensure that the exact same key is configured in *both* Vercel's Environment Variables dashboard AND HeavonCloud's `dist/.env` file. If they mismatch, Next.js encrypts data that the bot will permanently fail to decrypt (e.g., throwing `Token Expired!` or `ERR_OSSL_BAD_DECRYPT`).
- **Prisma Connection Exhaustion**: Never use `Promise.all` or `Promise.allSettled` to fire unbounded concurrent database upserts (`globalUpsertPromises`). This instantly exhausts Prisma's connection pool limit (throwing `P2024 Timeout`). Always execute large batches of database queries *sequentially* via a `for...of` loop or inside a `$transaction`.
- **Neon Database Cold Starts**: Neon Serverless Postgres goes to sleep after 5 minutes of inactivity on the free tier. The first query after sleep (like a cron job waking up) may take >5s, sometimes causing a `P1001 Can't reach database server` network timeout. Always wrap periodic cron jobs in `try/catch` blocks so they fail gracefully instead of crashing or flooding logs with massive node-cron stack traces.
- **Infrastructure Outages**: If the bot throws `ConnectTimeoutError` against `discord.com` entirely, do not rewrite code. HeavonCloud frequently experiences DDoS attacks on its free India/US nodes resulting in temporary total network drops. Validate infrastructure status before refactoring!
- **Discord Command Scope**: Registering slash commands globally (`Routes.applicationCommands`) takes 1-2 hours to propagate across Discord's CDN. Always deploy new commands instantly to the test server using Guild scope (`Routes.applicationGuildCommands`).
- **Rate Limiting Engine**: Any rate-limits (like the "1 per day" Force Sync) should utilize the unified `AnalyticsEvent` table (e.g. tracking `command: 'server_force_sync'`) to ensure that rate limits are shared seamlessly across both the Web Dashboard and Discord Bot.

## 📋 Behavioral Guidelines
- **No Fake Features**: If an announcement hypes a feature (like "Badges"), ensure it is 100% physically implemented in the backend/frontend logic before trying to expose it to the bot. If it's fake, either build the engine fully or drop it entirely.
- **Continuous Learning**: Put anything you just learned into this file immediately to make it a habit.
- **Project History**: Always keep `PROJECT_HISTORY.md` and `STORY.md` updated with the latest major feature additions, aesthetic overhauls, and bug fixes so the timeline of CodeSync is preserved.
- **Tool Discipline**: Always prioritize the most specific tools available (e.g. `view_file`, `grep_search`, `replace_file_content`) over generic terminal commands.

*Remember: Check this file at the start of every new session!*
