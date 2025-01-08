function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; 
    } catch (err) {
        throw new Error('Token decoded failed: ', err.message);
    }
}

module.exports = {decodeToken};