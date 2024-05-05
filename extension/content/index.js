// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#webextension_apis
// Create popover container and buttons
const popover = document.createElement("div");
popover.className = "web-chat-text-selection-popover";
document.body.appendChild(popover);

const popover_copy_btn = document.createElement("button");
popover_copy_btn.textContent = "Copy";
popover_copy_btn.style.border = "1px solid black";
popover_copy_btn.style.marginRight = "5px";
popover_copy_btn.style.display = "none";
popover.appendChild(popover_copy_btn);

const popover_ask_btn = document.createElement("button");
popover_ask_btn.textContent = "Ask about this";
popover_ask_btn.style.border = "1px solid black";
popover_ask_btn.style.display = "none";
popover.appendChild(popover_ask_btn);

// Create a chat widget
const chatWidget = document.createElement("div");
chatWidget.className = "web-chat-widget";
chatWidget.style.cssText = `position: absolute; cursor: pointer`;
chatWidget.textContent = "Chat Widget";
chatWidget.style.display = "none";
document.body.appendChild(chatWidget);

// Function to ask the user to type a question about the selected text in the chat input
function askAboutText(text) {
	console.log("Ask about this text:", text);
	// inside the sidebar panel where the chat is displayed,
	// ask the user to type a question about the selected text in the chat input
	// Send the selected text to the sidebar script
	browser.runtime.sendMessage({
		action: "askAboutText",
		target: "background.js",
		text: text,
	});
}

// Function to copy the selected text to the chat input
function copyToChat(text) {
	console.log("Text copied to chat:", text);
	// Implement functionality to copy text to the chat input
}

// Function to highlight selected text
// TODO: fix the isssue with non-contiguous selections or selections spanning different element types
// maybe use a javascript library like mark.js, rangy or highlight.js.
// function highlightSelection() {
// 	const selection = window.getSelection();
// 	if (!selection.rangeCount || selection.isCollapsed) return;

// 	const range = selection.getRangeAt(0);
// 	if (!range.collapsed) {
// 		const span = document.createElement("span");
// 		span.className = "highlighted-text";
// 		span.style.cursor = "pointer";

// 		try {
// 			range.surroundContents(span);
// 			selection.removeAllRanges(); // Optional: remove selection
// 			showPopover(
// 				range.getBoundingClientRect().x,
// 				range.getBoundingClientRect().y
// 			);
// 		} catch (e) {
// 			console.error("Error applying highlight:", e);
// 		}
// 	}
// }

// Hide popover and remove highlighting
function clearSelection() {
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		// Fallback for very old IE
		document.selection.empty();
	}
}

// Show chat widget
function showChatWidget() {
	chatWidget.style.display = "block";
}

// Hide chat widget
function hideChatWidget() {
	chatWidget.style.display = "none";
}

// Hide popover and remove highlighting
function removeHighlighting() {
	const highlights = document.querySelectorAll(".highlighted-text");
	highlights.forEach((highlight) => {
		const parent = highlight.parentNode;
		if (parent) {
			const textNode = document.createTextNode(highlight.textContent);
			parent.replaceChild(textNode, highlight);
		}
	});
	popover.style.display = "none";
}

// Function to show popover near the highlighted text
function showPopover(x, y) {
	const popoverHeight = popover.offsetHeight;
	popover.style.left = `${x}px`;
	popover.style.top = `${y}px`;
	popover.style.display = "block";
}

// Function to close the popover
function closePopover() {
	const popover = document.querySelector(".web-chat-text-selection-popover");
	popover.style.display = "none";
}

// Event listeners
// Event listener for mouse up to trigger highlighting
document.addEventListener("mouseup", (event) => {
	const selection = window.getSelection();
	if (!selection.toString().trim() || selection.isCollapsed) {
		closePopover();
		return;
	}

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();
	showPopover(rect.left + rect.width / 2, rect.top - rect.height / 4);
});

// Event listener for mouse down to remove highlighting and popover
document.addEventListener("mousedown", (event) => {
	if (!popover.contains(event.target)) {
		closePopover();
	}
});

// Button Functionalities
popover_copy_btn.addEventListener("click", (event) => {
	event.stopPropagation();
	let selectedText = window.getSelection().toString().trim();
	copyToChat(selectedText);
	clearSelection();
	closePopover();
});

// copyBtn.addEventListener("click", () => {
// 	// const highlightedText = document.querySelector(".highlighted-text");
// 	let highlightedText = window.getSelection().toString().trim();
// 	if (highlightedText) {
// 		navigator.clipboard.writeText(highlightedText).then(
// 			() => {
// 				alert("Text copied to clipboard");
// 			},
// 			(err) => {
// 				console.error("Failed to copy text: ", err);
// 			}
// 		);
// 	}
// });

popover_ask_btn.addEventListener("click", (event) => {
	event.stopPropagation();
	let selectedText = window.getSelection().toString().trim();
	askAboutText(selectedText);
	clearSelection();
	closePopover();
});

// chatWidget.addEventListener("click", (event) => {
// 	// Open the sidebar
// 	browser.runtime.sendMessage({
// 		action: "openSidebar",
// 		sender: "content.js",
// 		target: "background.js",
// 	});
// });

// Message handlers
const handleBackgroundMessages = (message, sender, sendReponse) => {};

const handlePopupMessages = (message, sender, sendResponse) => {
	if (message.sender !== "popup.js") {
		return;
	}

	switch (message.action) {
		case "activateChatWidget":
			console.log("Chat widget is enabled: ", message);
			if (message.value) {
				// show chat widget
				showChatWidget();
			} else {
				// hide chat widget
				hideChatWidget();
			}
			break;
		default:
			console.warn(`Unexpected message type received: '${message}'.`);
	}
};

// Listen for messages
browser.runtime.onMessage.addListener(handlePopupMessages);
