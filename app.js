setTimeout(() => {
    const textareacontainer = document.getElementById("message-text-input");
    const messagescontainer = document.getElementById("messages-container");
    const post = document.getElementById("post");
    const fileinput = document.getElementById("fileInput");
    var content = "";

    post.addEventListener("click", async () => {
        const userInput = textareacontainer.value || textareacontainer.innerText;
        if (!userInput.trim()) return;

        try {
            // YOUR EXACT LINK
            const response = await fetch("https://aibackend-3srf.onrender.com", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: userInput + " " + String(fileinput.files[0]) + "|" + content}]
                })
            });

            const data = await response.json();

            function CreateMessage(text, color, type) {
                const message = document.createElement("div");
                message.style.backgroundColor = (color == "green") ? "rgb(0, 255, 0)" : "rgb(151, 151, 255)";
                message.style.padding = "10px";
                message.style.margin = "10px";
                message.style.borderRadius = "8px";
                message.style.width = "fit-content";
                message.style.maxWidth = "80%";
                message.innerHTML = text;
                
                if (type == 1) { message.style.marginLeft = "auto"; } 
                else { message.style.marginRight = "auto"; }
                
                messagescontainer.appendChild(message);
            }

            CreateMessage(userInput, "green", 1);

            if (data.choices && data.choices[0]) {
                var responceresult = data.choices[0].message.content;
                CreateMessage(responceresult, "blue", 0);
                content = "user:" + userInput + "|you:" + responceresult;
            }
        } catch (error) {
            console.error("Browser Error:", error);
        }
    });
}, 750);

