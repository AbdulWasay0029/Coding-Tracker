import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../core/prisma';

async function main() {
    console.log("Fetching Leaderboard data...");
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const leaderboardData = await prisma.solvedProblem.groupBy({
        by: ['discordUserId'],
        where: {
            solvedAt: { gte: lastWeek }
        },
        _count: {
            problemId: true
        },
        orderBy: {
            _count: {
                problemId: 'desc'
            }
        },
        take: 10
    });

    console.log("Top 10 users in the last 7 days:");
    leaderboardData.forEach((user, index) => {
        console.log(`#${index + 1}: ${user.discordUserId} — ${user._count.problemId} problems`);
    });

    await prisma.$disconnect();
}

main().catch(console.error);
