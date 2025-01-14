const crypto = require('crypto');

function createSecret(){

    const secret = crypto.randomBytes(64).toString('hex');
    
    return secret;
}

const tokenSecret = createSecret();
const handShakeSecret = createSecret();
const CSRFSecret = createSecret();

const tokenConfig = {
    tokenSecret,
    handShakeSecret,
    CSRFSecret,
    expireTime: '1h',
};

module.exports = tokenConfig;