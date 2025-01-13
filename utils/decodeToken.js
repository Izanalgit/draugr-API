const {tokenSecret} = require('../config/tokens');

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, tokenSecret);
        return decoded; 
    } catch (err) {
        throw new Error(`Token decoded failed`);
    }
}

module.exports = {decodeToken};