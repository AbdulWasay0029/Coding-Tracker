import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const settings = await prisma.userSettings.findUnique({
            where: { discordUserId: session.user.id }
        });

        // Default to public if no settings exist
        return NextResponse.json(settings || { isPublic: true });
    } catch (error) {
        console.error("GET /api/settings error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        
        const settings = await prisma.userSettings.upsert({
            where: { discordUserId: session.user.id },
            update: {
                isPublic: body.isPublic
            },
            create: {
                discordUserId: session.user.id,
                isPublic: body.isPublic
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("PUT /api/settings error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
