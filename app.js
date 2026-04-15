setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    const fileinput = document.getElementById("fileInput");
    let content = "";

    post.addEventListener("click", async () => {
        const userInput = textareacontainer.value || textareacontainer.innerText;
        if (!userInput.trim()) return;

        // Clear input immediately for better UX
        const currentInput = userInput;
        textareacontainer.value = "";
        if(textareacontainer.innerText) textareacontainer.innerText = "";

        try {
            // NOTE: Replace 'your-service-name' with your actual Render ID
            // Added /chat to match backend and trailing slash to prevent redirects
            const response = await fetch("https://onrender.com", {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ 
                        role: "user", 
                        content: currentInput + " [File: " + (fileinput.files[0]?.name || "None") + "] | " + content
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();

            function CreateMessage(text, color, type) {
                const message = document.createElement("div");
                
                // Styling
                message.style.backgroundColor = (color === "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
                message.style.padding = "10px";
                message.style.margin = "5px";
                message.style.borderRadius = "8px";
                message.style.width = "fit-content";
                message.style.maxWidth = "80%";
                message.style.fontSize = "small";
                message.style.textAlign = "left";
                message.style.position = "relative";
                message.innerHTML = text;
                message.style.opacity = "0";
                
                messagescontainer.appendChild(message);

                // Simple slide/fade animation
                message.animate([
                    { opacity: 0, transform: 'translateY(10px)' },
                    { opacity: 1, transform: 'translateY(0px)' }
                ], { 
                    iterations: 1, 
                    duration: 250, 
                    fill: 'forwards' 
                });
            }

            // Show User Message
            CreateMessage(currentInput, "green", 1);

            // Show AI Response
            if (data.choices && data.choices[0]) {
                setTimeout(() => {
                    const botResponse = data.choices[0].message.content;
                    CreateMessage(botResponse, "blue", 0);
                    // Update conversation history
                    content = "user:" + currentInput + "|you:" + botResponse;
                }, 400);
            } else {
                console.error("API Error: Unexpected response format", data);
            }

        } catch (error) {
            console.error("Browser Error:", error);
            alert("Failed to connect to the server. Check console for CORS or URL errors.");
        }
    });
}, 750);
