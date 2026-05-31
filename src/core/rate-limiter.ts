export class RateLimiter {
    private timestamps = new Map<string, number>();
    private cooldownMs: number;

    constructor(cooldownSeconds: number) {
        this.cooldownMs = cooldownSeconds * 1000;
    }

    /**
     * Checks if a user is currently rate-limited.
     * @returns {boolean} true if they are rate-limited (should be blocked), false if they can proceed.
     */
    public isRateLimited(userId: string): boolean {
        const now = Date.now();
        const lastExecution = this.timestamps.get(userId);

        if (lastExecution && now - lastExecution < this.cooldownMs) {
            return true;
        }

        // Action recorded, they are good to go.
        this.timestamps.set(userId, now);

        // Schedule cleanup to prevent memory leaks for huge servers
        setTimeout(() => this.timestamps.delete(userId), this.cooldownMs);

        return false;
    }

    /**
     * Gets remaining cooldown time in seconds.
     */
    public getRemainingSeconds(userId: string): number {
        const lastExecution = this.timestamps.get(userId);
        if (!lastExecution) return 0;
        
        const remaining = this.cooldownMs - (Date.now() - lastExecution);
        return remaining > 0 ? (remaining / 1000) : 0;
    }
}
