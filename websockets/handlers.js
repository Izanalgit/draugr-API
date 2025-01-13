const activeConnections = require('./connections');
const { getSession } = require('../services/sessionsServices');
const { decodeToken } = require('../utils/decodeToken')
const { msgErr } = require('../utils/errorsMsg');

//WSS HANDLER
function handleSocketConnection(ws, req) {

    ws.on('message', async (data) => {

        try {
            const { chatToken, authToken, encryptedMessage } = JSON.parse(data);

            // Check chatToken
            const session = getSession(chatToken);
            if (!session) 
                throw new Error('Session not found');

            // Check authToken
            if (!Object.values(session.authTokens).includes(authToken)) 
                throw new Error('Invalid AuthToken');

            // Check user UUID
            const userUUID = decodeToken(authToken).user;
            if(!Object.values(session.authIDs).includes(userUUID))
                throw new Error('Invalid user UUID');

            // Create connection
            if (!activeConnections.has(authToken)) {
                activeConnections.set(authToken, ws);
                console.log(`User registered: ${authToken}`);
            }

            // User select
            const recipientKey = authToken === session.authTokens.user1 
                ? session.authTokens.user2 
                : session.authTokens.user1;

            // Sens message if recipient user is connected
            const recipientWs = activeConnections.get(recipientKey);
            
            if (recipientWs) 
                recipientWs.send(JSON.stringify({ encryptedMessage }));
            else
                ws.send(JSON.stringify({ error: 'Contacto desconectado' }));

        } catch (error) {
            msgErr.errConsole('process message chat',error.message)
            ws.send(JSON.stringify({ error: 'Error procesando mensaje' }));
        }
    });

    //WSS CLOSE
    ws.on('close', () => {
        console.log('Conexión cerrada');

        // Delete user from active connections
        for (const [authToken, socket] of activeConnections.entries()) {
            if (socket === ws) {
                activeConnections.delete(authToken);
                break;
            }
        }
    });
}

module.exports = { handleSocketConnection };