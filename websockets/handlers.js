const activeConnections = require('./connections');
const wsAuthMiddleware = require('../middleware/authWSCheck');
const { wsDecryptMiddleware } = require('../middleware/decryptWS')
const wsRateLimiter = require('../middleware/rateWSLimit');
const rateLimits = require('../config/rateLimits');
const validateMessage = require('./validateMessage');
const { sendAcceptedChat , sendEncryptedMessage , sendDisconnectMessage } = require('./events');
const { getSession , getSessionByAuth} = require('../services/sessionsServices');
const { msgErr } = require('../utils/errorsMsg');

//WSS HANDLER
async function handleSocketConnection(ws, req) {
    
    const urlWS = req.url;

    // Init connection as alive
    ws.isAlive = true;

    // Get pong , get alive
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    wsDecryptMiddleware(ws, async (data, socket) => {
        console.log('WS MESSAGE HANDLER')//CHIVATO

        // Auth messages
        const isAuthenticated = await wsAuthMiddleware(urlWS);
        if (!isAuthenticated)
            ws.close(4002, 'Token de autenticación inválido');

        try {
            const { chatToken, authToken, action, encryptedMessage } = JSON.parse(data);
            console.log('---action--- : ',action)//CHIVATO

            // Check format
            if (!chatToken || !authToken)
                return socket.send(JSON.stringify({ error: 'Token inválido' }));

            const session = getSession(chatToken);
            if (!session) 
                throw new Error('Session not found');

            // Check session and authToken
            validateMessage(session, authToken);

            // Rate limit
            if (!wsRateLimiter(
                    authToken, 
                    rateLimits.messages.limit, 
                    rateLimits.messages.windowMs, 
                    socket
                )) return;

            // Create connection
            if (!activeConnections.has(authToken)) {
                activeConnections.set(authToken, socket);
                console.log(`User registered: ${authToken}`); //CHIVATO
            }

            // Recipient user select
            const recipientKey = authToken === session.authTokens.user1 
                ? session.authTokens.user2 
                : session.authTokens.user1;

            // Check if recipient is connected
            const recipientWs = activeConnections.get(recipientKey);
            
            // WS Actions
            if (recipientWs) {
                console.log(`Message sent :`, action); //CHIVATO
                switch (action) {
                    case 'CHAT_ACCEPTED':
                        sendAcceptedChat(authToken,recipientWs);
                        break;
                    case 'ENCRYPTED_MESSAGE':
                        sendEncryptedMessage(authToken,recipientWs,encryptedMessage);
                        break;
                    default:
                        socket.send(JSON.stringify({ error: 'Acción no reconocida' }));
                        break;
                }
            }
            else
                socket.send(JSON.stringify({ error: 'Contacto desconectado' }));

        } catch (error) {
            msgErr.errConsole('process message chat',error.message)
            socket.send(JSON.stringify({ error: 'Error procesando mensaje' }));
        }
    });

    //WSS CLOSE
    ws.on('close', () => {
        console.log('Connection closed'); //CHIVATO

        let disconnectdAuthToken = null;

        // Get disconnect user from active connections
        for (const [authToken, socket] of activeConnections.entries()) {
            if (socket === ws) {
                disconnectdAuthToken = authToken;
                break;
            }
        }

        if (!disconnectdAuthToken) return;

        // Advice contact and delete connection
        const session = getSessionByAuth(disconnectdAuthToken);

        if(session){
            const recipientKey = disconnectdAuthToken === session.authTokens.user1
                ? session.authTokens.user2
                : session.authTokens.user1;
        
            const recipientWs = activeConnections.get(recipientKey);
            
            if(recipientWs){
                sendDisconnectMessage(disconnectdAuthToken,recipientWs);
            
                setTimeout(() => {
                    activeConnections.delete(recipientKey);
                    recipientWs.terminate();
                    console.log(`Connection terminated for user recipient`);//CHIVATO
                }, 100);
            }
        }

        //Disconnect user
        activeConnections.delete(disconnectdAuthToken);
        console.log(`Connection terminated for user disconnected`);//CHIVATO

    });
}

// Ping/Pong interval
const interval = setInterval(() => {
    activeConnections.forEach((ws, authToken) => {
        if (ws.isAlive === false) {
            console.log(`Terminating inactive connection: ${authToken}`); //CHIVATO
            activeConnections.delete(authToken);
            
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
    });
}, 60000);

// Ping/Pong signal termination
process.on('SIGTERM', () => {
    clearInterval(interval);
    console.log('WebSocket server shutting down'); //CHIVATO
});

module.exports = { handleSocketConnection };