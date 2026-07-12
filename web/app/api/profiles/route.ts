import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '../../../lib/prisma';
import { encrypt } from '../../../../src/core/encryption';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const rawProfiles = await prisma.userProfile.findMany({
            where: { discordUserId: session.user.id },
            select: {
                id: true,
                platform: true,
                username: true,
                token: true
            }
        });
        
        const profiles = rawProfiles.map(p => ({
            id: p.id,
            platform: p.platform,
            username: p.username,
            hasToken: !!p.token
        }));
        
        return NextResponse.json(profiles);
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { platform, username, token } = body;

        if (!platform || !username) {
            return NextResponse.json({ error: 'Platform and username are required' }, { status: 400 });
        }

        const formattedPlatform = platform.toUpperCase().trim();
        const formattedUsername = username.trim();

        const profile = await prisma.userProfile.create({
            data: {
                discordUserId: session.user.id,
                platform: formattedPlatform,
                username: formattedUsername,
                token: token ? encrypt(token.trim()) : null
            }
        });

        // Fire-and-forget: Queue an asynchronous FULL_HISTORY backfill job (past 365 days)
        // This permanently populates the user's contribution heatmap and caches tracked dates without blocking!
        try {
            const now = Math.floor(Date.now() / 1000);
            const oneYearAgo = now - (365 * 86400);
            await prisma.scrapeJob.create({
                data: {
                    discordUserId: session.user.id,
                    jobType: 'FULL_HISTORY',
                    startTimestamp: oneYearAgo,
                    endTimestamp: now + 86400
                }
            });
            console.log(`[Backfill Engine] Queued FULL_HISTORY pull for ${session.user.id} (${formattedPlatform})`);
        } catch (queueErr) {
            console.error(`[Backfill Engine] Non-fatal error queuing backfill for ${session.user.id}:`, queueErr);
        }

        return NextResponse.json({
            id: profile.id,
            platform: profile.platform,
            username: profile.username,
            hasToken: !!profile.token
        }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Profile already exists for this platform and username.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
        }

        // Verify the profile belongs to the user before deleting
        const profile = await prisma.userProfile.findUnique({
            where: { id }
        });

        if (!profile || profile.discordUserId !== session.user.id) {
            return NextResponse.json({ error: 'Profile not found or unauthorized' }, { status: 404 });
        }

        await prisma.userProfile.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Profile deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, username, token } = body;

        if (!id || !username) {
            return NextResponse.json({ error: 'Profile ID and username are required' }, { status: 400 });
        }

        const profile = await prisma.userProfile.findUnique({
            where: { id }
        });

        if (!profile || profile.discordUserId !== session.user.id) {
            return NextResponse.json({ error: 'Profile not found or unauthorized' }, { status: 404 });
        }

        const updated = await prisma.userProfile.update({
            where: { id },
            data: {
                username: username.trim(),
                token: token ? encrypt(token.trim()) : profile.token
            }
        });

        return NextResponse.json({
            id: updated.id,
            platform: updated.platform,
            username: updated.username,
            hasToken: !!updated.token
        }, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Profile already exists for this platform and username.' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
