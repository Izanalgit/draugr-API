const jwt = require('jsonwebtoken');

function decodeToken(token,secret) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded; 
    } catch (err) {
        throw new Error(`Token decoded failed`);
    }
}

module.exports = {decodeToken};