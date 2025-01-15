const { cleanRateLimiters } = require('../utils/rateLimiter');
const { cleanExpiredSessions } = require('../services/sessionsServices');
const { cleanHSMemory, cleanCSRFMemory } = require('../services/handshakeServices');

const CLEAN_INTERVAL = require('../config/cleanTime');

const startCleanupRoutines = () => {
    setInterval(() => {

        cleanRateLimiters(CLEAN_INTERVAL); 
        cleanExpiredSessions();             
        cleanHSMemory();             
        cleanCSRFMemory();

        console.log('Clean memory routine...'); //CHIVATO ?
        
    }, CLEAN_INTERVAL);
};

module.exports = { startCleanupRoutines };