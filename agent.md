# CodeSync Agent Context & Guidelines
*This file serves as the permanent memory bank for all future agent interactions.*

## 🎨 Design & Aesthetic Rules
- **Aesthetic Core**: CodeSync is a premium, high-performance tracking engine. We use a strict "gamified glassmorphism" aesthetic with vibrant accents against a dark/sleek background.
- **Discord Bot Colors**:
  - Success / Primary: **Premium Toxic Green** (`#10B981` / `0x10B981`)
  - Neutral / Information: **CodeSync Blue** (`#3B82F6` / `0x3B82F6`)
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
  - `/help`
- *Note: Setup and profile management slash commands are deprecated and redirect to the Web Dashboard.*

## 📋 Behavioral Guidelines
- **No Fake Features**: If an announcement hypes a feature (like "Badges"), ensure it is 100% physically implemented in the backend/frontend logic before trying to expose it to the bot. If it's fake, either build the engine fully or drop it entirely.
- **Project History**: Always keep `PROJECT_HISTORY.md` and `STORY.md` updated with the latest major feature additions, aesthetic overhauls, and bug fixes so the timeline of CodeSync is preserved.
- **Tool Discipline**: Always prioritize the most specific tools available (e.g. `view_file`, `grep_search`, `replace_file_content`) over generic terminal commands.

*Remember: Check this file at the start of every new session!*
