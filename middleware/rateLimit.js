const {rateLimiter} = require('../utils/rateLimiter');
const { msgErr } = require('../utils/errorsMsg');

const ratesMiddleware =  (key, { limit, windowMs }) => (req, res, next) => {
    if (!rateLimiter(key, limit, windowMs)) {
        msgErr.errConsole('Rate limit', 'carfull, possible bf attack!')
        return res
            .status(429)
            .json({ error: 'Demasiadas requests' });
    }
    next();
};

module.exports = ratesMiddleware;