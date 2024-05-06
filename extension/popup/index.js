import { updateTabState, getTabState } from "../utils/db.js";

const tabs = await browser.tabs.query({
	active: true,
	currentWindow: true,
});
const active_tab_id = tabs[0].id;
const chat_sidebar_toggle = document.getElementById("sidebarToggle");

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

	const tab_state = await getTabState(active_tab_id);

	chat_sidebar_toggle.checked = tab_state.tab_is_chat_enabled;

	chat_sidebar_toggle.onclick = async () => {
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
		toggleChatSidebar(chat_sidebar_toggle.checked);

		// Update the cache with the new toggle state
		await updateTabState(
			active_tab_id,
			"tab_is_sidebar_opened",
			chat_sidebar_toggle.checked
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
