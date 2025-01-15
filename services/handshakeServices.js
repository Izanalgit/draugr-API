const tokenConfig = require('../config/tokens');
const toknesHandShake = require('../memory/tokensHS');
const toknesCSRF = require('../memory/tokensCSRF');
const { newId } = require('../utils/genId');
const { genToken } = require('../utils/genToken');
const { decodeToken } = require('../utils/decodeToken');
const { dataHasher, dataCompare } = require('../utils/hasher');
const { msgErr } = require('../utils/errorsMsg');

// Create and save Handshake Token
const getHSToken = async () => {
    const hsUUID = newId();
    const hashedID = await dataHasher(hsUUID);

    const hsToken = genToken(
        {handshakeID:hashedID},
        tokenConfig.handShakeSecret,
        tokenConfig.expireTime
    );

    toknesHandShake.set(hsToken,hsUUID);

    return hsToken;
}

// Create and save CSRF Token
const getCSRFToken = async () => {
    const csrfUUID = newId();
    const hashedID = await dataHasher(csrfUUID);

    const csrfToken = genToken(
        {csrfID:hashedID},
        tokenConfig.CSRFSecret,
        tokenConfig.expireTime
    );

    toknesCSRF.set(csrfToken,csrfUUID);

    return csrfToken;
}

// Check Handshake Token
const checkHSToken = async (hsToken) => {
    const hsID = toknesHandShake.get(hsToken);

    const hasedHSID = decodeToken(
        hsToken,
        tokenConfig.handShakeSecret
    ).handshakeID;

    // Memory and Token check
    if(!hsID || !hasedHSID){
        msgErr.errConsole('check HSToken',`HSID : ${hsID} , DECODED : ${hasedHSID}`);
        return false;
    }

    const compareHash = await dataCompare(hsID,hasedHSID);

    // Hash check
    if(!compareHash){
        msgErr.errConsole('check HSToken','hash comparesion failed !!');
        return false;
    }

    return true;
    
}

// Check CSRF Token
const checkCSRFToken = async (csrfToken) => {
    const csrfID = toknesCSRF.get(csrfToken);

    const hasedCSRFID = decodeToken(
        csrfToken,
        tokenConfig.CSRFSecret
    ).csrfID;

    // Memory and Token check
    if(!csrfID || !hasedCSRFID){
        msgErr.errConsole('check CSRFToken',`CSRFID : ${csrfID} , DECODED : ${hasedCSRFID}`);
        return false;
    }

    const compareHash = await dataCompare(csrfID,hasedCSRFID);

    // Hash check
    if(!compareHash){
        msgErr.errConsole('check CSRFToken','hash comparesion failed !!');
        return false;
    }

    return true;
}

// Clean Handshake memory
const cleanHSMemory = () => {
    const now = Date.now();

    for (const [hsToken, data] of toknesHandShake.entries()) {

        const decoded = decodeToken(hsToken, tokenConfig.handShakeSecret);
        
        if (decoded && decoded.exp * 1000 <= now)
            toknesHandShake.delete(hsToken);
    }
    
}

// Clean CSRF memory
const cleanCSRFMemory = () => {
    const now = Date.now();

    for (const [csrfToken, data] of toknesCSRF.entries()) {

        const decoded = decodeToken(csrfToken, tokenConfig.CSRFSecret);
        
        if (decoded && decoded.exp * 1000 <= now)
            toknesCSRF.delete(csrfToken);
    }
    
}

module.exports = {
    getHSToken,
    getCSRFToken,
    checkHSToken,
    checkCSRFToken,
    cleanHSMemory,
    cleanCSRFMemory,
}