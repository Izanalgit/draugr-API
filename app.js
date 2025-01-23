const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { startCleanupRoutines } = require('./routines/cleanup');
const { decryptMiddleware } = require('./middleware/decryptHTTP');
const { wsDecryptMiddleware } = require('./middleware/decryptWS');

const { handleSocketConnection } = require('./websockets/handlers');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'http://localhost';

//SECURITY
app.use(cors(require('./config/cors')));
app.use(helmet());

//RESPONSES COMPRESSION
app.use(compression());

//JSON PARSER
// app.use(express.urlencoded({extended:true}));
// app.use(express.json());

//LOGGER
app.use(morgan('dev'));

//WEBSOCKET INIT
const wss = new WebSocket.Server({server});
wss.on('connection', (ws, req) => {
    wsDecryptMiddleware(ws, () => {
        handleSocketConnection(ws, req);
    });
});

//HEALTH
app.get('/',(req,res)=>res.status(200).send('API IS RUNNING HEALTHY'));

//API ROUTES
app.use('/api',decryptMiddleware, require('./routes'));

//API LISTEN
server.listen(PORT, () => {
    console.log(`Server on ${HOST}:${PORT}`);

    //ROUTINES
    startCleanupRoutines();
})