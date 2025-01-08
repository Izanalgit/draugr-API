const resend = require('../config/resend');

async function sendInvitationEmail(email, chatToken, userToken) {
    try {
        const response = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Tu invitación al chat',
        html: `
            <h1>¡Hola!</h1>
            <p>Haz clic en el siguiente enlace para unirte al chat:</p>
            <a href="${process.env.CLIENT_URL}/${chatToken}/${userToken}">CHAT</a>
        `,
        });

        console.log('mail sended : ', response);
        return response;
    } catch (error) {
        console.error('ERROR : send invite mail : ', error);
        throw error;
    }
}

module.exports = {sendInvitationEmail};