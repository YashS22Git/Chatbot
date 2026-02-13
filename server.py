from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import uvicorn
from pymongo import MongoClient
from typing import Optional
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "chatbot_localllm")

try:
    mongo_client = MongoClient(MONGODB_URI)
    db = mongo_client[MONGODB_DB_NAME]
    sessions_collection = db["sessions"]
    messages_collection = db["messages"]
    # Test connection
    mongo_client.server_info()
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    db = None

# Firebase Admin SDK (optional - for server-side token verification)
# For now, we'll trust the client-side token and use Firebase Auth on frontend only
# If you want server-side verification, you'll need to download the service account key

class ChatRequest(BaseModel):
    model: str
    messages: list
    session_id: Optional[str] = None
    user_id: str
    temperature: Optional[float] = 0.7

class CreateSessionRequest(BaseModel):
    title: str = "New Chat"
    user_id: str

@app.post("/api/chat/new")
def create_session(request: CreateSessionRequest):
    session = {
        "_id": str(datetime.now().timestamp()),
        "user_id": request.user_id,
        "title": request.title,
        "created_at": datetime.now()
    }
    sessions_collection.insert_one(session)
    return {"session_id": session["_id"], "title": request.title}

@app.get("/api/history/{user_id}")
def get_history(user_id: str):
    sessions = list(sessions_collection.find(
        {"user_id": user_id},
        {"user_id": 0}
    ).sort("created_at", -1))
    
    # Convert ObjectId to string and datetime to ISO format
    for session in sessions:
        session["id"] = str(session.pop("_id"))
        session["created_at"] = session["created_at"].isoformat()
    
    return {"sessions": sessions}

@app.get("/api/history/{user_id}/{session_id}")
async def get_session_history(user_id: str, session_id: str):
    # Get messages for a specific session
    messages = list(db.messages.find(
        {"user_id": user_id, "session_id": session_id},
        {"_id": 0}
    ).sort("created_at", 1)) # Assuming 'created_at' is the correct field, not 'timestamp'
    
    # Convert datetime to ISO format
    for msg in messages:
        msg["created_at"] = msg["created_at"].isoformat()
    
    return {"messages": messages}

@app.delete("/api/history/{user_id}/{session_id}")
def delete_session(user_id: str, session_id: str):
    messages_collection.delete_many({"user_id": user_id, "session_id": session_id})
    sessions_collection.delete_one({"_id": session_id, "user_id": user_id})
    return {"status": "deleted"}

@app.get("/api/models")
def get_models():
    try:
        models_info = ollama.list()
        if hasattr(models_info, 'models'):
             models = [m.model for m in models_info.models]
        else:
             models = [m['model'] for m in models_info.get('models', [])]
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Save user message if session exists
        if request.session_id:
            user_msg_content = request.messages[-1]['content']
            messages_collection.insert_one({
                "user_id": request.user_id,
                "session_id": request.session_id,
                "role": "user",
                "content": user_msg_content,
                "created_at": datetime.now()
            })

        def generate():
            try:
                full_response = ""
                stream = ollama.chat(
                    model=request.model, 
                    messages=request.messages, 
                    stream=True,
                    options={'temperature': request.temperature}
                )
                for chunk in stream:
                    content = chunk['message']['content']
                    if content:
                        yield content
                        full_response += content
                
                # Save assistant message
                if request.session_id and full_response:
                    messages_collection.insert_one({
                        "user_id": request.user_id,
                        "session_id": request.session_id,
                        "role": "assistant",
                        "content": full_response,
                        "created_at": datetime.now()
                    })
            except Exception as e:
                error_msg = f"\n\n[Error: {str(e)}. Please check if Ollama is running and the model is available.]"
                yield error_msg
                print(f"Error in chat stream: {e}")

        return StreamingResponse(generate(), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/history/{user_id}/{session_id}")
async def delete_session(user_id: str, session_id: str):
    """Delete a chat session and all its messages"""
    try:
        # Delete session from sessions collection
        sessions_collection.delete_one({"user_id": user_id, "session_id": session_id})
        # Delete all messages from messages collection
        messages_collection.delete_many({"user_id": user_id, "session_id": session_id})
        return {"status": "deleted", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
