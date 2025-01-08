const { createSession} = require('../services/sessionsServices');
const {sendInvitationEmail} = require('../services/resendServices');

module.exports = async (req, res) => {
    try {
        const { sender, emailRecipient } = req.body.payload;

        if (!sender || !emailRecipient) {
            return res.status(400).json({ error: 'incorrect payload' });
        }

        // Crear sesión en memoria
        const session = createSession();

        // Enviar invitación por correo con Resend
        await sendInvitationEmail(emailRecipient,session.chatToken,session.authTokens.user2);

        res.json({
            message: 'Invitación enviada',
            chatToken: session.chatToken,
            authToken: session.authTokens.user1,
            keys: session.keys.user1,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el chat' });
    }
};
