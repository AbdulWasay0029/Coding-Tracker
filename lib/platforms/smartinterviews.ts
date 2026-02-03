import axios from 'axios';
import { Submission } from './leetcode';

const SI_API = 'https://hive.smartinterviews.in/api/user/getUserProfileData';

export async function fetchSmartInterviewsSubmissions(username: string): Promise<Submission[]> {
    try {
        const token = process.env.SMARTINTERVIEWS_TOKEN;
        const headers: any = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': `https://hive.smartinterviews.in/profile/${username}`
        };

        if (token) {
            headers['authorization'] = `Token ${token}`;
            headers['role'] = 'USER';
            headers['username'] = username;
        }

        const response = await axios.get(SI_API, {
            params: { username },
            headers
        });

        const data = response.data;
        if (!data || !data.status || !data.data) {
            return [];
        }

        const submissions: Submission[] = [];

        // 1. Try to get detailed recent submissions (Requires Token)
        if (data.data.recentSubmissions && Array.isArray(data.data.recentSubmissions)) {
            for (const sub of data.data.recentSubmissions) {
                if (sub.verdict !== 'Accepted') continue;

                const timestamp = Math.floor(new Date(sub.submittedAt).getTime() / 1000);

                // SmartInterviews link format: /contest/{contestSlug}/problem/{problemSlug}
                // or fallback to submission if slug missing
                let url = `https://hive.smartinterviews.in/submission/${sub.solutionId}`;
                if (sub.contestSlug && sub.problemSlug) {
                    url = `https://hive.smartinterviews.in/contest/${sub.contestSlug}/problem/${sub.problemSlug}`;
                }

                submissions.push({
                    id: `SI-${sub.solutionId}`,
                    title: sub.problemTitle,
                    titleSlug: sub.problemSlug,
                    timestamp: timestamp,
                    url: url
                });
            }
            // Logic caller will filter for "Today", so returning all recent ones is fine.
            return submissions;
        }

        // 2. Fallback to Heatmap if no recent submissions found
        const heatmap = data.data.userSubmissionsHeatMapData;
        if (heatmap) {
            const now = new Date();
            const istOffset = 5.5 * 60 * 60 * 1000;
            const istNow = new Date(now.getTime() + istOffset);
            const todayStr = istNow.toDateString();

            let count = 0;
            for (const k of Object.keys(heatmap)) {
                if (new Date(k).toDateString() === todayStr) {
                    count = heatmap[k];
                    break;
                }
            }

            if (count > 0 && submissions.length === 0) {
                submissions.push({
                    id: `SI-${username}-${todayStr}`,
                    title: `Activity Detected: ${count} submissions on SmartInterviews`,
                    titleSlug: `smartinterviews-activity-${todayStr}`,
                    timestamp: Math.floor(Date.now() / 1000),
                    url: `https://hive.smartinterviews.in/profile/${username}`
                });
            }
        }

        return submissions;

    } catch (error) {
        console.warn('SmartInterviews fetch failed:', error);
        return [];
    }
}
