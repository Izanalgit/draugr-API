const jwt = require('jsonwebtoken');

function genToken(payload,expires){
    const options = { expiresIn: expires, issuer: 'DraugrChat'};
    return jwt.sign(payload,process.env.JWT_SECRET,options);
}

module.exports = {genToken}