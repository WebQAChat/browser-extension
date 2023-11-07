// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
async function handleMessages(message) {
    // Return early if this message isn't meant for the offscreen document.
    if (message.target !== "popup") {
        return false;
    }

    // Dispatch the message to an appropriate handler.
    switch (message.type) {
        case "add-exclamationmarks-to-headings":
            addExclamationMarksToHeadings(message.data);
            break;
        default:
            console.warn(
                `Unexpected message type received: '${message.type}'.`
            );
            return false;
    }
}

const sendToBackground = (type, data) => {
    chrome.runtime.sendMessage(
        { type, target: "background", data },
        (response) => {
            console.log("popup message: ", response.msg);
        }
    );
};

// Function for toggle chat widget
function toggleChatWidget() {
    var chatWidget = document.getElementById("chat-widget");
    var toggleButton = document.getElementById("toggle-button");

    if (!chatWidget.classList.contains("active")) {
        chatWidget.classList.add("active");
    } else {
        chatWidget.classList.remove("active");
    }
}

// Get the chat window to insert user message
var chatWindow = document.getElementById("chat-window");

// Get time
function getCurrentTime() {
    // Get current time
    const now = new Date();
    let currentHour = now.getHours();
    let currentMinute = now.getMinutes();
    let period = "am";

    if (currentHour > 12) {
        currentHour -= 12;
        period = "pm";
    } else if (currentHour === 12) {
        period = "pm";
    } else if ((currentHour = 0)) {
        currentHour = 12;
    } else if (currentHour < 10) {
        // currentHour = '0' + currentHour;
    }

    // Add leading zero to minute if needed
    if (currentMinute < 10) {
        currentMinute = "0" + currentMinute;
    }

    const currentTime = currentHour + ":" + currentMinute + " " + period;

    return currentTime;
}

// Function to scroll the chat container to the bottom
function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
}

// Have to add submit event to Form to prevent default form submittion
const chatSubmitForm = document.getElementById("chatSubmitForm");
chatSubmitForm.addEventListener("submit", sendMessage);

// Sending messages
function sendMessage(event) {
    /* Prevent Form from submittiing default attribute action.
     If don't protect, Form will submit to link according to action 
     attribute inside Form tag. */
    event.preventDefault();

    // Get the input value from the message input field
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim(); // Remove leading/trailing spaces

    // Set the btn disabled to prevent user from sending message while generating message
    const sendBtn = document.getElementById("send-button");

    // Set the current time to variable from function
    var currentTime = getCurrentTime();

    if (message !== "") {
        // Set the btn disabled to prevent user from sending message while generating message
        sendBtn.setAttribute("disabled", true);

        chatWindow.innerHTML += `
               <div class="user-message-container message-container" id="user-message-container">
                    <div class="message">${message}</div>
                    <span class="time">${currentTime}</span>
               </div>
               <div class="gpt-message-container message-container loading" id="gpt-message-container">
                    <div class="message"><div class="message-generating-loader"></div></div>
               </div>
          `;

        const loadingMessage = document.querySelector(".loading");
        axios
            .get(`/api/query?question=${messageInput.value}`, {
                message: messageInput.value,
            })
            .then((data) => {
                // Replace to loading message with generated message
                loadingMessage.classList.remove("loading");
                loadingMessage.innerHTML = `
                    <div class="message currentMessage"></div>
                    <span class="time">${currentTime}</span>
               `;

                console.log(data);
                // Generated message
                var generatedMessage = `${data.data}`;

                const currentMessage =
                    document.querySelector(".currentMessage");

                var typeWriter = new typeWriterAnimation(
                    generatedMessage,
                    1,
                    currentMessage,
                    sendBtn
                );
                typeWriter.typeWriter();

                scrollToBottom(chatWindow);
            })
            .catch((error) => {
                // For error stages
                console.error(error);
                console.log("error api");
                if (error.response.status === 500) {
                    console.log("Server error.");
                }

                // Remove loading stage and remove disabled button
                loadingMessage.remove();
                sendBtn.removeAttribute("disabled");
            });

        // Do something with the message (e.g., send it to the server)
        console.log("Sending message:", message);

        scrollToBottom(chatWindow);

        // Clear the input field after sending the message
        messageInput.value = "";
    }
}
