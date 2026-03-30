import axios from 'axios';
import { Submission } from './leetcode';

const SI_API_GOLDMINE = 'https://hive.smartinterviews.in/api/contest/allUserSubmissions';

export async function fetchSmartInterviewsSubmissions(username: string, tokenOverride?: string): Promise<Submission[]> {
    try {
        const token = tokenOverride || process.env.SMARTINTERVIEWS_TOKEN;
        // If no token, return empty (or we could keep heatmap fallback, 
        // but user seems to have token now so let's focus on quality).
        if (!token) {
            console.log('SmartInterviews: No token found, skipping.');
            return [];
        }

        let siUsername = username;

        // SmartInterviews JWT tokens contain the real username in the middle part (base64)
        // We'll decode it so casing/mismatches don't break the fetch
        try {
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                if (payload.username) {
                    siUsername = payload.username;
                }
            }
        } catch (decodeErr) {
            console.warn(`[SI Debug] Could not decode token for ${username}, falling back to typed name.`);
        }

        const headers = {
            'authorization': `Token ${token}`,
            'role': 'USER',
            'username': siUsername,
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'application/json'
        };

        const submissions: Submission[] = [];
        const seenIds = new Set<string>();

        // Contests to check (Add more if discovered)
        const contests = ['smart-interviews-basic', 'smart-interviews-primary'];

        for (const contestSlug of contests) {
            try {
                const payload = {
                    page: 0,
                    pageSize: 25, // Fetch a decent chunk
                    contestSlug: contestSlug
                };

                const { data } = await axios.post(SI_API_GOLDMINE, payload, { headers });

                if (!data || !data.data || !data.data.submissions) {
                    console.log(`[SI Debug] No submissions found for ${username} in ${contestSlug}. Response keys:`, Object.keys(data?.data || {}));
                    continue;
                }

                if (Array.isArray(data.data.submissions)) {
                    for (const sub of data.data.submissions) {


                        const isAccepted = sub.verdict === 'Accepted';
                        if (!isAccepted) continue;

                        // Deduplicate using solutionId
                        if (seenIds.has(sub.solutionId)) continue;
                        seenIds.add(sub.solutionId);

                        const timestamp = Math.floor(new Date(sub.submittedAt).getTime() / 1000);

                        // Construct URL
                        const problemSlug = sub.problemSlug;

                        let url = `https://hive.smartinterviews.in/submission/${sub.solutionId}`;
                        if (problemSlug) {
                            url = `https://hive.smartinterviews.in/contest/${contestSlug}/problem/${problemSlug}`;
                        }

                        submissions.push({
                            id: `SI-${sub.solutionId}`,
                            title: sub.problemTitle || 'Unknown Problem',
                            titleSlug: problemSlug || `si-problem-${sub.solutionId}`,
                            timestamp: timestamp,
                            url: url
                        });
                    }
                }

            } catch (contestErr: any) {
                const errData = contestErr.response?.data;
                console.warn(`[SI Debug] Failed contest ${contestSlug} for ${username}:`, errData || contestErr.message);
                
                // If the token is actively rejected by the API, throw it upward so the user sees it in Discord!
                if (errData?.message?.includes('Authentication failed') || contestErr.response?.status === 401) {
                    throw new Error('Authentication failed (Token Expired!)');
                }
            }
        }

        return submissions;

    } catch (error: any) {
        console.warn('SmartInterviews fetch exception:', error.message);
        throw error;
    }
}
