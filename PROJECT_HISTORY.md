# CodeSync: Project Evolution

## The Vision
**What it started as:** A localized Next.js web dashboard and batch scripting tool, designed for a single user to manually track daily coding submissions via local webhooks.

**What it became now:** A headless, high-performance, cloud-native Discord bot for entire communities. It features military-grade encryption, parallelized database clustering, in-memory caching, and fully autonomous scheduled tracking via external cron jobs.

---

## Chronological Evolution

### Phase 1: The Local Dashboard Era (Early February 2026)
*The project begins as a web dashboard and local scripting tool.*

In early February, the project was born out of a need to automate the tracking of coding platforms like LeetCode, Codeforces, and CodeChef. Originally, it was architected as a full web application. Users would spin up a local Next.js server and visit a dashboard in their browser to configure their usernames and Discord Webhooks. Original blueprints planned to use Vercel Cron jobs for scheduling, but this was quickly abandoned due to deployment complexities for a simple tracker.

Instead, the system shifted to a local-first approach relying on Windows `.bat` scripts tied directly to the Windows Task Scheduler. These scripts triggered a scraping engine that fetched the day's solved problems. A major challenge here was **timezone math**; custom logic had to be built to strictly convert UTC timestamps from varied APIs into "Indian Standard Time (IST) midnight-to-midnight" windows to prevent off-by-one daily errors.

During this phase, support for SmartInterviews was introduced. Because SmartInterviews lacked public API documentation, a custom solution was engineered by heavily inspecting network traffic. The hidden `POST /api/contest/allUserSubmissions` "Gold Mine" endpoint was uncovered, requiring users to dynamically extract a JWT token from their browser to securely tap into their protected submissions data.

### Phase 2: The Discord Bot Pivot (March 3, 2026)
*A massive architectural pivot. The web UI is destroyed in favor of an interactive Discord bot.*

By early March, it became clear that running a local web app and manual batch scripts was too clunky for a seamless, always-on experience. In a massive architectural overhaul, the entire web interface was completely scrapped. The rigid one-way webhook scripts were transformed into a headless, interactive, 24/7 autonomous Discord bot powered by `discord.js`.

The product was officially reborn as **CodeSync**. Instead of dealing with local webhooks, users could now asynchronously self-manage their profiles using Slash commands (`/check`, `/add-profile`) from any device. The database was migrated from a temporary local SQLite file to a permanent, clustered PostgreSQL database, transforming the project into a persistent community platform.

**UX Discoveries:** Early on, rendering 20+ solved problems simultaneously was physically lagging the Discord client UI. To fix this, the bot was updated to aggressively suppress native Discord link embeds by wrapping all scraped URLs in angle brackets. HackerRank support was also seamlessly integrated into this new architecture.

### Phase 3: Infrastructure Hardening & Automation (Mid-to-Late March 2026)
*Resolving tracking inaccuracies and moving to permanent cloud infrastructure.*

As the bot grew in usage within classroom environments, edge cases began to emerge:
- **CodeChef Deep-Scraping:** Highly active students testing edge cases were submitting so many "Wrong Answers" that their correct solutions were being pushed completely off the front page. The scraper engine was significantly upgraded to dynamically crawl up to 5 submission pages deep to guarantee accuracy.
- **JWT Token Decoding:** Students were failing the onboarding process because of simple casing typos in their usernames. A native decoder was built to dynamically extract the true `username` out of the base64 JWT token claims, bypassing human casing mismatch errors entirely.

The deployment of the bot also went through an evolution. After briefly experimenting with various cloud hosts like Railway and Fly.io, the infrastructure settled permanently on HeavenCloud for isolated runtime performance. 

**Stateless UI & Automation:** To decouple heavy scraping tasks from the interface's memory, interactive components were made stateless. "Re-check" buttons dynamically encoded ISO timestamps straight into the payload so they could survive bot restarts seamlessly. For automation, Node.js `setInterval` loops were removed as they were brittle and crashed the bot during heavy sweeps. This was replaced by a **GitHub Actions** cron job to silently scrape students with organic HTTP padding limits, triggering the Discord batch report effortlessly.

### Phase 4: Production Scaling & Security (Late March - April 2026)
*Refactoring for extreme performance, security, and Discord UX.*

