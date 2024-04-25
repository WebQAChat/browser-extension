// chat options: single tab chat, (cross) multi-tabs chat, web search access, screnshot chat, voice chat

// Listen for messages
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.action === "populateChatInput") {
		console.log(`Message from tab ID: ${message.tabId}`); // Optionally log sender information
		console.log(`Message text: ${message.text}`); // Optionally log message text

		// don't want to populate when asking about the selected text
		// TODO: highlight the selected text on the page (content.js?) and ask the user to type a question about it
		// in the sidebar chat input
		const chatInput = document.getElementById("chatInput");
		if (chatInput) {
			chatInput.value = message.text;
			chatInput.focus(); // Focus the input to prompt the user
		}
	}
});

// Add a message to the chat
function addMessage(sender, message) {
	var chatBody = document.getElementById("chatBody");
	var messageDiv = document.createElement("div");
	messageDiv.classList.add("message", sender + "-message");
	messageDiv.textContent = message;
	chatBody.appendChild(messageDiv);
	chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the latest message
}

// Add a loading animation to indicate that the bot is typing
function addLoadingAnimation() {
	var chatBody = document.getElementById("chatBody");
	var loadingDiv = document.createElement("div");
	loadingDiv.classList.add("message", "bot-message", "loading"); // Add 'bot-message' class here

	// Instead of creating a new 'dots-container' div, we put the dots directly inside the loadingDiv
	loadingDiv.innerHTML =
		'<div class="dot"></div><div class="dot"></div><div class="dot"></div>';

	chatBody.appendChild(loadingDiv);
	chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the latest message
}

// Capture a screenshot of the current tab
function captureScreenshot() {
	// Send a message to the background script to capture the screenshot
	browser.runtime
		.sendMessage({ action: "captureScreenshot" })
		.then((response) => {
			console.log("Screenshot captured:", response.imageUri);
			displayScrenshotForQuestion(response.imageUri);
		})
		.catch((err) => console.error("Error capturing screenshot:", err));
}

// Remove the loading animation
function removeLoadingAnimation() {
	var loadingDiv = document.querySelector(".loading");
	if (loadingDiv) {
		loadingDiv.remove();
	}
}

// send the message to the server
function sendMessage() {
	let chatInput = document.getElementById("chatInput");
	// TODO: sanitize the input to prevent XSS attacks and the like (e.g., no <script> tags)
	let message = chatInput.value.trim();

	if (message) {
		addMessage("user", message);
		chatInput.value = "";
		addLoadingAnimation();

		fetch(
			`http://localhost:8000/api/model/query?input=${encodeURIComponent(
				message
			)}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json", // If your server expects a JSON payload
				},
				body: JSON.stringify({ query: message }), // Send the message as a JSON body if required by your endpoint
			}
		)
			.then((response) => {
				console.log("response", response);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				removeLoadingAnimation();
				addMessage("bot", data);
			})
			.catch((error) => {
				removeLoadingAnimation();
				addMessage("bot", error);
			});
	}
}

document.addEventListener("DOMContentLoaded", function () {
	// Focus the chat input when the sidebar is opened
	document.getElementById("chatInput").focus();

	const sendBtn = document.getElementById("chatMsgSendBtn");
	sendBtn.addEventListener("click", sendMessage);

	const captureBtn = document.getElementById("chatScreenshotBtn");
	captureBtn.addEventListener("click", captureScreenshot);
});

// Allow "Enter" key to send the message
document.getElementById("chatInput").addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		sendMessage();
	}
});
