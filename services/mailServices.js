const sendgridConfig = require('../config/sendgrid');
const sgMail = require('@sendgrid/mail');
const {msgErr} = require('../utils/errorsMsg');

sgMail.setApiKey(sendgridConfig.apiKey);

async function sendInvitationEmail(sender, email, chatToken, userToken, message) {
    try {
        await sgMail.send({
            to: email,
            from: sendgridConfig.sender,
            subject: `${sender} te invita a un chat privado`,
            html: `
                <h1>¡Hola!</h1>
                <p>${message ? message : 'Te invito a tener un chat privado.'}</p>
                <p>Haz clic en el siguiente enlace para unirte al chat:</p>
                <a href="${process.env.CLIENT_URL}/response?chatToken=${encodeURIComponent(chatToken)}&userToken=${encodeURIComponent(userToken)}">CHAT</a>
            `,
        });

        return true;
    } catch (error) {
        msgErr.errConsole('send invite email',error)
        throw error;
    }
}

module.exports = {sendInvitationEmail};