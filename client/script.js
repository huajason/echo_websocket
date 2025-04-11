document.addEventListener('DOMContentLoaded', () => {
    const token = "valid_token"; // Replace with actual token retrieval logic
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws?token=${token}`);

    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesDiv = document.getElementById('messages');

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };

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

    // Handle incoming messages
    ws.onmessage = (event) => {
        const message = createChatBubble(event.data, 'left');
        messagesDiv.appendChild(message);
        scrollToBottom();
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    // Handle sending messages
    function sendMessage() {
        const message = messageInput.value;
        if (message.trim() === '') return;
        const sentMessage = createChatBubble(message, 'right');
        messagesDiv.appendChild(sentMessage);
        ws.send(message);
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
