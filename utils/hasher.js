const bcrypt = require('bcrypt');

// Hash data
async function dataHasher(data) {
    const salt = 10;
    
    const hashedData = await bcrypt.hash(data, salt);
    
    return hashedData;
}

// Compare data and hash
async function dataCompare(plainData, hashedData) {
    
    const dataComparsion = await bcrypt.compare(plainData, hashedData);
    
    return dataComparsion;
}

module.exports = {dataHasher,dataCompare};