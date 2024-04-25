import { setTabState } from "../utils/db.js";

document.addEventListener("DOMContentLoaded", () => {
	const isChatEnabled = document.getElementById("isChatEnabled");
	if (!isChatEnabled) {
		return;
	}
	isChatEnabled
		.addEventListener("change", (event) => {
			// Logic to enable chat
			console.log("Chat is enabled: ", isChatEnabled.checked);
			// TODO: add options to activate chat for this tab only or all tabs
			// browser.runtime.sendMessage({ action: "activateChat" })

			browser.tabs
				.query({ active: true, currentWindow: true })
				.then(async (tabs) => {
					if (tabs.length === 0) {
						return;
					}

					const activeTabId = tabs[0].id;

					// Save the state of the toggle in the cache
					await setTabState(
						activeTabId,
						"isChatEnabled",
						isChatEnabled.checked
					);
					// Send a message to the content script to activate chat
					browser.tabs.sendMessage({
						action: "activateChat",
						sender: "popup.js",
						target: "content.js",
						tabId: activeTabId,
						value: isChatEnabled.checked, // Pass the state of the toggle (true or false)
					});
				});
		})
		.catch((error) => console.error("Error querying tabs: ", error));
});
// document.getElementById("open-sidebar").addEventListener("click", () => {
// 	// Logic to open the sidebar chat
// 	browser.sidebarAction.open();

// 	// close the popup
// 	window.close();
// });
// Initialize a cache object to store toggle states for each tab
