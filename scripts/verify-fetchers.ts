
import { fetchLeetCodeSubmissions } from '../lib/platforms/leetcode';
import { fetchCodeforcesSubmissions } from '../lib/platforms/codeforces';
import { fetchCodeChefSubmissions } from '../lib/platforms/codechef';

async function main() {
    const username = 'abdulwasay0029';

    console.log(`Checking profiles for: ${username}\n`);

    // 1. LeetCode
    try {
        console.log('--- LeetCode ---');
        const lc = await fetchLeetCodeSubmissions(username);
        console.log(`Found ${lc.length} recent submissions.`);
        if (lc.length > 0) {
            console.log('Latest:', lc[0].title);
        }
    } catch (e) {
        console.error('LeetCode Error:', e);
    }
    console.log('\n');

    // 2. Codeforces
    try {
        console.log('--- Codeforces ---');
        const cf = await fetchCodeforcesSubmissions(username);
        console.log(`Found ${cf.length} recent submissions.`);
        if (cf.length > 0) {
            console.log('Latest:', cf[0].title);
        }
    } catch (e) {
        console.error('Codeforces Error:', e);
    }
    console.log('\n');

    // 3. CodeChef
    try {
        console.log('--- CodeChef ---');
        const cc = await fetchCodeChefSubmissions(username);
        console.log(`Found ${cc.length} recent submissions.`);
        if (cc.length > 0) {
            console.log('Latest:', cc[0].title);
        }
    } catch (e) {
        console.error('CodeChef Error:', e);
    }
}

main();
