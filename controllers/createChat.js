const { createSession} = require('../services/sessionsServices');
const {sendInvitationEmail} = require('../services/mailServices');
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

        // Send mail by Sendrgid
        await sendInvitationEmail(sender,emailRecipient,session.chatToken,session.authTokens.user2,message);

        if(sendInvitationEmail)
            res
            .status(200)
            .json({
                message: 'Invitación enviada',
                chatToken: session.chatToken,
                userToken: session.authTokens.user1,
                keys: {
                    user: session.keys.privateKey,
                    contact: session.keys.publicKeyRecipient,
                },
                sessionTime:session.createdAt,
            });
        else 
            res
                .status(500)
                .json({ error: msgErr.errGeneral('sending invitation mail') });

    } catch (error) {
        msgErr.errConsole('create chat',error)
        res
            .status(500)
            .json({ error: msgErr.errGeneral('sending invitation mail') });
    }
};
