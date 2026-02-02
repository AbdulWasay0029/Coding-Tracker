import { prisma } from '../lib/prisma';

async function main() {
    // 1. Configure Webhook
    await prisma.globalConfig.upsert({
        where: { id: 'config' },
        update: {
            discordWebhookUrl: "https://discord.com/api/webhooks/1467944403422281939/PYwtcrk_9Qd5ypcg_PIcZxDkeUJKYGrqlFxcKuIQ6V9eB0aSaljW9G5V2Neyma8qt70Z"
        },
        create: {
            id: 'config',
            discordWebhookUrl: "https://discord.com/api/webhooks/1467944403422281939/PYwtcrk_9Qd5ypcg_PIcZxDkeUJKYGrqlFxcKuIQ6V9eB0aSaljW9G5V2Neyma8qt70Z"
        }
    });

    console.log('✅ Webhook configured');

    // 2. Add Profiles
    const profiles = [
        { platform: 'LEETCODE', username: 'abdulwasay0029' },
        { platform: 'CODECHEF', username: 'abdulwasay0029' },
        { platform: 'CODEFORCES', username: 'abdulwasay0029' } // Assumed
    ];

    for (const p of profiles) {
        try {
            await prisma.userProfile.upsert({
                where: {
                    platform_username: {
                        platform: p.platform,
                        username: p.username
                    }
                },
                update: {},
                create: {
                    platform: p.platform,
                    username: p.username
                }
            });
            console.log(`✅ Added ${p.platform} profile: ${p.username}`);
        } catch (e) {
            console.error(`Error adding ${p.platform}:`, e);
        }
    }
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
