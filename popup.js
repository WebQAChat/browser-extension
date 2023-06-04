// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", () => {
    const questionInput = document.getElementById("questionInput");
    const submitButton = document.getElementById("submitButton");
    const answerContainer = document.getElementById("answerContainer");

    // Send a question to the backend server and handle the response
    function askQuestion() {
        const question = questionInput.value;
        const apiUrl = "http://your-backend-server.com/api/question"; // Replace with your backend server URL

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Display the answer in the answerContainer
                answerContainer.innerText = data.answer;
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    // Add event listener to submitButton
    submitButton.addEventListener("click", askQuestion);
});


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

// Have to add submit event to Form to prevent default form submittion
const chatSubmitForm = document.getElementById('chatSubmitForm');
chatSubmitForm.addEventListener('submit', sendMessage)

// Sending messages
function sendMessage(event) {
     /* Prevent Form from submittiing default attribute action.
     If don't protect, Form will submit to link according to action 
     attribute inside Form tag. */
     event.preventDefault();

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

