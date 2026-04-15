setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    const fileinput = document.getElementById("fileInput");
    var content = "";

    function CreateMessage(text, color, type) {
        const message = document.createElement("div");
        message.style.backgroundColor = (color === "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
        message.style.padding = "10px";
        message.style.margin = "10px";
        message.style.borderRadius = "10px";
        message.style.width = "fit-content";
        message.style.maxWidth = "80%";
        message.style.wordWrap = "break-word";
        message.style.fontSize = "14px";
        message.style.fontFamily = "sans-serif";
        
        if (type === 1) {
            message.style.marginLeft = "auto";
        } else {
            message.style.marginRight = "auto";
        }

        message.innerHTML = text;
        messagescontainer.appendChild(message);
        messagescontainer.scrollTop = messagescontainer.scrollHeight;
    }

    post.addEventListener("click", async () => {
        const userInput = textareacontainer.value || textareacontainer.innerText;
        if (!userInput.trim()) return;

        // Display user message immediately
        CreateMessage(userInput, "green", 1);
        textareacontainer.value = "";

        // Get file name safely
        const fileName = (fileinput.files && fileinput.files.length > 0) ? fileinput.files[0].name : "None";

        try {
            const response = await fetch("https://aibackend-3srf.onrender.com", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ 
                        role: "user", 
                        content: userInput + " [File: " + fileName + "] | History: " + content
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server Logic Error:", errorData);
                CreateMessage("Error: Server responded with " + response.status, "red", 0);
                return;
            }

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResult = data.choices[0].message.content;
                CreateMessage(aiResult, "blue", 0);
                content = "user:" + userInput + "|you:" + aiResult;
            } else {
                console.error("Unexpected API Response:", data);
            }

        } catch (error) {
            console.error("Fetch Error:", error);
            CreateMessage("Error: Failed to connect to backend.", "red", 0);
        }
    });
}, 750);
