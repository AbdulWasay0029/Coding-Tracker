import cron from 'node-cron';
import axios from 'axios';
import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import { prisma } from '../core/prisma';

interface Contest {
    id: string;
    name: string;
    platform: 'LeetCode' | 'Codeforces' | 'CodeChef';
    url: string;
    startTimeMs: number;
}

const LC_WEEKLY_REF = { date: new Date('2026-03-29T02:30:00Z'), id: 495 };
const LC_BIWEEKLY_REF = { date: new Date('2026-03-28T14:30:00Z'), id: 179 };
const CC_STARTERS_REF = { date: new Date('2026-03-25T14:30:00Z'), id: 231 };
const CC_MONDAY_REF = { date: new Date('2026-06-08T12:30:00Z'), id: 6 }; // 18:00 IST is 12:30 UTC
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

const COLORS = {
    'LeetCode': 0xFFA116,
    'Codeforces': 0x1F8ACB,
    'CodeChef': 0x5C4D3C
};

const THUMBNAILS = {
    'LeetCode': 'https://upload.wikimedia.org/wikipedia/commons/8/8e/LeetCode_Logo_1.png',
    'Codeforces': 'https://cdn.iconscout.com/icon/free/png-256/code-forces-3628695-3029920.png',
    'CodeChef': 'https://cdn.codechef.com/images/cc-logo.png'
};

const notified60 = new Set<string>();

function generateStaticContests(): Contest[] {
    const now = Date.now();
    const contests: Contest[] = [];
    
    // Next 4 LeetCode Weekly
    for (let i = 0; i < 4; i++) {
        const weeksPassed = Math.floor((now - LC_WEEKLY_REF.date.getTime()) / ONE_WEEK);
        const nextId = LC_WEEKLY_REF.id + weeksPassed + i;
        const nextTime = LC_WEEKLY_REF.date.getTime() + ((weeksPassed + i) * ONE_WEEK);
        if (nextTime > now - ONE_WEEK) {
            contests.push({
                id: `lc-weekly-${nextId}`,
                name: `Weekly Contest ${nextId}`,
                platform: 'LeetCode',
                url: `https://leetcode.com/contest/weekly-contest-${nextId}`,
                startTimeMs: nextTime
            });
        }
    }
    
    // Next 2 LeetCode Biweekly
    for (let i = 0; i < 2; i++) {
        const biweeksPassed = Math.floor((now - LC_BIWEEKLY_REF.date.getTime()) / TWO_WEEKS);
        const nextId = LC_BIWEEKLY_REF.id + biweeksPassed + i;
        const nextTime = LC_BIWEEKLY_REF.date.getTime() + ((biweeksPassed + i) * TWO_WEEKS);
        if (nextTime > now - TWO_WEEKS) {
            contests.push({
                id: `lc-biweekly-${nextId}`,
                name: `Biweekly Contest ${nextId}`,
                platform: 'LeetCode',
                url: `https://leetcode.com/contest/biweekly-contest-${nextId}`,
                startTimeMs: nextTime
            });
        }
    }
    
    // Next 4 CodeChef Starters
    for (let i = 0; i < 4; i++) {
        const weeksPassed = Math.floor((now - CC_STARTERS_REF.date.getTime()) / ONE_WEEK);
        const nextId = CC_STARTERS_REF.id + weeksPassed + i;
        const nextTime = CC_STARTERS_REF.date.getTime() + ((weeksPassed + i) * ONE_WEEK);
        if (nextTime > now - ONE_WEEK) {
            contests.push({
                id: `cc-starters-${nextId}`,
                name: `Starters ${nextId}`,
                platform: 'CodeChef',
                url: `https://www.codechef.com/START${nextId}`,
                startTimeMs: nextTime
            });
        }
    }
    
    // Next 4 CodeChef Monday Munch
    for (let i = 0; i < 4; i++) {
        const weeksPassed = Math.floor((now - CC_MONDAY_REF.date.getTime()) / ONE_WEEK);
        const nextId = CC_MONDAY_REF.id + weeksPassed + i;
        const nextTime = CC_MONDAY_REF.date.getTime() + ((weeksPassed + i) * ONE_WEEK);
        const idStr = nextId.toString().padStart(3, '0');
        if (nextTime > now - ONE_WEEK) {
            contests.push({
                id: `cc-mondaymunch-${nextId}`,
                name: `Monday Munch - DSA Challenge ${idStr}`,
                platform: 'CodeChef',
                url: `https://www.codechef.com/DSAMONDAY${idStr}`,
                startTimeMs: nextTime
            });
        }
    }
    
    return contests;
}

