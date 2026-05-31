// Simple in-memory TTL (Time-To-Live) cache to prevent hammering APIs
// For V4, this would be replaced with Redis.

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export async function withCache<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>
): Promise<T> {
    const now = Date.now();
    const cached = memoryCache.get(key);

    // Return cached data if it exists and hasn't expired
    if (cached && cached.expiresAt > now) {
        console.log(`[Cache] HIT on ${key}`);
        return cached.data;
    }

    console.log(`[Cache] MISS on ${key}. Fetching fresh data...`);
    
    // Fetch fresh data
    const freshData = await fetcher();
    
    // Store in cache
    memoryCache.set(key, {
        data: freshData,
        expiresAt: now + (ttlSeconds * 1000)
    });

    // Fire-and-forget cleanup to prevent memory leaks from inactive users
    setTimeout(() => {
        const entry = memoryCache.get(key);
        // Only delete if it's the SAME entry (hasn't been refreshed)
        if (entry && entry.expiresAt <= Date.now() + 100) {
            memoryCache.delete(key);
        }
    }, (ttlSeconds * 1000) + 1000);

    return freshData;
}
