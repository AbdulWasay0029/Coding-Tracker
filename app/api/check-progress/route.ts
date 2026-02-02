import { NextResponse } from 'next/server';
import { checkAndNotifyProgress } from '@/lib/tracker-logic';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    // Parse query params for date
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date'); // YYYY-MM-DD

    let startTimestamp: number;
    let endTimestamp: number;
    const istOffset = 5.5 * 60 * 60 * 1000;

    if (dateParam) {
        // Use custom date
        const targetDate = new Date(dateParam);
        if (isNaN(targetDate.getTime())) {
            return NextResponse.json({ message: 'Invalid Date Format' }, { status: 400 });
        }

        const startIST = new Date(targetDate);
        startIST.setHours(0, 0, 0, 0);
        // IST to UTC timestamp
        startTimestamp = Math.floor((startIST.getTime() - istOffset) / 1000);
        endTimestamp = startTimestamp + 86400;

    } else {
        // Default: TODAY (IST)
        const now = new Date();
        const nowUTC = now.getTime();
        const nowIST = nowUTC + istOffset;

        const todayStartIST = new Date(nowIST);
        todayStartIST.setUTCHours(0, 0, 0, 0);

        startTimestamp = Math.floor((todayStartIST.getTime() - istOffset) / 1000);
        endTimestamp = startTimestamp + 86400; // Until tomorrow start
    }

    const result = await checkAndNotifyProgress(startTimestamp, endTimestamp);

    if (result.success) {
        return NextResponse.json(result);
    } else {
        return NextResponse.json(result, { status: 500 });
    }
}
