const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const solves = await prisma.solvedProblem.findMany({
        orderBy: { createdAt: 'asc' }
    });

    const seen = new Set();
    let deletedCount = 0;

    for (const solve of solves) {
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(solve.solvedAt.getTime() + istOffset);
        const dateStr = istDate.toISOString().split('T')[0];
        
        // Use the title (or problemId without the timestamp if we could parse it) 
        // For codechef, the title is usually the problem code e.g. APPENDOR
        const uniqueKey = `${solve.discordUserId}-${solve.platform}-${solve.title}-${dateStr}`;

        if (seen.has(uniqueKey)) {
            await prisma.solvedProblem.delete({ where: { id: solve.id } });
            deletedCount++;
        } else {
            seen.add(uniqueKey);
        }
    }
    console.log(`Deleted ${deletedCount} duplicate solves.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
