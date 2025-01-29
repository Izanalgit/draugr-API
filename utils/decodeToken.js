const jwt = require('jsonwebtoken');

function decodeToken(token,secret,ignoreExpired=false) {
    try {
        const decoded = jwt.verify(token, secret);

        if (decoded.iss !== 'DraugrChat'){
            console.warn('CAREFULL : INVALID ISSUER !!')
            throw new Error('Invalid issuer!')
        }

        return decoded;
         
    } catch (err) {

        if (err.name === 'JsonWebTokenError')
            throw new Error(`JWT Error: ${err.message}`);

        if (err.name === 'TokenExpiredError') {
            if (ignoreExpired)
                return jwt.decode(token);

            throw new Error(`Token expired at: ${err.expiredAt}`);
        }

        throw new Error(`Token decode failed: ${err.message}`);

    }
}

module.exports = {decodeToken };