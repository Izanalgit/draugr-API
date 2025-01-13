const {getSession} = require('../services/sessionsServices');
const {msgErr} = require('../utils/errorsMsg');

module.exports = (req,res) => {

    if (!req.body.payload) {
        return res
            .status(400)
            .json({ error: msgErr.errPayloadRequired});
    }

    try {
        
        const {chatToken} = res.body.payload

        if (!chatToken) {
            return res
                .status(400)
                .json({ error: msgErr.errPayloadIncorrect});
        }
        
        // Get session 
        const {chatSession} = getSession(chatToken);

        // Check session
        if (!chatSession) {
            msgErr.errConsole('load chat','chat session not found')
            return res
                .status(404)
                .json({ error: 'Sesión de chat no encontrada'});
        }
            
        res
            .status(200)
            .json({ 
                message: 'Chat cargado',
                keys:{
                    user: chatSession.keys.user2.privateKey,
                    contact: chatSession.keys.user1.publicKey,
                }
            })

    } catch (error) {
        msgErr.errConsole('load chat',error)
        res
            .status(500)
            .json({ error: msgErr.errGeneral('loading chat') });
    }

}