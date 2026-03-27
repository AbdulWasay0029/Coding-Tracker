import { prisma } from '../lib/prisma';

// Replace with your real Discord User ID if you want to seed local testing
const MY_DISCORD_ID = "1478104744391344359";

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Add Profiles for the user
    const profiles = [
        { platform: 'LEETCODE', username: 'abdulwasay0029' },
        { platform: 'CODECHEF', username: 'abdulwasay0029' },
        { platform: 'CODEFORCES', username: 'abdulwasay0029' }
    ];

    for (const p of profiles) {
        try {
            await prisma.userProfile.upsert({
                where: {
                    discordUserId_platform_username: {
                        discordUserId: MY_DISCORD_ID,
                        platform: p.platform,
                        username: p.username
                    }
                },
                update: {},
                create: {
                    discordUserId: MY_DISCORD_ID,
                    platform: p.platform,
                    username: p.username,
                }
            });
            console.log(`✅ Seeded ${p.platform} profile for ${p.username}`);
        } catch (e: any) {
            console.error(`Error adding ${p.platform}:`, e.message);
        }
    }

    console.log('✅ Seed complete.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
