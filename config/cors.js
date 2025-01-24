require('dotenv').config();
const { msgErr } = require('../utils/errorsMsg');

const clientURL = process.env.CLIENT_URL;
const apiURL = process.env.HOST;

if (!clientURL || !apiURL) {
    throw new Error('ERROR : CLIENT_URL or HOST not defined on enviorement');
}

const allowedOrigins = [
    clientURL,       
    apiURL,   
];

module.exports = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            msgErr.errConsole('CORS', `Origin not allowed : ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "POST",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ['Authorization']
};