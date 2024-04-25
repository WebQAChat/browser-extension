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
// Initialize a cache object to store toggle states for each tab
if (window.tabs) {
	console.log("tabs already initialized");
	console.log("tabs: ", window.tabs);
}

const handlePopupMessages = async (message, sender, sendResponse) => {
	// Return early if this message isn't meant for the background script
	if (message.sender !== "popup.js") {
		return;
	}

	let resp;

	switch (message.action) {
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

const handleSidebarMessages = async (message, sender, sendResponse) => {
	// Return early if this message isn't meant for the background script
	if (message.sender !== "sidebar.js") {
		return;
	}

	let resp;
	switch (message.action) {
		case "captureScreenshot":
			// Capture the current visible tab
			browser.tabs.captureVisibleTab().then((imageUri) => {
				// Send the captured image URI back to the content script or popup
				sendResponse({ imageUri: imageUri });
			});
			return true; // Indicates that the response is sent asynchronously
		default:
			console.warn(`Unexpected message type received: '${message}'.`);
	}
};

const handleContentMessages = async (message, sender, sendResponse) => {
	// Return early if this message isn't meant for the background script
	if (message.sender !== "content.js") {
		return;
	}

	let resp;
	switch (message.action) {
		case "askAboutText":
			browser.tabs
				.query({ active: true, currentWindow: true })
				.then((tabs) => {
					let tabId = tabs[0].id;
					browser.runtime.sendMessage({
						action: "populateChatInput",
						sender: "background.js",
						tabId: tabId,
						target: "sidebar.js", // just for logging purposes
						text: message.text,
					});
				});
			break;
		case "openSidebar":
			browser.sidebarAction.open();
			break;
		default:
			console.warn(`Unexpected message type received: '${message}'.`);
	}
};

// Listen for messages
browser.runtime.onMessage.addListener(handlePopupMessages);
browser.runtime.onMessage.addListener(handleSidebarMessages);
browser.runtime.onMessage.addListener(handleContentMessages);

// const extractFromTab = async (id, url) => {
// 	console.log("background tab url: ", url);
// 	console.log("extracting tab ...");
// 	fetch(`http://localhost:8000/api/tab/extract`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({ tabId: id, urls: [url] }),
// 	})
// 		.then((response) => {
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
// 			// return response.json();
// 			console.log("after extracting, chatbot initializing...");
// 			initChatbot("gpt-4");
// 		})
// 		.catch((error) => {
// 			console.error("Error:", error);
// 		});
// };

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
// const initChatbot = async (name) => {
// 	console.log(`initializing chatbot ${name}...`);
// 	fetch(`http://localhost:8000/api/model/init`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify({ modelName: name }),
// 	})
// 		.then((response) => {
// 			if (!response.ok) {
// 				throw new Error(`HTTP error! status: ${response.status}`);
// 			}
// 			// return response.json();
// 			console.log(`chatbot model ${name} initialized!`);
// 		})
// 		.catch((error) => {
// 			console.error("Error:", error);
// 		});
// };
