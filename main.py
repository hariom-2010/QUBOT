from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from app.gemini import generate_reply


# =========================================
# PATHS
# =========================================

BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_DIR = BASE_DIR / "static"


# =========================================
# APPLICATION
# =========================================

app = FastAPI(
    title="QUBOT",
    description="QUBOT - Quantum AI Assistant",
    version="1.0.0"
)


# =========================================
# MODELS
# =========================================

class Message(BaseModel):

    role: str

    content: str


class ChatRequest(BaseModel):

    messages: list[Message]


# =========================================
# HEALTH
# =========================================

@app.get("/api/health")
async def health_check():

    return {
        "status": "ok",
        "name": "QUBOT"
    }


# =========================================
# CHAT
# =========================================

@app.post("/api/chat")
async def chat(
    request: ChatRequest
):

    if not request.messages:

        raise HTTPException(
            status_code=400,
            detail="No messages provided."
        )


    messages = [

        {
            "role": message.role,

            "content": message.content
        }

        for message in request.messages

    ]


    try:

        reply = await generate_reply(
            messages
        )

        return {
            "reply": reply
        }


    except Exception as error:

        print(
            "QUBOT error:",
            error
        )

        raise HTTPException(

            status_code=500,

            detail=(
                "QUBOT could not generate "
                "a response."
            )

        )


# =========================================
# FRONTEND
# =========================================

app.mount(

    "/",

    StaticFiles(

        directory=STATIC_DIR,

        html=True

    ),

    name="static"

)
