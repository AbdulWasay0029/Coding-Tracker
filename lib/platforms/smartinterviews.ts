import axios from 'axios';
import { Submission } from './leetcode';

const SI_API = 'https://hive.smartinterviews.in/api/user/getUserProfileData';

export async function fetchSmartInterviewsSubmissions(username: string): Promise<Submission[]> {
    try {
        const response = await axios.get(SI_API, {
            params: { username },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': `https://hive.smartinterviews.in/profile/${username}`
            }
        });

        const data = response.data;
        const heatmap = data.data.userSubmissionsHeatMapData;
        const submissions: Submission[] = [];

        // Determine "Today" in the string format SmartInterviews uses (e.g., "Mon Feb 03 2026")
        // We match keys that parse to the same day as today (IST).
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);
        const todayStr = istNow.toDateString();

        // Find matching key
        const keys = Object.keys(heatmap);
        let count = 0;

        for (const k of keys) {
            const date = new Date(k);
            if (date.toDateString() === todayStr) {
                count = heatmap[k];
                break;
            }
        }

        if (count > 0) {
            // We found activity!
            submissions.push({
                id: `SI-${username}-${todayStr}`,
                title: `Activity Detected: ${count} submissions on SmartInterviews`,
                titleSlug: `smartinterviews-activity-${todayStr}`,
                timestamp: Math.floor(Date.now() / 1000),
                url: `https://hive.smartinterviews.in/profile/${username}`
            });
        }

        return submissions;

    } catch (error) {
        console.warn('SmartInterviews fetch failed:', error);
        return [];
    }
}
