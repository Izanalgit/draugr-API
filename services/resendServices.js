const resend = require('../config/resend');
const {msgErr} = require('../utils/errorsMsg');

async function sendInvitationEmail(sender, email, chatToken, userToken) {
    try {
        const response = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: `${sender} te invita a un chat privado`,
        html: `
            <h1>¡Hola!</h1>
            <p>Haz clic en el siguiente enlace para unirte al chat:</p>
            <a href="${process.env.CLIENT_URL}/${chatToken}/${userToken}">CHAT</a>
        `,
        });

        console.log('Email sended : ', response);
        return response;
    } catch (error) {
        msgErr.errConsole('send invite email',error)
        throw error;
    }
}

module.exports = {sendInvitationEmail};