import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../utils/rate-limiter.js';

describe('RateLimiter', () => {
    it('allows requests within limit without delay', async () => {
        const rl = new RateLimiter(5, 1000);
        const start = Date.now();
        for (let i = 0; i < 5; i++) await rl.throttle();
        expect(Date.now() - start).toBeLessThan(100);
    });

    it('throttles when limit is exceeded', async () => {
        const rl = new RateLimiter(2, 200);
        const start = Date.now();
        for (let i = 0; i < 3; i++) await rl.throttle();
        expect(Date.now() - start).toBeGreaterThanOrEqual(190);
    });

    it('resets after window expires', async () => {
        const rl = new RateLimiter(2, 100);
        for (let i = 0; i < 2; i++) await rl.throttle();
        await new Promise(res => setTimeout(res, 110));
        const start = Date.now();
        for (let i = 0; i < 2; i++) await rl.throttle();
        expect(Date.now() - start).toBeLessThan(100);
    });
});
