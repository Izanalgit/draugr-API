const { createSession} = require('../services/sessionsServices');
const {sendInvitationEmail} = require('../services/resendServices');
const {msgErr} = require('../utils/errorsMsg');

module.exports = async (req, res) => {

    if (!req.body.payload) {
        return res
            .status(400)
            .json({ error: msgErr.errPayloadRequired});
    }

    try {
        const { sender, emailRecipient, message } = req.body.payload;

        //payload needs validation

        if (!sender || !emailRecipient) {
            return res
                .status(400)
                .json({ error: msgErr.errPayloadIncorrect});
        }

        // Create session on memory
        const session = createSession();

        // Send mail by Resend
        await sendInvitationEmail(sender,emailRecipient,session.chatToken,session.authTokens.user2,message);

        res.json({
            message: 'Invitación enviada',
            chatToken: session.chatToken,
            userToken: session.authTokens.user1,
            keys: {
                user: session.keys.privateKey,
                contact: session.keys.publicKeyRecipient,
            },
        });

    } catch (error) {
        msgErr.errConsole('create chat',error)
        res
            .status(500)
            .json({ error: msgErr.errGeneral('sending invitation mail') });
    }
};
