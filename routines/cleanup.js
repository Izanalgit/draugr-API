const { cleanRateLimiters } = require('../utils/rateLimiter');
const { cleanExpiredSessions } = require('../services/sessionsServices');
const { cleanHSMemory, cleanCSRFMemory } = require('../services/handshakeServices');
const { msgErr } = require('../utils/errorsMsg');

const CLEAN_INTERVAL = require('../config/cleanTime');

const startCleanupRoutines = () => {
    setInterval(() => {

        try {
            cleanRateLimiters(CLEAN_INTERVAL);
        } catch (err) {
            msgErr.errConsole('cleaning rate limiters:', err);
        }

        try {
            cleanExpiredSessions();
        } catch (err) {
            msgErr.errConsole('cleaning expired sessions:', err);
        }

        try {
            cleanHSMemory();
        } catch (err) {
            msgErr.errConsole('cleaning Handshake Memory:', err);
        }

        try {
            cleanCSRFMemory();
        } catch (err) {
            msgErr.errConsole('cleaning CSRF Memory:', err);
        }

        console.log('Clean memory routine...'); //CHIVATO
        
    }, CLEAN_INTERVAL);
};

module.exports = { startCleanupRoutines };