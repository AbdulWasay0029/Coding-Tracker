# CodeSync: The Human Story

## It Started With Annoyance

Every night, after grinding problems on LeetCode, Codeforces, and CodeChef, I had to manually collect my solved problems and paste them into our SmartInterviews training batch Discord server. Different platforms, different UIs, different formats. Copy, paste, repeat. Every single night.

At some point I got tired of doing it.

I wrote a `.bat` file on my Windows PC. It scraped my submissions across platforms, filtered today's solves, and pushed them to Discord automatically via a webhook. Ugly? Yes. But it worked for 5 platforms simultaneously. The catch — only I could run it, only from my computer.

That limitation bugged me more than the original problem.

---

## The Pivot

If I had to leave my PC, the automation died. If a classmate wanted to do the same thing, they were on their own. So I rebuilt it — completely — as a Discord bot using discord.js and TypeScript, backed by a PostgreSQL database.

Now anyone could run `/add-profile` to link their usernames, `/check` to pull their day's solves on demand, and a re-check button to refresh instantly. No PC required. No manual pasting.

I named it **CodeSync**.

I posted about it on LinkedIn — not expecting much. Just documenting what I built. The post talked about the real insight: the .bat script wasn't the product. The transition from single-user automation to a multi-user, persistent, command-driven system was where the actual engineering happened.

> *"Build the scrappy version. Let it expose the real requirements. Then engineer it properly."*

---

## The Part I Didn't Expect

A week or so after posting, I started getting notifications. Likes from SmartInterviews students I'd never interacted with. Mentors. Senior students. Even someone from SmartInterviews HR. I had no idea what was going on.

Then I got a DM at 2am.

A student named Harshith from another campus sent me a message. He said our professor — who teaches across multiple campuses — had cited my project in his session. He'd shown my LinkedIn post to his students and told them: *"This is what it looks like to solve a real problem. Go build something like this."*

Harshith got inspired. He went ahead and built his own version — a LeetCode-to-Discord reporter using GitHub Actions — without even seeing my repo. He only found my repository after he'd already finished his own. Then he found me on LinkedIn and reached out.

> *"Hey Abdul! So our training sir brought up someone who built a script that posts daily solved problem links to Discord with a click, turns out it was you lol. I had no idea, thought it was just a small script so I went ahead and built my own version, didn't even see your repo until after I was done. But after seeing it, it's actually way bigger than I imagined. Either way your idea sparked mine."*

---

## The Classroom Moment

Shortly after, in one of our first sessions after exams, my professor stopped mid-class.

He asked the room if anyone was active on LinkedIn. Then he pulled up my post and said something along the lines of: *"Have you seen what your classmate Abdul has built? This is what it means to build something that solves a real problem. You should all be doing this."*

I was sitting right there.

After class, a few classmates came up asking how to set it up. I shared the CodeHub Discord server. People joined, went through the setup, and started tracking their own submissions. Watching something you built get used in real time — by people you know — is a different feeling from anything else.

---

## What Came After

The post traction, the professor's words, the 2am message from Harshith — all of it happened within a short window. Shortly after, a senior student named Akshay — national hackathon winner, GDG lead, working at an AI startup — reached out. He'd seen the project and the response it generated. He said he wanted to build something together.

That was the moment CodeSync stopped being just a bot and became proof of something larger: that building for a real problem, even a small one, compounds in ways you don't predict.

---

## What CodeSync Actually Is

At its core, CodeSync exists because one person was annoyed by a daily ritual and decided to automate it instead of tolerating it.

That's it. That's the whole thing.

The professor citations, the independent rebuild, the LinkedIn traction, the collab offer — none of that was planned. It was the natural result of building something genuinely useful and putting it in front of people who had the same problem.

The bot now supports LeetCode, Codeforces, CodeChef, HackerRank, and SmartInterviews (including a custom-engineered integration with SmartInterviews' internal API). It runs 24/7 on cloud infrastructure with automated daily tracking, AES-256 encryption for sensitive tokens, and parallel database writes for performance at scale.

But the .bat file is still where it started.
