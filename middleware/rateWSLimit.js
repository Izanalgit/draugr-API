const {rateLimiter} = require('../utils/rateLimiter');

const  wsRateLimiter = (key, limit, windowMs, ws) => {
    if (!rateLimiter(key, limit, windowMs)) {
        ws.send(JSON.stringify({ error: 'Límite de mensajes excedido' , code: 429}));
        return false;
    }
    return true;
}

module.exports = wsRateLimiter;