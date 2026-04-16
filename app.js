setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    var content = "";

    function CreateMessage(text, color, type, includeCode) {
        const message = document.createElement("div");
        message.style.backgroundColor = (color === "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
        message.style.padding = "10px";
        message.style.margin = "10px";
        message.style.borderRadius = "8px";
        message.style.width = "fit-content";
        message.style.opacity = "0%"
        message.style.maxWidth = "80%";
        if (type === 1) message.style.marginLeft = "auto";
        message.style.transition = "opacity 250ms ease-in-out"
        message.innerHTML = text;
        messagescontainer.appendChild(message);
        messagescontainer.scrollTop = messagescontainer.scrollHeight;
        message.style.opacity = "100%"
        return message
    }

    post.addEventListener("click", async () => {
        const userInput = textareacontainer.value || textareacontainer.innerText;
        if (!userInput.trim()) return;

        CreateMessage(userInput, "green", 1);
        textareacontainer.value = "";

        try {
            const response = await fetch("https://aibackend-3srf.onrender.com", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: userInput + "|" + content}]
                })
            });

            const data = await response.json();
            
            // FIXED: Standard OpenAI/Groq response format is choices[0].message.content
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResult = data.choices[0].message.content;
            
                // Fix 1: Add 's' flag (dotAll) so . matches new lines inside the quotes
                const regex = /'''([\s\S]*?)'''/g; 
                
                const findings = [...aiResult.matchAll(regex)]; 
                const map = findings.map(match => match[1]);
                
                if (map.length === 0) { 
                    CreateMessage(aiResult, "blue", 0, 0);
                } else {
                    const y = document.createElement("div");
                    y.style.width = "fit-content";
                    y.style.maxWidth = "80%";
                    y.style.height = "fit-content";
                    y.style.backgroundColor = "#000";
                    y.style.borderRadius = "5px";
                    y.style.fontFamily = "monospace";
                    y.style.color = "rgb(255, 255, 255)";
                    y.style.padding = "10px";
                    y.style.whiteSpace = "pre-wrap"; // Fix 2: Keep the code formatting/line breaks
                    
                    // Fix 3: Use textContent to prevent the browser from rendering the code as HTML
                    y.textContent = map[0]; 
            
                    y.style.boxShadow = "0px 0px 0px rgb(255, 255, 255)";
                    y.style.transition = "box-shadow 150ms ease-in-out"; // Fixed property name
                    
                    y.addEventListener("mouseenter", () => {
                        y.style.boxShadow = "0px 0px 10px rgb(255, 255, 255)";
                    });
                    y.addEventListener("mouseleave", () => {
                        y.style.boxShadow = "0px 0px 0px rgb(255, 255, 255)";
                    });
            
                    msg.appendChild(y);
                }                
                content = "user:" + userInput + "|you:" + aiResult;
            } else {
                console.error("API Error:", data);
                CreateMessage("Error: " + (data.error?.message || "Unknown error"), "red", 0);
            }
            
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    });
}, 750);
