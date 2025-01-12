let websocket;
let username;

function joinRoom() {
    const room = document.getElementById("roomInput").value;
    username = document.getElementById("usernameInput").value;

    if (!username || !room) {
        alert("Please enter both a username and a room name.");
        return;
    }

    document.getElementById("usernameSection").style.display = "none";
    document.getElementById("chatSection").style.display = "block";

    websocket = new WebSocket(`ws://localhost:8000/ws/${room}/${username}`);

    websocket.onmessage = function (event) {
        const message = document.createElement("div");
        message.textContent = event.data;

        if (event.data.startsWith(`${username}:`)) {
            message.classList.add("message", "self");
        } else if (event.data.includes("has joined") || event.data.includes("has left")) {
            message.classList.add("message", "system");
        } else {
            message.classList.add("message", "user");
        }

        const chatWindow = document.getElementById("chatWindow");
        chatWindow.appendChild(message);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    websocket.onclose = function () {
        alert("You have been disconnected.");
        leaveRoom();
    };

    // Allow sending messages with the Enter key
    const messageInput = document.getElementById("messageInput");
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}

function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    if (message) {
        websocket.send(message);
        messageInput.value = "";
    }
}

function leaveRoom() {
    if (websocket) {
        websocket.close();
    }
    document.getElementById("usernameSection").style.display = "block";
    document.getElementById("chatSection").style.display = "none";
    document.getElementById("roomInput").value = "";
    document.getElementById("messageInput").value = "";
    document.getElementById("chatWindow").innerHTML = "";
}
