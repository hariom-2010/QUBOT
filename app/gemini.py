import os

from dotenv import load_dotenv
from google import genai


# =========================================
# ENVIRONMENT
# =========================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# =========================================
# GEMINI CLIENT
# =========================================

client = None

if GEMINI_API_KEY:
    client = genai.Client(
        api_key=GEMINI_API_KEY
    )


# =========================================
# GENERATE RESPONSE
# =========================================

async def generate_reply(
    messages: list[dict]
) -> str:

    # -----------------------------------------
    # DEMO MODE
    # -----------------------------------------

    if client is None:

        last_message = ""

        if messages:
            last_message = messages[-1].get(
                "content",
                ""
            )

        return (
            "Hello! I'm QUBOT. ⚛️\n\n"
            "QUBOT is currently running in "
            "demo mode.\n\n"
            f"You said:\n{last_message}\n\n"
            "Connect a Gemini API key to enable "
            "real AI responses."
        )


    # -----------------------------------------
    # CONVERSATION
    # -----------------------------------------

    contents = []

    for message in messages:

        role = message.get(
            "role",
            "user"
        )

        content = message.get(
            "content",
            ""
        )

        if not content.strip():
            continue


        gemini_role = (
            "model"
            if role == "assistant"
            else "user"
        )


        contents.append(
            {
                "role": gemini_role,
                "parts": [
                    {
                        "text": content
                    }
                ]
            }
        )


    # -----------------------------------------
    # GEMINI REQUEST
    # -----------------------------------------

    response = client.models.generate_content(

        model="gemini-2.5-flash",

        contents=contents,

        config={
            "system_instruction": (
                "You are QUBOT, a helpful and "
                "friendly AI assistant. "
                "Answer clearly and accurately. "
                "Use Markdown when useful. "
                "Do not claim to be human."
            )
        }
    )


    # -----------------------------------------
    # RESPONSE
    # -----------------------------------------

    return (
        response.text
        or "QUBOT could not generate a response."
    )