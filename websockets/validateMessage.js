const { decodeToken } = require('../utils/decodeToken');
const { tokenSecret } = require('../config/tokens');

const validateMessage = (session, authToken) => {
    // Check chatToken
    if (!session) 
        throw new Error('Session not found');

    // Check authToken
    if (!Object.values(session.authTokens).includes(authToken)) 
        throw new Error('Invalid AuthToken');

    // Check user UUID
    const userUUID = decodeToken(authToken, tokenSecret).user;
    if(!Object.values(session.authIDs).includes(userUUID))
        throw new Error('Invalid user UUID');
}

module.exports = validateMessage;