//User 2 accepts chat
function sendAcceptedChat(sender, recipientWS) {
    recipientWS.send(JSON.stringify({
        type: 'CHAT_ACCEPTED',
        from: sender,
    }));
}

//Send encrypted message
function sendEncryptedMessage(sender, recipientWS, encryptedMessage) {
    recipientWS.send(JSON.stringify({
        type: 'ENCRYPTED_MESSAGE',
        from: sender,
        message: encryptedMessage,
    }));
}



module.exports = {
    sendAcceptedChat,
    sendEncryptedMessage,
};