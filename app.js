setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    var content = "";

    function CreateMessage(text, color, type) {
        const message = document.createElement("div");
        message.style.backgroundColor = (color === "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
        message.style.padding = "10px";
        message.style.margin = "10px";
        message.style.borderRadius = "8px";
        message.style.width = "fit-content";
        message.style.maxWidth = "80%";
        if (type === 1) message.style.marginLeft = "auto";
        message.innerHTML = text;
        messagescontainer.appendChild(message);
        messagescontainer.scrollTop = messagescontainer.scrollHeight;
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
                    messages: [{ role: "user", content: userInput + "|" + content }]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const aiResult = data.choices[0].message.content;
                CreateMessage(aiResult, "blue", 0);
                content = "user:" + userInput + "|you:" + aiResult;
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    });
}, 750);

