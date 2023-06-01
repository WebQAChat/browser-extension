// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", () => {});

// Function for toggle chat widget
function toggleChatWidget() {
     var chatWidget = document.getElementById("chat-widget");
     var toggleButton = document.getElementById("toggle-button");

     // if (chatWidget.style.display === "none") {
     //      chatWidget.style.display = "block";
     //      toggleButton.innerHTML = `<i class="fa-solid fa-x"></i>`;
     // } else {
     //      chatWidget.style.display = "none";
     //      toggleButton.innerHTML = `<i class="fa-solid fa-comment"></i>`;
     // }

     if(!chatWidget.classList.contains('active')){
          chatWidget.classList.add('active');
     }else{
          chatWidget.classList.remove('active');
     }
}

// Get the chat window to insert user message
const chatWindow = document.getElementById('chat-window');

// Sending messages
function sendMessage() {
     // Get the input value from the message input field
     var messageInput = document.getElementById("message-input");
     var message = messageInput.value.trim(); // Remove leading/trailing spaces

     if (message !== "") {
          // Do something with the message (e.g., send it to the server)
          console.log("Sending message:", message);
          chatWindow.innerHTML += `
               <div class="user-message-container message-container" id="user-message-container">
                    <p class="message">${message}</p>
                    <span class="time">9:00 pm</span>
               </div>
          `;

          // Clear the input field after sending the message
          messageInput.value = "";
     }
}