const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Push schema changes (contestChannelId, etc.) to the live PostgreSQL DB
    const { execSync } = require('child_process');
    console.log("Pushing schema to DB...");
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // 2. Migrate existing problemIds to the new format
    console.log("Migrating existing problem IDs...");
    const allSolves = await prisma.solvedProblem.findMany();
    
    let updatedCount = 0;
    
    for (const solve of allSolves) {
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(solve.solvedAt.getTime() + istOffset);
        const dateStr = istDate.toISOString().split('T')[0];
        
        // For CodeChef/Codeforces, title is often the problem code. 
        // For LeetCode, it's the title string, but we need titleSlug.
        // The old ID format was often: {username}-{titleSlug}-{timestamp} or {titleSlug}
        // Let's just generate a clean ID using the title. 
        // Since we don't have titleSlug in DB, we'll format the title.
        const titleSlug = solve.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const newUniqueId = `${titleSlug}-${dateStr}`;
        
        if (solve.problemId !== newUniqueId) {
            try {
                await prisma.solvedProblem.update({
                    where: { id: solve.id },
                    data: { problemId: newUniqueId }
                });
                updatedCount++;
            } catch (e) {
                // If the newUniqueId already exists (duplicate), delete the old one
                if (e.code === 'P2002') {
                    await prisma.solvedProblem.delete({ where: { id: solve.id } });
                }
            }
        }
    }
    
    console.log(`Successfully migrated ${updatedCount} records to the new ID format.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
