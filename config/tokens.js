const crypto = require('crypto');

function createSecret(){

    const secret = crypto.randomBytes(64).toString('hex');
    
    return secret;
}

const tokenSecret = createSecret();

const tokenConfig = {
    tokenSecret,
    expireTime: '1h',
};

module.exports = tokenConfig;