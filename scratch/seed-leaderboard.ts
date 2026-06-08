import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding fake data for the leaderboard and profile graph...');

    // Assuming the user's discord ID is their session ID.
    // We'll insert some fake solves for the last 14 days for a couple of users.
    
    // Replace this with the user's actual Discord ID if known, or we'll just seed a generic one
    const myId = '36286953029920'; // Placeholder, we will fetch any existing user ID
    
    const existingUser = await prisma.userProfile.findFirst();
    if (!existingUser) {
        console.log('No users in database to seed for.');
        return;
    }
    
    const targetUserId = existingUser.discordUserId;
    const secondUserId = '123456789012345678'; // Fake rival

    const platforms = ['LC', 'CF', 'CC', 'HR'];
    
    // Seed for today and the last 14 days
    for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Random number of solves between 1 and 5
        const numSolves = Math.floor(Math.random() * 5) + 1;
        
        for (let j = 0; j < numSolves; j++) {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            
            await prisma.solvedProblem.create({
                data: {
                    problemId: `${platform}_TEST_${i}_${j}_${Math.random()}`,
                    discordUserId: targetUserId,
                    solvedAt: date,
                    platform: platform,
                    title: `Test Problem ${i}-${j}`
                }
            });
        }

        // Rival solves
        if (i < 7) { // Rival only solved stuff this week
            const rivalSolves = Math.floor(Math.random() * 3);
            for (let j = 0; j < rivalSolves; j++) {
                await prisma.solvedProblem.create({
                    data: {
                        problemId: `LC_RIVAL_${i}_${j}_${Math.random()}`,
                        discordUserId: secondUserId,
                        solvedAt: date,
                        platform: 'LC',
                        title: `Rival Problem ${i}-${j}`
                    }
                });
            }
        }
    }

    console.log('✅ Successfully seeded fake data!');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
