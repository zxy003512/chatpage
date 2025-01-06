const API_URL = "https://www.gptapi.us/v1/chat/completions";
const API_KEY = "sk-Se2ngHV6MdeLoy1L0cEe8dC0884b4789B327A0C8B87bA403";
const MAX_TOKENS = 8000;
const TEMPERATURE = 0.6;

const chatMessages = document.getElementById("chat-messages");
const errorLog = document.getElementById("error-log");

function appendMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    const textDiv = document.createElement("div");
    textDiv.classList.add("text");
    textDiv.textContent = text;
    messageDiv.appendChild(textDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function logError(error) {
    const now = new Date();
    errorLog.style.display = "block";
    errorLog.textContent = `[${now.toLocaleString()}] Error: ${error}`;
}

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    userInput.value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-2024-11-20",
                messages: [{ role: "user", content: message }],
                max_tokens: MAX_TOKENS,
                temperature: TEMPERATURE
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;
        const tokenUsage = data.usage.total_tokens;

        appendMessage(reply, "bot");
        console.log(`Token usage: ${tokenUsage}`);
    } catch (error) {
        logError(error.message);
    }
}
