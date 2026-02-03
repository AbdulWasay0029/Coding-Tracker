import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { checkAndNotifyProgress } from '../lib/tracker-logic';

async function main() {
    console.log('--- Auto-Trigger: Running for TODAY ---');
    const istOffset = 5.5 * 60 * 60 * 1000;
    const targetDate = new Date();

    const nowUTC = targetDate.getTime();
    const nowIST = nowUTC + istOffset;
    const dayStartIST = new Date(nowIST);
    dayStartIST.setUTCHours(0, 0, 0, 0);

    const startTimestamp = Math.floor((dayStartIST.getTime() - istOffset) / 1000);
    const endTimestamp = startTimestamp + 86400;

    console.log(`Checking range: ${new Date(startTimestamp * 1000).toISOString()} -> ${new Date(endTimestamp * 1000).toISOString()}`);

    try {
        const result = await checkAndNotifyProgress(startTimestamp, endTimestamp);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (e: any) {
        console.error('Error executing trigger:', e.message);
        process.exit(1);
    }
}

main();
