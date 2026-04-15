setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    const fileinput = document.getElementById("fileInput");
    var content = "";

    post.addEventListener("click", async () => {
        const userInput = textareacontainer.value || textareacontainer.innerText;
        if (!userInput.trim()) return;

        // Create user message immediately
        CreateMessage(userInput, "green", 1);
        textareacontainer.value = ""; // Clear input

        try {
            // FIXED: Your actual backend URL
            const response = await fetch("https://onrender.com", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: userInput + " " + String(fileinput.files[0]) + "|" + content}]
                })
            });

            const data = await response.json();

            // FIXED: Typing/Display Logic
            function CreateMessage(text, color, type) {
                const message = document.createElement("div");
                message.style.backgroundColor = (color === "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
                message.style.padding = "10px";
                message.style.margin = "10px";
                message.style.borderRadius = "10px";
                message.style.width = "fit-content";
                message.style.maxWidth = "70%";
                message.style.wordWrap = "break-word";
                message.style.fontSize = "16px";
                message.style.position = "relative";
                message.style.display = "block";
                
                // Align user right (type 1), AI left (type 0)
                if (type === 1) {
                    message.style.marginLeft = "auto";
                } else {
                    message.style.marginRight = "auto";
                }

                message.innerHTML = text;
                messagescontainer.appendChild(message);
                messagescontainer.scrollTop = messagescontainer.scrollHeight;
            }

            if (data.choices && data.choices[0]) {
                setTimeout(() => {
                    var responceresult = data.choices[0].message.content;
                    CreateMessage(responceresult, "blue", 0);
                    content = "user:" + userInput + "|you:" + responceresult;
                }, 255);
            }
        } catch (error) {
            console.error("Browser Error:", error);
        }
    });

    // Helper for initial function
    function CreateMessage(text, color, type) {
        const message = document.createElement("div");
        message.style.backgroundColor = (color === "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
        message.style.padding = "10px";
        message.style.margin = "10px";
        message.style.borderRadius = "10px";
        message.style.width = "fit-content";
        message.style.maxWidth = "70%";
        message.style.wordWrap = "break-word";
        message.innerHTML = text;
        if (type === 1) message.style.marginLeft = "auto";
        messagescontainer.appendChild(message);
    }
}, 750);
