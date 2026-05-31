import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../core/prisma';
import { fetchLeetCodeSubmissions } from '../core/platforms/leetcode';
import { runTrackerForUser } from '../jobs/tracker';

async function main() {
    const discordUserId = '1399747956730757211';
    
    console.log(`🔍 Debugging User: ${discordUserId}`);
    
    const profiles = await prisma.userProfile.findMany({
        where: { discordUserId }
    });
    
    console.log(`\n📋 Registered Profiles:`);
    console.log(profiles);

    const leetcodeProfile = profiles.find(p => p.platform === 'LEETCODE');
    if (leetcodeProfile) {
        console.log(`\n🟡 Testing LeetCode Scraper directly for username: ${leetcodeProfile.username}`);
        try {
            // Get last 7 days
            const startTimestamp = Math.floor((Date.now() - 7 * 86400000) / 1000);
            const submissions = await fetchLeetCodeSubmissions(leetcodeProfile.username, startTimestamp);
            console.log(`   Fetched ${submissions.length} valid submissions for the last 7 days.`);
            if (submissions.length > 0) {
                console.log(`   Sample:`, submissions[0]);
            }
        } catch (err: any) {
            console.error(`   ❌ Scraper Error:`, err.message);
        }
    } else {
        console.log(`\n❌ User does not have a LEETCODE profile registered in the database.`);
    }

    const solvedProblems = await prisma.solvedProblem.findMany({
        where: { discordUserId }
    });
    console.log(`\n📚 Total Solved Problems in DB: ${solvedProblems.length}`);

    await prisma.$disconnect();
}

main().catch(console.error);
