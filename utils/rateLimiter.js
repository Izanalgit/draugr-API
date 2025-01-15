const rateLimiters = require('../memory/ratesLimits');

// Rate Limiter
const rateLimiter = (key, limit, windowMs) => {
    // Time window
    const now = Date.now();
    const windowStart = now - windowMs;

    // Add key to memory
    if (!rateLimiters.has(key))
        rateLimiters.set(key, []);

    // Clean timestamps
    const timestamps = rateLimiters.get(key).filter(ts => ts > windowStart);
    timestamps.push(now);

    // Add timeStamp to key on memory
    rateLimiters.set(key, timestamps);

    // Check timeStamp
    if (timestamps.length > limit)
        return false; 

    return true; 
}

// Clean rates limits
const cleanRateLimiters = (windowMs) => {
    const now = Date.now();
    const windowStart = now - windowMs;

    for (const [key, timestamps] of rateLimiters.entries()) {

        // Filter by timestamp
        const filtered = timestamps.filter(ts => ts > windowStart);

        // Delete time run out
        if (filtered.length === 0)
            rateLimiters.delete(key);
        // Keep the ones on window
        else 
            rateLimiters.set(key, filtered);
        
    }
};

module.exports = {rateLimiter, cleanRateLimiters};