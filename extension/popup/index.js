import {
	updateTabState,
	getTabState,
	getValueFromTabState,
} from "../utils/db.js";

const tabs = await browser.tabs.query({
	active: true,
	currentWindow: true,
});
const active_tab_id = tabs[0].id;
const chat_enabled_checkbox = document.getElementById("isChatEnabled");

function toggleChatSidebar(is_checked) {
	if (is_checked) {
		// Open the sidebar
		browser.sidebarAction.open();
	} else {
		// Close the sidebar
		browser.sidebarAction.close();
	}
}

if (document.readyState !== "loading") {
	console.log("Document is ready.");

	const is_chat_enabled = await getValueFromTabState(
		active_tab_id,
		"tab_is_chat_enabled"
	);

	console.log("Is chat enabled: ", is_chat_enabled);

	chat_enabled_checkbox.checked = is_chat_enabled;
	// toggleChatSidebar(is_chat_enabled);

	chat_enabled_checkbox.onclick = async () => {
		// sadly we can't show the sidebar when the user clicks the chat widget button from content script
		// https://discourse.mozilla.org/t/how-to-open-sidebar-from-content-script-click-event/120986
		// Send a message to the content script to activate chat widget
		// browser.tabs.sendMessage(active_tab_id, {
		// 	action: "activateChatWidget",
		// 	sender: "popup.js",
		// 	target: "content.js",
		// 	value: chat_enabled_checkbox.checked, // Pass the state of the toggle (true or false)
		// });

		// Open or close the sidebar based on the toggle state
		toggleChatSidebar(chat_enabled_checkbox.checked);

		// Update the cache with the new toggle state
		await updateTabState(
			active_tab_id,
			"tab_is_chat_enabled",
			chat_enabled_checkbox.checked
		);
	};
} else {
	console.log("Document is not ready.");
}

// document.addEventListener("DOMContentLoaded", function () {
//   const isChatEnabled = document.getElementById('isChatEnabled');
//   isChatEnabled.addEventListener('change', function() {
//     // chrome.storage.sync.set({ isChatEnabled: isChatEnabled.checked });
//     console.log(isChatEnabled.checked);
//   });

//   chrome.storage.sync.get('isChatEnabled', function(data) {
//     isChatEnabled.checked = data.isChatEnabled;
//   });
// });
