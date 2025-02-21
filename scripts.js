document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script loaded and running");

    // Chat Elements
    const chatContainer = document.getElementById("chat-container");
    const toggleChatBtn = document.getElementById("toggle-chat");
    const closeChatBtn = document.getElementById("close-chat");
    const chatBody = document.getElementById("chat-body");
    const chatInput = document.getElementById("chat-input");
    const sendChatBtn = document.getElementById("send-chat");

    // Popup Elements
    const learnMoreButtons = document.querySelectorAll(".learn-more");
    const popups = {
        basic: document.getElementById("popup-basic"),
        standard: document.getElementById("popup-standard"),
        premium: document.getElementById("popup-premium")
    };
    const overlay = document.querySelector(".popup-overlay");

    // ✅ Ensure chat remains hidden until triggered
    if (chatContainer) {
        chatContainer.style.display = "none";
    }

    // ✅ Open chat when "Create your Project" button is clicked
    if (toggleChatBtn) {
        toggleChatBtn.addEventListener("click", () => {
            console.log("🟢 Chat button clicked");
            if (chatContainer) {
                chatContainer.style.display = "flex"; // Ensure chat opens
                chatContainer.style.zIndex = "1000"; // Make sure chat appears above other elements
                console.log("✅ Chat container should now be visible");

                if (!chatBody.innerHTML.trim()) {
                    addMessageToChat("Bot", "Welcome to DracoCodes chat! Tell me about your project inquiry to be scheduled for a Zoom call and recommended a package!");
                }
            }
        });
    } else {
        console.error("❌ toggleChatBtn not found!");
    }

    // ✅ Close chat when "X" is clicked
    if (closeChatBtn) {
        closeChatBtn.addEventListener("click", () => {
            console.log("🔴 Chat close button clicked");
            if (chatContainer) {
                chatContainer.style.display = "none";
            }
        });
    }

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

        addMessageToChat("You", message);
        chatInput.value = "";

        try {
            const response = await fetch("https://dracocodes.com/chat", {
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

    // ✅ POPUP FUNCTIONALITY ✅

    // Function to open the popup
    function openPopup(packageType) {
        const popup = popups[packageType];
        if (popup) {
            popup.style.display = "block";
            overlay.style.display = "block";
        }
    }

    // Function to close the popup
    function closePopup() {
        Object.values(popups).forEach(popup => {
            if (popup) popup.style.display = "none";
        });
        overlay.style.display = "none";
    }

    // Add event listener to Learn More buttons
    learnMoreButtons.forEach(button => {
        button.addEventListener("click", function () {
            const packageType = this.getAttribute("data-package");
            openPopup(packageType);
        });
    });

    // Add event listener to Close buttons
    document.querySelectorAll(".close-btn").forEach(button => {
        button.addEventListener("click", closePopup);
    });

    // Close popup when clicking outside of it (on overlay)
    overlay.addEventListener("click", closePopup);
});
