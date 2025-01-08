require('dotenv').config();

const clientURL = process.env.CLIENT_URL;
const apiURL = process.env.HOST;

if (!clientURL || !apiURL) {
    throw new Error('ERROR : CLIENT_URL or HOST not defined on enviorement');
}

const allowedOrigins = [
    clientURL,       
    apiURL,        
    'http://localhost:5173' //Dev env        
];

module.exports = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`ERROR : Origin not allowed by CORS : ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    exposedHeaders: ['Authorization']
};