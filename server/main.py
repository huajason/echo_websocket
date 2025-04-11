from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# A simple in-memory store for connected clients
connected_clients = {}

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    logger.info(f"Validating token: {token}")
    if token == "valid_token":
        return {"username": "user"}
    logger.error("Invalid token")
    raise Exception("Invalid token")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    logger.info("WebSocket connection attempt")
    try:
        user = await get_current_user(token)
        username = user["username"]

        await websocket.accept()
        logger.info(f"WebSocket connection established for user: {username}")
        connected_clients[username] = websocket

        try:
            while True:
                data = await websocket.receive_text()
                logger.info(f"Received message from {username}: {data}")
                await websocket.send_text(f"{data}，当然了！")
        except WebSocketDisconnect:
            del connected_clients[username]
            logger.info(f"{username} disconnected")
    except Exception as e:
        logger.error(f"WebSocket connection failed: {e}")
        await websocket.close()

@app.get("/token")
def get_token():
    # Dummy endpoint to provide a token for testing
    return {"access_token": "valid_token", "token_type": "bearer"}