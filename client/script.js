document.addEventListener('DOMContentLoaded', () => {
    const token = "valid_token"; // Replace with actual token retrieval logic
    const wsUrl = `ws://127.0.0.1:8000/ws?token=${token}`;
    let websocket;

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');

    function connectWebSocket() {
        websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
            console.log("Connected to WebSocket server.");
        };

        websocket.onmessage = (event) => {
            const message = createChatBubble(event.data, 'left');
            messagesDiv.appendChild(message);
            scrollToBottom();
        };

        websocket.onclose = () => {
            console.log("WebSocket connection closed. Attempting to reconnect...");
            displayWarningMessage('Server disconnected. Unable to send messages.');
            setTimeout(connectWebSocket, 3000); // Retry connection every 3 seconds
        };

        websocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    connectWebSocket();

    // Scroll to the bottom when a new message is added
    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Utility function to create a chat bubble
    function createChatBubble(text, align) {
        const bubble = document.createElement('div');
        bubble.textContent = text;
        bubble.className = `chat-bubble ${align}`;
        return bubble;
    }

    // Utility function to display warning messages
    function displayWarningMessage(text) {
        const existingWarning = document.querySelector('.warning-message');
        if (existingWarning) {
            existingWarning.textContent = text; // Update the existing warning message
            return;
        }

        const warningMessage = document.createElement('div');
        warningMessage.textContent = text;
        warningMessage.className = 'warning-message';
        messagesDiv.appendChild(warningMessage);
        scrollToBottom();
    }

    // Handle sending messages
    function sendMessage() {
        if (websocket.readyState !== WebSocket.OPEN) {
            displayWarningMessage('Cannot send message. Server is disconnected.');
            return;
        }

        const message = messageInput.value;
        if (message.trim() === '') return;
        const sentMessage = createChatBubble(message, 'right');
        messagesDiv.appendChild(sentMessage);
        websocket.send(message);
        messageInput.value = '';
        scrollToBottom();
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});