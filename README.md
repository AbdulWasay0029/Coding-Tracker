# 🚀 CodeSync: The Ultimate Coding Tracker

**CodeSync** is your personal, automated "hype man" for competitive programming. It watches your activity on **LeetCode**, **Codeforces**, **CodeChef**, and **SmartInterviews**, and delivers a sleek daily report straight to your Discord.

---

## ⚡ What Makes This Special?

*   🔥 **Zero Effort**: You solve, we track. No manual updates needed.
*   🧠 **Smart Filtering**: We *only* care about what you solved **TODAY**. No old noise.
*   💎 **Premium Notifications**: Clean, minimalist Discord messages containing *direct links* to your victories.
*   🕹️ **Interactive Dashboard**: A beautiful, real-time control panel to manage your accounts.
*   🎩 **Manual & Auto**: Runs automatically at **11 PM**, or trigger it manually whenever you want a dopamine hit.

---

## 🛠️ Supported Platforms & Superpowers

| Platform | Status | Superpower |
| :--- | :--- | :--- |
| **LeetCode** | ✅ **Active** | Full history tracking & direct links. |
| **Codeforces** | ✅ **Active** | Real-time submission monitoring. |
| **CodeChef** | ✅ **Active** | Smart date parsing (relative & absolute times). |
| **SmartInterviews** | 🔐 **Unlocked** | **JWT-Powered** deep tracking! (Requires Token) |

---

## 🚀 Quick Start Guide

### 1. Clone & Ignite
```bash
git clone https://github.com/AbdulWasay0029/Coding-Tracker.git
cd Coding-Tracker
npm install
```

### 2. Secrets & Keys 🗝️
Create a `.env` file. This is where the magic happens:
```env
DATABASE_URL="file:./dev.db"
SMARTINTERVIEWS_TOKEN="your_jwt_token_here"  # Optional: For that deep SmartInterviews tracking
```

### 3. Launch the Mothership (Dashboard)
```bash
npm run dev
```
👉 **Visit**: `http://localhost:3000`
Here you can adding usernames, set your Discord Webhook, and view your army of tracked profiles.

### 4. Deploy & Forget
Set up a Cron Job (or deploy to Vercel). The default schedule is **11:00 PM IST**.
*   **Manual Trigger**: Double-click `trigger_update.bat` in the folder. Boom. Done.

---

## ❓ FAQ / Troubleshooting

**Q: SmartInterviews missing some problems?**
A: Currently, CodeSync tracks the **Recent 10 Submissions** from your profile. If you go beast mode and solve 50 problems in one day, some might slip through the specific link tracking, but the "Activity Heatmap" won't lie!

**Q: The dates feel wrong?**
A: We use strict **IST (Indian Standard Time)** midnights. If you solve a problem at 11:59 PM and run the tracker at 12:01 AM, it belongs to *yesterday*. Precision matters!

---

**Built within the Antigravity Scratchpad.**
*Optimizing for the best time complexity, in code and in life :D*
