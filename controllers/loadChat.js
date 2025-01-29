const {getSession} = require('../services/sessionsServices');
const {msgErr} = require('../utils/errorsMsg');

module.exports = (req,res) => {

    if (!req.body.payload) {
        return res
            .status(400)
            .json({ error: msgErr.errPayloadRequired});
    }

    try {
        
        const {chatToken, userToken} = req.body.payload;

        if (!chatToken || !userToken) {
            return res
                .status(400)
                .json({ error: msgErr.errPayloadIncorrect});
        }
        
        // Get session 
        const chatSession = getSession(chatToken); // may have to deconstruct

        // Check session
        if (!chatSession) {
            msgErr.errConsole('load chat','chat session not found')
            return res
                .status(404)
                .json({ error: 'Sesión de chat no encontrada'});
        }

        // Check userToken
        if(userToken != chatSession.authTokens.user2) {
            msgErr.errConsole('load chat','user token not equal')
            return res
                .status(404)
                .json({ error: 'Token de usuario incorrecto'});
        }
            
        res
            .status(200)
            .json({ 
                message: 'Chat cargado',
                keys:{
                    user: chatSession.keys.user2.privateKey,
                    contact: chatSession.keys.user1.publicKey,
                },
                sessionTime:chatSession.createdAt,
            })

    } catch (error) {
        msgErr.errConsole('load chat',error)
        res
            .status(500)
            .json({ error: msgErr.errGeneral('loading chat') });
    }

}