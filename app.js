setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    const fileinput = document.getElementById("fileInput")
    var content = ""

    post.addEventListener("click", async () => {
        const userInput = textareacontainer.value || textareacontainer.innerText;
        if (!userInput.trim()) return;

        try {
            // UPDATED: Points to your Render URL instead of localhost
            const response = await fetch("https://onrender.com", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: userInput + " " + String(fileinput.files[0]) + "|" + content}]
                })
            });

            const data = await response.json();
            function CreateMessage(text, color, type) {
                const message = document.createElement("div")
                if (color == "green") {message.style.backgroundColor = "rgb(0, 255, 0)"} else {message.style.backgroundColor = "rgb(151, 151, 255)"}
                message.style.width = String(text.length * 5 / Number(messagescontainer.style.width) + text.length * 5 - Number(messagescontainer.style.width) - 100) + "px"
                message.style.height = 25 * text.length - (500)
                message.innerHTML = text
                message.style.opacity = "0%"
                messagescontainer.appendChild(message)
                message.style.fontSize = "small"
                message.style.textAlign = "left"
                if (type == 1) {
                    message.style.left = "100%"
                } else {
                    message.style.right = "100%"
                }
                message.animate([{opacity: 0}, {opacity: 1}], {iterations: 1, duration: 150}).addEventListener("finish", () => {
                    message.style.opacity = "100%"
                })
            }

            CreateMessage(textareacontainer.value, "green", 1)

            // Safety check: matches Groq/OpenAI response format
            if (data.choices && data.choices[0]) {
                setTimeout(() => {
                    CreateMessage(data.choices[0].message.content, "blue", 1)
                    var responceresult = data.choices[0].message.content
                    content = "user:"+userInput+"|you:"+responceresult
                }, 255)
            } else {
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Browser Error:", error);
        }
    });
}, 750);
