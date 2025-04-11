document.addEventListener('DOMContentLoaded', () => {
    const token = "valid_token"; // Replace with actual token retrieval logic
    const wsUrl = `ws://127.0.0.1:8000/ws?token=${token}`;
    let websocket;

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContentDiv = document.getElementById('messagesContent');
    const messagesDiv = document.getElementById('messages');
    let notificationTimeout;

    function connectWebSocket() {
        websocket = new WebSocket(wsUrl);

        function updateStatusLabel(isOnline) {
            const statusLabel = document.getElementById('statusLabel');
            const statusCircle = statusLabel.querySelector('.status-circle');

            if (isOnline) {
                statusCircle.classList.add('online');
                statusCircle.classList.remove('offline');
            } else {
                statusCircle.classList.add('offline');
                statusCircle.classList.remove('online');
            }

        }

        websocket.onopen = () => {
            console.log("Connected to WebSocket server.");
            updateStatusLabel(true);
            scrollToBottom();
        };

        websocket.onmessage = (event) => {
            const message = createChatBubble(event.data, 'left');
            messagesContentDiv.appendChild(message);
            scrollToBottom();
        };

        websocket.onclose = () => {
            console.log("WebSocket connection closed. Attempting to reconnect...");
            updateStatusLabel(false);
            showNotification('Server disconnected. Unable to send messages.');
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
        messagesContentDiv.appendChild(warningMessage);
        scrollToBottom();
    }

    // Utility function to show notifications
    function showNotification(message) {
        const notification = document.getElementById('notification');

        // If a notification is already visible, do nothing
        if (notification.classList.contains('visible')) {
            return;
        }

        notification.textContent = message;
        notification.classList.remove('hidden');
        notification.classList.add('visible');

        // Hide the notification after 3 seconds
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('visible');
            notification.classList.add('hidden');
        }, 3000);
    }

    // Handle sending messages
    function sendMessage() {
        if (websocket.readyState !== WebSocket.OPEN) {
            return;
        }

        const message = messageInput.value;
        if (message.trim() === '') return;
        const sentMessage = createChatBubble(message, 'right');
        messagesContentDiv.appendChild(sentMessage);
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