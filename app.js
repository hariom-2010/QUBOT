/* =========================================
   QUBOT
   Frontend Controller
   ========================================= */


/* =========================================
   ELEMENTS
   ========================================= */

const introScreen =
    document.getElementById("introScreen");

const chatScreen =
    document.getElementById("chatScreen");

const enterButton =
    document.getElementById("enterButton");

const newChatButton =
    document.getElementById("newChatButton");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const sidebar =
    document.getElementById("sidebar");

const chatForm =
    document.getElementById("chatForm");

const messageInput =
    document.getElementById("messageInput");

const messages =
    document.getElementById("messages");

const welcomeMessage =
    document.getElementById("welcomeMessage");

const conversationList =
    document.getElementById("conversationList");

const suggestionButtons =
    document.querySelectorAll(".suggestion");

const sendButton =
    document.getElementById("sendButton");


/* =========================================
   STATE
   ========================================= */

let chatMessages = [];

let chatStarted = false;


/* =========================================
   ENTER QUBOT
   ========================================= */

enterButton.addEventListener(
    "click",
    () => {

        introScreen.style.opacity = "0";

        introScreen.style.transform =
            "scale(1.03)";

        introScreen.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";


        setTimeout(() => {

            introScreen.style.display =
                "none";

            chatScreen.classList.remove(
                "hidden"
            );

            messageInput.focus();

        }, 500);

    }
);


/* =========================================
   SEND MESSAGE
   ========================================= */

chatForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const text =
            messageInput.value.trim();


        if (!text) {
            return;
        }


        addUserMessage(text);


        messageInput.value = "";

        autoResize();


        await sendToQubot();

    }
);


/* =========================================
   SEND TO FASTAPI
   ========================================= */

async function sendToQubot() {

    setLoading(true);


    try {

        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        messages:
                            chatMessages
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "QUBOT server error"
            );

        }


        const data =
            await response.json();


        const reply =
            data.reply ||
            "QUBOT did not return a response.";


        addAssistantMessage(
            reply
        );


    } catch (error) {

        console.error(
            "QUBOT error:",
            error
        );


        addAssistantMessage(
            "⚠️ QUBOT is unable to connect to the backend right now.\n\nPlease check the server connection."
        );


    } finally {

        setLoading(false);

    }

}


/* =========================================
   ADD USER MESSAGE
   ========================================= */

function addUserMessage(text) {

    chatStarted = true;


    const message = {

        role: "user",

        content: text,

        time: new Date()

    };


    chatMessages.push(message);


    welcomeMessage.style.display =
        "none";


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "message-row";


    messageElement.innerHTML = `

        <div
            style="
                display: flex;
                justify-content: flex-end;
                width: 100%;
                margin-bottom: 20px;
            "
        >

            <div
                style="
                    max-width: 80%;
                    padding: 13px 17px;
                    border-radius: 17px;
                    background:
                        linear-gradient(
                            135deg,
                            rgba(0, 229, 255, 0.10),
                            rgba(56, 107, 255, 0.10)
                        );
                    border:
                        1px solid
                        rgba(0, 229, 255, 0.15);
                    color: #edf4ff;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    white-space: pre-wrap;
                    word-break: break-word;
                "
            >
                ${escapeHtml(text)}
            </div>

        </div>

    `;


    messages.appendChild(
        messageElement
    );


    scrollToBottom();

    updateConversationList();

}


/* =========================================
   ADD ASSISTANT MESSAGE
   ========================================= */

