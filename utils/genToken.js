const {tokenSecret} = require('../config/tokens');
const jwt = require('jsonwebtoken');

function genToken(payload,expires){
    const options = { expiresIn: expires, issuer: 'DraugrChat'};
    return jwt.sign(payload,tokenSecret,options);
}

module.exports = {genToken}