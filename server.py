from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Message(BaseModel):
    content: str
    timestamp: float
    sender: str

messages: List[Message] = []

@app.post('/send_message')
async def send_message(message: Message):
    message.timestamp = time.time()
    messages.append(message)
    return {"Status": "Message from {message.sender} sent successfully!"}

@app.get('/get_messages')
async def get_messages(after: float = 0):
    return [msg for msg in messages if msg.timestamp > after]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)