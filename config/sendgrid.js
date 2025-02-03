const sendgridConfig = {
    apiKey: process.env.SENDGRID_API_KEY,
    sender: process.env.EMAIL_SENDER
};

module.exports = sendgridConfig;