function addAssistantMessage(
    text
) {

    const message = {

        role: "assistant",

        content: text,

        time: new Date()

    };


    chatMessages.push(message);


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "message-row";


    messageElement.innerHTML = `

        <div
            style="
                display: flex;
                gap: 14px;
                width: 100%;
                margin-bottom: 24px;
            "
        >

            <div
                style="
                    width: 38px;
                    height: 38px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 11px;
                    background:
                        rgba(0, 229, 255, 0.08);
                    border:
                        1px solid
                        rgba(0, 229, 255, 0.25);
                    color: #00e5ff;
                    overflow: hidden;
                "
            >

                <img
                    src="/assets/logo.svg"
                    alt="QUBOT"
                    style="
                        width: 30px;
                        height: 30px;
                    "
                >

            </div>


            <div
                style="
                    flex: 1;
                    max-width: 800px;
                    color: #dce5f4;
                    font-size: 0.9rem;
                    line-height: 1.7;
                    white-space: pre-wrap;
                    word-break: break-word;
                "
            >
                ${escapeHtml(text)}
            </div>

        </div>

    `;


    messages.appendChild(
        messageElement
    );


    scrollToBottom();

}


/* =========================================
   LOADING STATE
   ========================================= */

function setLoading(
    loading
) {

    sendButton.disabled =
        loading;


    messageInput.disabled =
        loading;


    if (loading) {

        sendButton.textContent =
            "⋯";

    } else {

        sendButton.textContent =
            "↑";

        messageInput.focus();

    }

}


/* =========================================
   ESCAPE HTML
   ========================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================================
   SCROLL
   ========================================= */

function scrollToBottom() {

    messages.scrollTo({

        top: messages.scrollHeight,

        behavior: "smooth"

    });

}


/* =========================================
   NEW CHAT
   ========================================= */

newChatButton.addEventListener(
    "click",
    () => {

        chatMessages = [];

        chatStarted = false;


        const messageRows =
            messages.querySelectorAll(
                ".message-row"
            );


        messageRows.forEach(
            (row) => row.remove()
        );


        welcomeMessage.style.display =
            "flex";


        conversationList.innerHTML =
            "";


        messageInput.value = "";

        autoResize();

        messageInput.focus();


        closeMobileSidebar();

    }
);


/* =========================================
   CONVERSATION LIST
   ========================================= */

function updateConversationList() {

    conversationList.innerHTML =
        "";


    const firstMessage =
        chatMessages.find(
            (message) =>
                message.role === "user"
        );


    if (!firstMessage) {
        return;
    }


    const conversation =
        document.createElement("div");


    conversation.style.cssText = `

        padding: 10px 12px;

        border-radius: 9px;

        color: #aab4c5;

        font-size: 0.72rem;

        cursor: pointer;

        white-space: nowrap;

        overflow: hidden;

        text-overflow: ellipsis;

        transition: 0.2s;

    `;


    conversation.textContent =
        firstMessage.content;


    conversation.addEventListener(
        "mouseenter",
        () => {

            conversation.style.background =
                "rgba(255,255,255,0.04)";

        }
    );


    conversation.addEventListener(
        "mouseleave",
        () => {

            conversation.style.background =
                "transparent";

        }
    );


    conversationList.appendChild(
        conversation
    );

}


/* =========================================
   SUGGESTIONS
   ========================================= */

suggestionButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const title =
                    button.querySelector(
                        "strong"
                    )?.textContent || "";


                const prompts = {

                    "Explain something":
                        "Explain quantum physics in simple terms.",

                    "Write some code":
                        "Write a simple Python program and explain how it works.",

                    "Brainstorm ideas":
                        "Give me 10 creative ideas for a technology project.",

                    "Teach me":
                        "Teach me something fascinating that I probably don't know."

                };


                messageInput.value =
                    prompts[title] ||
                    "Tell me something interesting.";


                autoResize();

                messageInput.focus();

            }
        );

    }
);


/* =========================================
   TEXTAREA AUTO RESIZE
   ========================================= */

messageInput.addEventListener(
    "input",
    autoResize
);


function autoResize() {

    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            150
        ) + "px";

}


/* =========================================
   ENTER KEY
   ========================================= */

messageInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            chatForm.requestSubmit();

        }

    }
);


/* =========================================
   MOBILE SIDEBAR
   ========================================= */

mobileMenuButton.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "open"
        );

    }
);


function closeMobileSidebar() {

    sidebar.classList.remove(
        "open"
    );

}


/* =========================================
   INITIALIZE
   ========================================= */

console.log(
    "QUBOT frontend initialized ⚛️"
);