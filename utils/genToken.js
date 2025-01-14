const jwt = require('jsonwebtoken');

function genToken(payload,secret,expires){
    const options = { expiresIn: expires, issuer: 'DraugrChat'};
    return jwt.sign(payload,secret,options);
}

module.exports = {genToken}