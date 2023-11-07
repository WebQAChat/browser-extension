const sendMsgToBackground = (command, target = "background", ...data) => {
    chrome.runtime.sendMessage({ command, target, data }, (response) => {
        console.log("msg from background", response);
    });
};

document.addEventListener("DOMContentLoaded", function () {
    // Get the current tab URL and send a message to the background script to extract contents
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTabId = tabs[0].id;
        var currentTabUrl = tabs[0].url;
        sendMsgToBackground(
            "extractFromTab",
            "background",
            currentTabId,
            currentTabUrl
        );
    });

    // Listen to the background after extractFromTab is complete
});

// function initChatbot(model_name) {
//     const parser = new DOMParser();
//     const document = parser.parseFromString(htmlString, "text/html");
//     document
//         .querySelectorAll("h1")
//         .forEach(
//             (heading) => (heading.textContent = heading.textContent + "!!!")
//         );
//     sendToBackground(
//         "add-exclamationmarks-result",
//         document.documentElement.outerHTML
//     );
// }

// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
async function handleBackgroundMessages(message, sender, sendResponse) {
    // Return early if this message isn't meant for the offscreen document.
    if (message.target !== "popup") {
        return;
    }

    // Dispatch the message to an appropriate handler.
    switch (message.command) {
        case "initChatbot":
            initChatbot(message.data);
            break;
        default:
            console.warn(
                `Unexpected message type received: '${message.type}'.`
            );
            return false;
    }
}

const userQuery = () => {
    let sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", function () {
        console.log("send button clicked!");
        let userInput = document.getElementById("input-message").value;
        if (userInput) {
            // Send a message to the background script
            // sendMsgToBackground("getResponse", "background", userInput);
            document.getElementById("input-message").value = "";

            let messageDiv = document.createElement("div");
            messageDiv.className = "message user-message";
            messageDiv.textContent = userInput;
            document.getElementById("chat-body").appendChild(messageDiv);

            fetch(`http://localhost:8000/api/model/query?input=${userInput}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((data) => {
                    var assistantMessageDiv = document.createElement("div");
                    assistantMessageDiv.className = "message bot-message";
                    assistantMessageDiv.textContent = data;
                    document
                        .getElementById("chat-body")
                        .appendChild(assistantMessageDiv);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    });
};

// const getBotResponse = async (queryText) => {
//     console.log("user query: ", queryText);
//     console.log("getting response...");
//     fetch(`http://localhost:8000/api/model/query?input=${queryText}`)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then((data) => {
//             console.log("bot response: ", data);
//             return data;
//         })
//         .catch((error) => {
//             console.error("Error:", error);
//         });
// };

// "content_security_policy": "script-src 'self' 'bootstrap-4.0.0-dist/js/bootstrap.min.js'; style-src 'self' 'bootstrap-4.0.0-dist/css/bootstrap.min.css'; object-src 'self';"

userQuery();
chrome.runtime.onMessage.addListener(handleBackgroundMessages);
