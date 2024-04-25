export const getTabState = async (tab_id, key) => {
	return browser.storage.local.get("tabs").then((res) => {
		let tabs = res.tabs;
		let tab = tabs.find(tab => tab.id === parseInt(tab_id));
		if (!tab) {
			return null;
		}
		return tab[key];
	});
};

export const setTabState = async (tab_id, key, val) => {
	return browser.storage.local.get("tabs").then((res) => {
		let tabs = res.tabs;
		let tab = tabs.find(tab => tab.id === parseInt(tab_id));
		if (!tab) {
			return null;
		}
		tab[key] = val;
		return browser.storage.local.set({ tabs: tabs });
	});
};

