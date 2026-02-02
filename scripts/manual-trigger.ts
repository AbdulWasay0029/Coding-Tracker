import readline from 'readline';
import { checkAndNotifyProgress } from '../lib/tracker-logic';

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n--- Manual Trigger Options ---');
    console.log('1. Today (Default)');
    console.log('2. Yesterday');
    console.log('3. Custom Date (YYYY-MM-DD)');

    rl.question('\nSelect option (1-3): ', async (answer) => {
        let startTimestamp = 0;
        let endTimestamp = 0;
        const istOffset = 5.5 * 60 * 60 * 1000;

        let targetDate = new Date(); // Default today

        if (answer.trim() === '2') {
            targetDate.setDate(targetDate.getDate() - 1);
            console.log(`\nTriggering for YESTERDAY (${targetDate.toISOString().split('T')[0]})...`);
        } else if (answer.trim() === '3') {
            rl.question('Enter date (YYYY-MM-DD): ', async (dateInput) => {
                const dateParam = dateInput.trim();
                targetDate = new Date(dateParam);
                console.log(`\nTriggering for CUSTOM DATE (${dateParam})...`);
                await runTrigger(targetDate, istOffset);
                rl.close();
            });
            return;
        } else {
            console.log('\nTriggering for TODAY...');
        }

        if (answer.trim() !== '3') {
            await runTrigger(targetDate, istOffset);
            rl.close();
        }
    });

}

async function runTrigger(targetDate: Date, istOffset: number) {
    const startIST = new Date(targetDate);
    startIST.setHours(0, 0, 0, 0);

    // IST to UTC timestamp
    // If targetDate is just logic "date", we need to ensure it represents "That Day in IST"
    // If targetDate = new Date(), it is "NOW".
    // If targetDate = new Date("2026-02-01"), it is "00:00 UTC".

    // Let's standardise on "input date string" logic to be safe or reuse the offset logic.
    // If we use date string for everything locally it's clearer.

    // For Today/Yesterday created via new Date(), we can use local time simulation or just UTC offsets.
    // Let's use the robust logic from API route:

    // We want the start of the "IST Day".
    // 1. Get timestamp of targetDate.
    // 2. Add offset to represent "Time in India".
    // 3. Floor to day start.
    // 4. Subtract offset back to UTC.

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
    }
}

main();
