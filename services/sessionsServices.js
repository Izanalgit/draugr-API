const sessionStore = require('../memory/sessions');
const tokenConfig = require('../config/tokens');
const {generateKeyPair} = require('../utils/chatKeys');
const {newId} = require('../utils/genId');
const {genToken} = require('../utils/genToken');

// Create session
const createSession = () => {
    // User pair keys
    const keysUser1 = generateKeyPair();
    const keysUser2 = generateKeyPair();

    // UUIDs gen
    const authUser1 = newId();
    const authUser2 = newId();

    // Token gen
    const chatToken = genToken({chat: newId()},tokenConfig.tokenSecret,tokenConfig.expireTime);
    const authTokenUser1 = genToken({user: authUser1},tokenConfig.tokenSecret,tokenConfig.expireTime);
    const authTokenUser2 = genToken({user: authUser2},tokenConfig.tokenSecret,tokenConfig.expireTime);

    // Session obj gen
    const sessionData = {
        authTokens: {
            user1: authTokenUser1,
            user2: authTokenUser2,
        },
        authIDs:{
            user1: authUser1,
            user2: authUser2,
        },
        keys: {
            user1: {
                publicKey: keysUser1.publicKey,
                privateKey: keysUser1.privateKey,
            },
            user2: {
                publicKey: keysUser2.publicKey,
                privateKey: keysUser2.privateKey,
            },
        },
        createdAt: Date.now(),
    };

    // Save session on sessionStore
    sessionStore.set(chatToken, sessionData);

    // Return for user1
    return {
        chatToken,
        authTokens: {
            user1: authTokenUser1,
            user2: authTokenUser2,
        },
        keys: {
            privateKey: sessionData.keys.user1.privateKey,
            publicKeyRecipient: sessionData.keys.user2.publicKey,
        },
        createdAt:sessionData.createdAt,
    };
};

// Get session from sessionStore
const getSession = (chatToken) => {
    return sessionStore.get(chatToken) || null;
};

// Delete session
const deleteSession = (chatToken) => {
    sessionStore.delete(chatToken);
};

// Clean expired sessions
const cleanExpiredSessions = () => {
    const now = Date.now();
    const expirationTime = 60 * 60 * 1000; // 1h

    for (const [chatToken, session] of sessionStore.entries()) {
        if (now - session.createdAt > expirationTime)
            deleteSession(chatToken);
    }
};

module.exports = {
    createSession,
    getSession,
    deleteSession,
    cleanExpiredSessions,
};
