const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const solves = await prisma.solvedProblem.findMany({
        where: { problemId: { contains: 'APP' } }
    });
    console.log(JSON.stringify(solves, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
