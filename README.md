# WebSocket Chat Application

This project is a WebSocket-based chat application built with FastAPI for the backend and a simple HTML/JavaScript frontend.

## Features

- Real-time communication using WebSocket.
- Token-based authentication for secure connections.
- Chat interface styled to mimic popular messaging apps.

## Project Structure

```
client/
    index.html       # Frontend HTML file
    script.js        # Frontend JavaScript logic
    styles.css       # Frontend styling
server/
    main.py          # Backend FastAPI server
    README.md        # Project documentation
```

## Prerequisites

- Python 3.9 or higher
- Node.js (optional, for advanced frontend development)
- Conda (for virtual environment management)

## Setup Instructions

### Backend

1. Create a virtual environment using Conda:
   ```bash
   conda create -n fastapi_ws_env python=3.9 -y
   conda activate fastapi_ws_env
   ```

2. Install dependencies:
   ```bash
   pip install fastapi uvicorn
   ```

3. Run the FastAPI server:
   ```bash
   uvicorn server.main:app --reload
   ```

   The server will be available at `http://127.0.0.1:8000`.

### Frontend

1. Open `client/index.html` in a web browser.
2. Use the chat interface to send and receive messages in real-time.

## Usage

- Start the backend server as described above.
- Open the frontend in a browser.
- Enter a message in the input field and press Enter or click the Send button to send a message.
- Messages will appear in a chat-like interface, with sent messages aligned to the right and received messages aligned to the left.

## Notes

- The token for authentication is hardcoded as `valid_token` in this example. Replace it with a proper authentication mechanism for production use.
- The WebSocket server is configured to allow all origins (`*`) for development purposes. Restrict this in production.

## License

This project is licensed under the MIT License.