# Coding Platform Tracker (CodeSync)

Automated tracking for **LeetCode**, **Codeforces**, and **CodeChef** solved problems. Notifies you daily on **Discord** with links to the problems you solved that day.

## Features
- 🕒 **Daily Updates**: Checked automatically at **11 PM IST**.
- 🧹 **Clean Notifications**: Sends **only the links** of solved problems.
- 📆 **Daily Filter**: Only sends problems solved "Today" (IST).
- 🔄 **Manual Trigger**: Run a script to trigger the update instantly.
- 💅 **UI Management**: Use the Dashboard to manage usernames and webhook URL.

## Setup

### 1. Installation
```bash
git clone https://github.com/AbdulWasay0029/Coding-Tracker.git
cd Coding-Tracker
npm install
```

### 2. Environment Variables
Create a `.env` file (or use the existing one):
```env
DATABASE_URL="file:./dev.db"
SMARTINTERVIEWS_TOKEN="optional_jwt_token_for_accurate_links"
```

### 3. Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Running Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to configure your **Discord Webhook** and **Usernames**.

## User Manual

### How to Add/Remove Profiles
1. Go to the Dashboard (http://localhost:3000).
2. Enter the **Platform** (e.g., LeetCode) and **Username**.
3. Click **Add to Watchlist**.
4. To remove, click the trash icon on the profile card.

### How to Trigger Manually
If you want to send the daily report *right now* instead of waiting for 11 PM:
1. Double-click the `trigger_update.bat` file in the root folder.
2. OR run: `npx tsx scripts/manual-trigger.ts`

### Cron Job (Automatic)
The system is configured to run automatically everyday at **11:00 PM IST** (17:30 UTC) when deployed to Vercel.

## Supported Platforms
- **LeetCode**: ✅ Full Support
- **Codeforces**: ✅ Full Support
- **CodeChef**: ✅ Parsing Support
- **SmartInterviews**: ✅ Full Support (Requires JWT Token)

## Troubleshooting
- **No messages?**: Ensure you solved a problem *today (IST)*. The tracker strictly filters timestamps.
- **Duplicates?**: If you run the manual trigger multiple times, it *will* resend the links for today as per your request. The automatic cron will only run once a day.
