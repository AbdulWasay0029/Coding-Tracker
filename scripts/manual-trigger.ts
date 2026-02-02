
import { GET } from '../app/api/check-progress/route';

async function main() {
    console.log('--- Triggering Cron Job Manually ---');

    // Mock the request object if needed, but GET usually doesn't need it 
    // unless we use parameters. Our route doesn't use params.

    try {
        const response = await GET();
        const data = await response.json();
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error executing route:', error);
    }
}

main();