async function fetchCFContests(): Promise<Contest[]> {
    try {
        const res = await axios.get('https://codeforces.com/api/contest.list');
        if (res.data.status !== 'OK') return [];
        
        const contests = res.data.result.filter((c: any) => c.phase === 'BEFORE');
        return contests.map((c: any) => ({
            id: `cf-${c.id}`,
            name: c.name,
            platform: 'Codeforces',
            url: `https://codeforces.com/contests/${c.id}`,
            startTimeMs: c.startTimeSeconds * 1000,
        }));
    } catch (e) {
        console.error('[Contests] CF fetch error', e);
        return [];
    }
}

async function getAllUpcomingContests(): Promise<Contest[]> {
    const staticContests = generateStaticContests();
    const cfContests = await fetchCFContests();
    
    const all = [...staticContests, ...cfContests];
    const now = Date.now();
    return all.filter(c => c.startTimeMs > now).sort((a, b) => a.startTimeMs - b.startTimeMs);
}

async function broadcastWeeklyDigest(client: Client) {
    const all = await getAllUpcomingContests();
    const now = Date.now();
    const nextWeek = now + ONE_WEEK;
    
    const thisWeekContests = all.filter(c => c.startTimeMs <= nextWeek);
    if (thisWeekContests.length === 0) return;

    const embed = new EmbedBuilder()
        .setTitle('📅 Upcoming Contests For This Week')
        .setDescription(thisWeekContests.map((c, i) => 
            `**${i + 1}. [${c.name}](${c.url})**\n> ⏱️ <t:${Math.floor(c.startTimeMs / 1000)}:f> (<t:${Math.floor(c.startTimeMs / 1000)}:R>)`
        ).join('\n\n'))
        .setColor(0x5865F2)
        .setFooter({ text: 'Powered by CodeSync' })
        .setTimestamp();

    await sendToAllConfiguredChannels(client, { embeds: [embed] });
}

async function broadcastReminder(client: Client, contest: Contest) {
    const embed = new EmbedBuilder()
        .setTitle(`🚀 ${contest.name} is starting soon!`)
        .setDescription(`**[Click here to join the contest](${contest.url})**\n\nThe contest begins <t:${Math.floor(contest.startTimeMs / 1000)}:R>. Good luck!`)
        .setColor(COLORS[contest.platform])
        .setThumbnail(THUMBNAILS[contest.platform])
        .setFooter({ text: `${contest.platform} Contest Reminder` });

    await sendToAllConfiguredChannels(client, { embeds: [embed] });
}

async function sendToAllConfiguredChannels(client: Client, payload: any) {
    const configs = await prisma.guildConfig.findMany({
        where: { contestChannelId: { not: null } }
    });

    for (const conf of configs) {
        try {
            const channel = await client.channels.fetch(conf.contestChannelId!);
            if (channel?.isTextBased()) {
                const textChannel = channel as TextChannel;
                let finalPayload = { ...payload };
                if (conf.contestRoleId) {
                    finalPayload.content = `<@&${conf.contestRoleId}>`;
                }
                await textChannel.send(finalPayload);
            }
        } catch (e) {
            console.error(`[Contests] Failed to send to guild ${conf.guildId}:`, e);
        }
    }
}

async function checkContestsTick(client: Client) {
    const upcoming = await getAllUpcomingContests();
    const now = Date.now();
    
    for (const c of upcoming) {
        const diffMins = (c.startTimeMs - now) / 60000;
        
        // 60-min reminder (trigger if between 50 and 65 mins)
        if (diffMins <= 65 && diffMins > 45 && !notified60.has(c.id)) {
            notified60.add(c.id);
            await broadcastReminder(client, c);
        }
    }
}

export function initContestScheduler(client: Client) {
    console.log('[Contests] Initializing scheduler...');
    
    // Check every 10 minutes
    cron.schedule('*/10 * * * *', () => {
        checkContestsTick(client).catch(e => console.error('[Contests] Tick Error:', e));
    });

    // Weekly Digest: Every Monday at 8:30 AM IST
    cron.schedule('30 8 * * 1', () => {
        broadcastWeeklyDigest(client).catch(e => console.error('[Contests] Digest Error:', e));
    }, { timezone: 'Asia/Kolkata' });

    console.log('[Contests] Scheduler running. (Timezone: Asia/Kolkata)');
}
