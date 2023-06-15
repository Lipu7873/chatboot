const ChatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const Chatbox = document.querySelector(".chatbox");
const ChatbotToggler = document.querySelector(".chatbot-toggler");
const ChatbotClosebtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
// const API_KEY = "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";
const inputInitHeight = ChatInput.scrollHeight;

const createChatLi = (message, className) => {
    //Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p> `;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": "user", "content": userMessage}]
        })
    }

    //Send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) =>{
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again"
    }).finally(()=>Chatbox.scrollTo(0,Chatbox.scrollHeight));
}


const handleChat = ()=>{
    userMessage = ChatInput.value.trim();
    if(!userMessage) return;
    ChatInput.value="";
    ChatInput.style.height = `${inputInitHeight}px`

    // append the user message to chatbot
    Chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    Chatbox.scrollTo(0,Chatbox.scrollHeight);
    setTimeout(() =>{
        //display thinking message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        Chatbox.appendChild(incomingChatLi);
        Chatbox.scrollTo(0,Chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600)
}

ChatInput.addEventListener("input", () =>{
    // Adjust the height of the input textarea based on its content
    ChatInput.style.height = `${inputInitHeight}px`;
    ChatInput.style.height = `${ChatInput.scrollHeight}px`;
});

ChatInput.addEventListener("keydown", () =>{
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
ChatbotClosebtn.addEventListener("click", ()=> document.body.classList.remove("show-chatbot"))
ChatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"))