import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning seeded data...');
    const del1 = await prisma.solvedProblem.deleteMany({
        where: { problemId: { contains: '_TEST_' } }
    });
    const del2 = await prisma.solvedProblem.deleteMany({
        where: { problemId: { contains: '_RIVAL_' } }
    });
    console.log(`Cleaned ${del1.count + del2.count} seeded problems.`);
}

main().finally(() => prisma.$disconnect());
