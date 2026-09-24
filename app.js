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


let chatMessages = [];


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
            "opacity .5s ease, transform .5s ease";


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
   SEND
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


        /*
         * Temporary GitHub Pages demo.
         *
         * Real Gemini backend will be
         * connected after deployment.
         */

        setLoading(true);


        setTimeout(() => {

            addAssistantMessage(
                "Hello! I'm QUBOT. ⚛️\n\n" +
                "Your message was received.\n\n" +
                "The real Gemini AI connection " +
                "will be connected to QUBOT's " +
                "backend in the next step."
            );


            setLoading(false);

        }, 700);

    }
);


/* =========================================
   USER MESSAGE
   ========================================= */

function addUserMessage(text) {

    chatMessages.push({

        role: "user",

        content: text

    });


    welcomeMessage.style.display =
        "none";


    const element =
        document.createElement("div");


    element.className =
        "message-row";


    element.innerHTML = `

        <div
            style="
                display:flex;
                justify-content:flex-end;
                width:100%;
                margin-bottom:20px;
            "
        >

            <div
                style="
                    max-width:80%;
                    padding:13px 17px;
                    border-radius:17px;
                    background:
                        linear-gradient(
                            135deg,
                            rgba(0,229,255,.10),
                            rgba(56,107,255,.10)
                        );
                    border:
                        1px solid
                        rgba(0,229,255,.15);
                    color:#edf4ff;
                    line-height:1.6;
                    white-space:pre-wrap;
                    word-break:break-word;
                "
            >
                ${escapeHtml(text)}
            </div>

        </div>

    `;


    messages.appendChild(element);

    updateConversation();

    scrollToBottom();

}


/* =========================================
   AI MESSAGE
   ========================================= */

function addAssistantMessage(text) {

    chatMessages.push({

        role: "assistant",

        content: text

    });


    const element =
        document.createElement("div");


    element.className =
        "message-row";


    element.innerHTML = `

        <div
            style="
                display:flex;
                gap:14px;
                width:100%;
                margin-bottom:24px;
            "
        >

            <div
                style="
                    width:38px;
                    height:38px;
                    flex-shrink:0;
                "
            >

                <img
                    src="assets/logo.svg"
                    alt="QUBOT"
                    style="
                        width:38px;
                        height:38px;
                    "
                >

            </div>


            <div
                style="
                    flex:1;
                    max-width:800px;
                    color:#dce5f4;
                    line-height:1.7;
                    white-space:pre-wrap;
                    word-break:break-word;
                "
            >
                ${escapeHtml(text)}
            </div>

        </div>

    `;


    messages.appendChild(element);

    scrollToBottom();

}


/* =========================================
   NEW CHAT
   ========================================= */

newChatButton.addEventListener(
    "click",
    () => {

        chatMessages = [];


        messages
            .querySelectorAll(
                ".message-row"
            )
            .forEach(
                row => row.remove()
            );


        welcomeMessage.style.display =
            "flex";


        conversationList.innerHTML =
            "";


        messageInput.value = "";

        autoResize();

        messageInput.focus();

    }
);


/* =========================================
   SUGGESTIONS
   ========================================= */

suggestionButtons.forEach(
    button => {

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
                        "Write a simple Python program and explain it.",

                    "Brainstorm ideas":
                        "Give me 10 creative technology project ideas.",

                    "Teach me":
                        "Teach me something fascinating."

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
   TEXTAREA
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
    event => {

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
   MOBILE MENU
   ========================================= */

mobileMenuButton.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* =========================================
   CONVERSATION
   ========================================= */

function updateConversation() {

    conversationList.innerHTML = "";


    const first =
        chatMessages.find(
            message =>
                message.role === "user"
        );


    if (!first) {
        return;
    }


    const item =
        document.createElement("div");


    item.style.cssText = `

        padding:10px 12px;
        border-radius:9px;
        color:#aab4c5;
        font-size:.72rem;
        cursor:pointer;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;

    `;


    item.textContent =
        first.content;


    conversationList.appendChild(item);

}


/* =========================================
   LOADING
   ========================================= */

function setLoading(loading) {

    sendButton.disabled =
        loading;


    messageInput.disabled =
        loading;


    sendButton.textContent =
        loading
            ? "⋯"
            : "↑";

}


/* =========================================
   ESCAPE HTML
   ========================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

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


console.log(
    "QUBOT loaded successfully ⚛️"
);
