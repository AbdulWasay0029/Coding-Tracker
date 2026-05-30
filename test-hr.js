const axios = require('axios');

async function test() {
    const limits = [10, 20, 50, 100];
    const username = 'abdulwasay0029';
    
    try {
        console.log(`Testing HTML profile...`);
        const url = `https://www.hackerrank.com/${username}`;
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' }
        });
        const match = data.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/);
        if (match) {
            const state = JSON.parse(match[1]);
            const models = state.profile?.recent_challenges?.models || [];
            console.log(`✅ Success! Found ${models.length} recent_challenges in HTML state.`);
            if (models.length > 0) {
                console.log(models[0]);
            }
        } else {
            console.log('No __INITIAL_STATE__ found.');
        }
    } catch (err) {
        console.error(`❌ Failed:`, err.message);
    }
}
test();
