export const getTabState = async (tab_id) => {
	console.log("getting tab state: ", tab_id);
	let tab_id_str = typeof tab_id === "number" ? tab_id.toString() : tab_id; // use tab_id to convert to a unique string key

	const tab_state_dict = await browser.storage.local
		.get(tab_id_str)
		.then((tab_state_storage_object) => {
			return tab_state_storage_object[tab_id_str];
		})
		.catch((err) => {
			console.log("Error getting tab state: ", err);
		});

	if (!tab_state_dict) {
		console.log("Tab state is empty");
		return null;
	}

	return tab_state_dict;
}

export const getValueFromTabState = async (tab_id, key) => {
	console.log("getting tab state: ", tab_id);
	let tab_id_str = typeof tab_id === "number" ? tab_id.toString() : tab_id; // use tab_id to convert to a unique string key

	const tab_state_dict = await browser.storage.local
		.get(tab_id_str)
		.then((tab_state_storage_object) => {
			return tab_state_storage_object[tab_id_str];
		})
		.catch((err) => {
			console.log("Error getting tab state: ", err);
		});

	if (!tab_state_dict) {
		console.log("Tab state is empty");
		return null;
	}

	return tab_state_dict[key];
};

// This function is used to set the initial state of the current active tab.
export const setTabState = async (tab) => {
	console.log("Setting tab state: ", tab);
	let tab_id_str = tab.id.toString(); // use tab_id to convert to a unique string key

	let tab_state = {
		tab_url: tab.url,
		tab_is_text_selection_enabled: false,
		tab_is_sidebar_opened: false,
	};

	// Initialize the tab state
	browser.storage.local.set({ [tab_id_str]: tab_state });
};

export const updateTabState = async (tab_id, key, val) => {
	let tab_id_str = typeof tab_id === "number" ? tab_id.toString() : tab_id; // use tab_id to convert to a unique string key
	let data = {};

	const curr_tab_state = await browser.storage.local
		.get(tab_id_str)
		.then((state) => {
			return state[tab_id_str];
		})
		.catch((err) => {
			console.log("Error updating tab state: ", err);
		});

	data[tab_id_str] = { ...curr_tab_state, [key]: val };

	browser.storage.local
		.set(data)
		.then(() => {
			console.log("Tab state updated: ", data);
		})
		.catch((err) => {
			console.log("Error updating tab state: ", err);
		});
};
