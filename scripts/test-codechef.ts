import axios from 'axios';
import * as cheerio from 'cheerio';

async function testCodeChef() {
    const username = 'abdulwasay0029';
    console.log(`Testing CodeChef for ${username}...`);

    // Strategy 1: Recent Activity API (often used by widgets)
    try {
        const url = `https://www.codechef.com/recent/user?page=0&user_handle=${username}&sort_by=timestamp&sorting_order=desc`;
        console.log(`Trying API: ${url}`);
        const { data } = await axios.get(url);
        if (data && data.content) {
            // CodeChef returns HTML string in 'content' field sometimes?
            console.log('Strategy 1 API returned data.');
            // console.log(data);
        } else {
            console.log('Strategy 1 API returned no content.');
        }
    } catch (e) {
        console.log('Strategy 1 failed:', e.message);
    }

    // Strategy 2: Scrape Profile Page
    try {
        const url = `https://www.codechef.com/users/${username}`;
        console.log(`Trying Scrape: ${url}`);
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        // Look for recent activity or solved problems
        // CodeChef structure is complex, often loaded dynamically.
        // But "Fully Solved" list might be present.
        const fullySolved = $('h5:contains("Fully Solved")').next().find('a');
        console.log(`Found ${fullySolved.length} fully solved problems on profile page.`);
        fullySolved.each((i, el) => {
            if (i < 5) console.log($(el).text());
        });

    } catch (e) {
        console.log('Strategy 2 failed:', e.message);
    }
}

testCodeChef();
