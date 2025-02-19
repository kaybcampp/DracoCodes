document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.getElementById("chat-container");
    const toggleChatBtn = document.getElementById("toggle-chat");
    const closeChatBtn = document.getElementById("close-chat");
    const chatBody = document.getElementById("chat-body");
    const chatInput = document.getElementById("chat-input");
    const sendChatBtn = document.getElementById("send-chat");

    // ✅ Replace with your actual Ngrok URL each time you restart Ngrok
    const ngrokUrl = "https://5ecf-2600-4040-72eb-c000-1f2-394b-cf71-846c.ngrok-free.app/chat"; // Ensure /chat is included

    // ✅ Ensure chat remains hidden until triggered
    chatContainer.style.display = "none";

    // ✅ Open chat when "Create your Project" button is clicked
    toggleChatBtn.addEventListener("click", () => {
        chatContainer.style.display = "flex";
        if (!chatBody.innerHTML.trim()) {
            addMessageToChat("Bot", "Welcome to DracoCodes chat! Tell me about your project inquiry to be scheduled for a Zoom call and recommended a package!");
        }
    });

    // ✅ Close chat when "X" is clicked
    closeChatBtn.addEventListener("click", () => {
        chatContainer.style.display = "none";
    });

    // ✅ Function to add chat messages dynamically
    const addMessageToChat = (sender, message) => {
        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble", sender === "You" ? "user" : "bot");
        bubble.textContent = message;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll to the latest message
    };

    // ✅ Send chat message to the backend and handle responses
    sendChatBtn.addEventListener("click", async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Display the user's message
        addMessageToChat("You", message);
        chatInput.value = "";

        try {
            const response = await fetch(`${ngrokUrl}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            addMessageToChat("Bot", data.response);
        } catch (error) {
            addMessageToChat("Bot", "Error connecting to server. Please try again later.");
            console.error("❌ Error sending message:", error);
        }
    });

    // ✅ Allow "Enter" key to send a message
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendChatBtn.click();
        }
    });
});