Entering late March, the project reached its "V3" milestone, focusing heavily on enterprise-grade hardening:
- **Military-Grade Security:** The system recognized that SmartInterviews JWT tokens were highly sensitive. An AES-256 encryption layer was built directly into the database pipeline using Node's native `crypto` library, ensuring that user tokens were strictly encrypted at rest and only decrypted purely on-the-fly in memory.
- **API Protection:** To prevent enthusiastic users from spamming the `/check` command and getting the bot IP-banned by coding platforms, a lightweight in-memory caching layer was introduced. Consecutive identical requests resolve instantly from RAM in 0ms.
- **High-Performance Architecture:** As the database grew, tracking loops began to experience noticeable lag (up to 4 seconds). The database write operations were fundamentally decoupled using parallel `Promise.allSettled` clusters. This brought the data-saving latency down to near baseline, providing a lightning-fast UI experience in Discord.
- **Graceful Error Handling:** Instead of crashing the bot or failing silently when a user's token expired or an API went down, the system was upgraded to gracefully catch timeouts or 401 errors. It now surfaces elegant, non-intrusive warnings directly within the Discord UI via native subtext (`-#`), empowering users to safely resolve their own credential issues.

### Phase 5: Dynamic Scaling & External Automation (Mid-May 2026)
*Refining scraper efficiency and optimizing scheduled triggers.*

As the bot continued to scale, the hardcoded pagination limits in platform scrapers (like CodeChef) were replaced with dynamic date-based loops. Scrapers now intelligently crawl backwards and stop early exactly when they hit submissions older than the target window (up to a strict max limit of 30 days), drastically reducing unnecessary network calls. 

Additionally, the automated nightly trigger was completely migrated away from GitHub Actions' internal cron scheduling—which often suffered from severe queueing delays—to an external, highly reliable trigger via **cron-job.org**, ensuring the daily tracker runs precisely on time.

### Phase 6: The Web Dashboard Rebirth & Global Scale (Late May 2026)
*Coming full circle to a premium web interface and opening the bot to the public.*

As the bot scaled, managing complex platform tokens via Discord slash commands became a UX bottleneck. The project came full circle with the launch of a premium Next.js Web Dashboard. Built with a sleek, dark-mode "Neon UI" aesthetic, it featured smooth 3D CSS isometric tilts, custom scalable SVG favicons, and seamless Discord OAuth integration. 

Users could now securely manage their platform profiles via server-side API routes on the web, which instantly synced with the Discord bot's clustered PostgreSQL database. To support this massive expansion, the Discord bot's architecture was updated to deploy its slash commands globally. Instead of being locked to a single test server, anyone could now visit the website, click "Add to Discord", and instantly bring automated competitive programming leaderboards to their own community.

### Phase 7: The Competitive Hub (Late May 2026)
*Integrating live contest scheduling to keep developers informed.*

CodeSync evolved beyond just tracking past performances; it began anticipating the future. A completely autonomous contest reminder system was introduced. Instead of relying on unreliable 3rd-party aggregators, the bot was engineered to mathematically predict LeetCode and CodeChef schedules statically, while dynamically polling the official Codeforces API via a lightweight, internal `node-cron` process. This allowed server admins to configure specific channels and roles to receive premium, timezone-aware Discord countdowns for global contests.

### Phase 8: Enterprise Architecture & User Apps (CodeSync v4)
As CodeSync transitioned from a successful MVP to a scalable product, the backend was completely restructured into an enterprise-grade modular architecture. Discord's new "User Installable Apps" feature was fully embraced, allowing users to install CodeSync directly to their personal accounts and take their slash commands anywhere. The onboarding flow was rewritten to feature zero-friction Direct Messaging, and a fully gamified Contribution Graph was deployed to the Web Dashboard alongside a powerful Server Admin Portal.

### Phase 9: Settings Hub & UX Overhaul (June 2026)
*Refining the visual identity and centralizing user controls.*

As feature bloat threatened the user experience, the entire web dashboard was restructured using modern "Paraflow" dark-mode aesthetics. The fragmented pages were unified into a single, powerful Settings Hub with URL-persisted tabs for Profiles, Privacy, Admin configurations, and Documentation.

To support gamification, a dedicated Badges page was implemented, tying directly into the backend `solvedAt` timestamps to dynamically award users for 7-day streaks, total solved milestones, and late-night coding sessions. Privacy controls were also expanded, introducing a `UserSettings` database model to allow developers to toggle their leaderboard visibility securely. The focus shifted entirely to making the platform feel like a premium, polished enterprise product.
