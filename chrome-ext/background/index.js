// const handlePopupMessages = async (message, sender, sendResponse) => {
//     // Return early if this message isn't meant for the background script
//     if (message.target !== "background") {
//         return;
//     }

//     switch (message.command) {
//         case "extractFromTab":
//             // Listen for when a tab is updated
//             chrome.tabs.onUpdated.addListener(function (
//                 tabId,
//                 changeInfo,
//                 tab
//             ) {
//                 if (changeInfo.status == "complete") {
//                     handleExtractFromTab(tabId);
//                 }
//             });

//             // Listen for when the active tab is changed
//             chrome.tabs.onActivated.addListener(function (activeInfo) {
//                 handleExtractFromTab(activeInfo.tabId);
//             });

//             // sendResponse({ msg: "background tab extracted" });
//             break;
//         default:
//             console.warn(
//                 `Unexpected message type received: '${message.command}'.`
//             );
//     }
// };

// const handleExtractFromTab = async (tabId) => {
//     chrome.tabs.get(tabId, function (tab) {
//         var currentTabUrl = tab.url;
//         console.log("background tab url: ", currentTabUrl);
//         console.log("fetching api endpoint ...");
//         fetch(`api/tabs/extract`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ tabId: tab.id, urls: [tab.url] }),
//         })
//             .then((response) => response.json())
//             .then((data) => console.log("background ", data, "fetched"))
//             .catch((error) => {
//                 console.error("Error:", error);
//             });
//     });
// };

const handlePopupMessages = async (message, sender, sendResponse) => {
    // Return early if this message isn't meant for the background script
    if (message.target !== "background") {
        return;
    }

    let resp;

    switch (message.command) {
        case "extractFromTab":
            const [tabId, tabUrl] = message.data;
            resp = extractFromTab(tabId, tabUrl);
            // sendResponse({ data: resp.data });
            break;
        case "initChatbot":
            resp = initChatbot(message.model_name);
            // sendResponse({ data: "chatbot in" });
            break;
        case "getResponse":
            const [userInput] = message.data;
            getBotResponse(userInput);
            break;
        default:
            console.warn(
                `Unexpected message type received: '${message.command}'.`
            );
    }
};

const extractFromTab = async (id, url) => {
    console.log("background tab url: ", url);
    console.log("extracting tab ...");
    fetch(`http://localhost:8000/api/tab/extract`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tabId: id, urls: [url] }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // return response.json();
            console.log("after extracting, chatbot initializing...");
            initChatbot("gpt-4");
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

// function updateCurrentUser(firstName, lastName) {
//     const body = { firstName, lastName };
//     const requestOptions = {
//         method: "PATCH",
//         headers: authHeader(),
//         body: JSON.stringify(body),
//     };
//     return fetch(`${config.apiUrl}/users/update`, requestOptions).then(
//         handleResponse
//     );
// }
const initChatbot = async (name) => {
    console.log(`initializing chatbot ${name}...`);
    fetch(`http://localhost:8000/api/model/init`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ modelName: name }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // return response.json();
            console.log(`chatbot model ${name} initialized!`);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

chrome.runtime.onMessage.addListener(handlePopupMessages);
