const rateLimits = {
    handshake: { limit: 10, windowMs: 60 * 1000 },   
    messages: { limit: 50, windowMs: 60 * 1000 }, 
};

module.exports = rateLimits;