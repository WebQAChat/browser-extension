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

if (document.readyState !== "loading") {
	console.log("Document is ready.");

	const is_chat_enabled = await getValueFromTabState(
		active_tab_id,
		"tab_is_chat_enabled"
	);

	chat_enabled_checkbox.checked = is_chat_enabled;

	chat_enabled_checkbox.onclick = async () => {
		// Update the cache with the new toggle state
		await updateTabState(
			active_tab_id,
			"tab_is_chat_enabled",
			chat_enabled_checkbox.checked
		);

		// Send a message to the content script to activate chat
		// browser.tabs.sendMessage(active_tab_id, {
		// 	action: "activateChat",
		// 	sender: "popup.js",
		// 	target: "content.js",
		// 	value: chat_enabled_checkbox.checked, // Pass the state of the toggle (true or false)
		// }
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
// const chat_enabled_checkbox = document.getElementById("isChatEnabled");
// console.log("chat_enabled_checkbox: ", chat_enabled_checkbox);
// if (!chat_enabled_checkbox) {
// 	console.error("Could not find the chat enabled checkbox.");
// 	return;
// }
// console.log("chat_enabled_checkbox: ", chat_enabled_checkbox);
// chat_enabled_checkbox.checked = is_chat_enabled;

// chat_enabled_checkbox.onclick = async () => {
// 	// Update the cache with the new toggle state
// 	await updateTabState(
// 		active_tab_id,
// 		"tab_is_chat_enabled",
// 		is_chat_enabled
// 	);
// Send a message to the content script to activate chat
// browser.tabs.sendMessage(active_tab_id, {
// 	action: "activateChat",
// 	sender: "popup.js",
// 	target: "content.js",
// 	value: is_chat_enabled, // Pass the state of the toggle (true or false)
// });
// };
// });
