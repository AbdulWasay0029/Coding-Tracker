import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { runTrackerForUser, getTimestampsForDate } from '../jobs/tracker';
import { prisma } from '../core/prisma';

async function main() {
    console.log('🚀 Starting 7-Day Backfill for all registered users...');

    // Calculate the start timestamp (7 days ago) and end timestamp (today)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = Date.now() + istOffset;
    
    // End is end of today (or just now is fine, getTimestampsForDate('today') gives us end of today)
    const todayWindow = getTimestampsForDate('today');
    const endTimestamp = todayWindow.endTimestamp;

    // Start is 7 days ago at midnight
    const sevenDaysAgoIST = new Date(nowIST - 7 * 86400000);
    sevenDaysAgoIST.setUTCHours(0, 0, 0, 0);
    const startTimestamp = Math.floor((sevenDaysAgoIST.getTime() - istOffset) / 1000);

    console.log(`📅 Scraping window:`);
    console.log(`   Start: ${sevenDaysAgoIST.toISOString()} (Timestamp: ${startTimestamp})`);
    console.log(`   End:   Today's End (Timestamp: ${endTimestamp})`);

    const uniqueUsers = await prisma.userProfile.findMany({
        select: { discordUserId: true },
        distinct: ['discordUserId']
    });

    if (uniqueUsers.length === 0) {
        console.log('ℹ️ No profiles in database. Nothing to backfill.');
        await prisma.$disconnect();
        return;
    }

    console.log(`👥 Found ${uniqueUsers.length} student(s) to backfill...`);

    let totalLinks = 0;
    let studentsWithLinks = 0;

    for (let i = 0; i < uniqueUsers.length; i++) {
        const { discordUserId } = uniqueUsers[i];
        console.log(`\n⏳ [${i + 1}/${uniqueUsers.length}] Scraping user: ${discordUserId}...`);

        try {
            const result = await runTrackerForUser(discordUserId, startTimestamp, endTimestamp);
            
            if (result.links.length > 0) {
                console.log(`   ✅ Found ${result.links.length} problems!`);
                totalLinks += result.links.length;
                studentsWithLinks++;
            } else {
                console.log(`   📭 No problems found in the last 7 days.`);
            }

            if (result.errors && result.errors.length > 0) {
                console.log(`   ⚠️ Errors: ${result.errors.join(', ')}`);
            }
        } catch (err: any) {
            console.error(`   ❌ Failed to scrape for user ${discordUserId}:`, err.message);
        }

        // Delay to respect rate limits (avoid getting IP banned)
        console.log('   💤 Waiting 2 seconds before next user...');
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n🎉 Backfill Complete!');
    console.log(`✅ ${studentsWithLinks} student(s) had activity · ${totalLinks} problem(s) added to the database.`);

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error('❌ Fatal error:', err.message);
    await prisma.$disconnect();
    process.exit(1);
});
