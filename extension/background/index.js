import { getTabState, setTabState, updateTabState } from "../utils/db.js";

const handlePopupMessages = async (message, sender, sendResponse) => {
	console.log("PopupMessage received: ", message);
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
		case "toggle_sidebar":
			console.log("Activating sidebar...");
			console.log("Message value: ", message.value);
			// Open the sidebar
			if (message.value) {
				browser.sidebarAction.open();
			} else {
				browser.sidebarAction.close();
			}
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
			console.log("Opening sidebar...");
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

browser.runtime.onInstalled.addListener(async () => {
	console.log("Extension installed");
});

// browser.runtime.onStartup.addListener(async () => {
// 	// Check the sidebar state when the browser starts or when the extension is reloaded
// 	let { sidebarOpened } = await browser.storage.local.get("sidebarOpened");
// 	console.log("Sidebar opened: ", sidebarOpened);
// 	if (sidebarOpened) {
// 		browser.sidebarAction.open();
// 	} else {
// 		// Optionally, explicitly close the sidebar if necessary
// 		browser.sidebarAction.close();
// 	}
// });

browser.tabs.onActivated.addListener(async (active_tab) => {
	// TODO: ignore the about:debugging page
	// tab_url:"about:debugging#/runtime/this-firefox"
	// read about other browser.tabs events onUpdated, onCreated, onRemoved
	console.log("Tab activated: ", active_tab);
	const tab = await browser.tabs.get(active_tab.tabId);

	const tabState = await getTabState(tab.id);

	if (!tabState) {
		setTabState(tab)
			.then(() => {
				console.log("Tab state initialized");
			})
			.catch((err) => {
				console.error("Error initializing tab state: ", err);
			});
	} else {
		console.log("Tab state already initialized");
	}
});

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
