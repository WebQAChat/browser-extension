// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

// document.addEventListener("DOMContentLoaded", () => {
//     const questionInput = document.getElementById("questionInput");
//     const submitButton = document.getElementById("submitButton");
//     const answerContainer = document.getElementById("answerContainer");

//     // Send a question to the backend server and handle the response
//     function askQuestion() {
//         const question = questionInput.value;
//         const apiUrl = "http://your-backend-server.com/api/question"; // Replace with your backend server URL

//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ question }),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 // Display the answer in the answerContainer
//                 answerContainer.innerText = data.answer;
//             })
//             .catch((error) => {
//                 console.error("Error:", error);
//             });
//     }

//     // Add event listener to submitButton
//     submitButton.addEventListener("click", askQuestion);
// });


// Function for toggle chat widget
function toggleChatWidget() {
     var chatWidget = document.getElementById("chat-widget");
     var toggleButton = document.getElementById("toggle-button");

     if(!chatWidget.classList.contains('active')){
          chatWidget.classList.add('active');
     }else{
          chatWidget.classList.remove('active');
     }
}

// Get the chat window to insert user message
var chatWindow = document.getElementById('chat-window');

// Get time
function getCurrentTime(){
     // Get current time
     const now = new Date();
     let currentHour = now.getHours();
     let currentMinute = now.getMinutes();
     let period = 'am';

     if(currentHour > 12){
          currentHour -= 12;
          period = 'pm';
     }else if(currentHour === 12){
          period = 'pm';
     }else if(currentHour = 0){
          currentHour = 12;
     }else if(currentHour < 10){
          // currentHour = '0' + currentHour;
     }

     // Add leading zero to minute if needed
     if(currentMinute < 10){
          currentMinute = '0' + currentMinute;
     }

     const currentTime = currentHour + ':' + currentMinute + ' ' + period;

     return currentTime;
}

// Function to scroll the chat container to the bottom
function scrollToBottom(element) {
     element.scrollTop = element.scrollHeight;
}

// Have to add submit event to Form to prevent default form submittion
const chatSubmitForm = document.getElementById('chatSubmitForm');
chatSubmitForm.addEventListener('submit', sendMessage);

// Sending messages
function sendMessage(event) {
     /* Prevent Form from submittiing default attribute action.
     If don't protect, Form will submit to link according to action 
     attribute inside Form tag. */
     event.preventDefault();

     // Get the input value from the message input field
     var messageInput = document.getElementById("message-input");
     var message = messageInput.value.trim(); // Remove leading/trailing spaces

     // Set the btn disabled to prevent user from sending message while generating message
     const sendBtn = document.getElementById('send-button');

     // Set the current time to variable from function
     var currentTime = getCurrentTime();

     if (message !== "") {
          // Set the btn disabled to prevent user from sending message while generating message
          sendBtn.setAttribute('disabled', true);

          chatWindow.innerHTML += `
               <div class="user-message-container message-container" id="user-message-container">
                    <div class="message">${message}</div>
                    <span class="time">${currentTime}</span>
               </div>
               <div class="gpt-message-container message-container loading" id="gpt-message-container">
                    <div class="message"><div class="message-generating-loader"></div></div>
               </div>
          `;

          const loadingMessage = document.querySelector('.loading');
          axios.get(`/api/query?question=${messageInput.value}`, {
               message: messageInput.value
          }).then((data) => {
               // Replace to loading message with generated message
               loadingMessage.classList.remove('loading');
               loadingMessage.innerHTML = `
                    <div class="message currentMessage"></div>
                    <span class="time">${currentTime}</span>
               `;
               
               console.log(data);
               // Generated message
               var generatedMessage = `${data.data}`;

               const currentMessage = document.querySelector(".currentMessage");

               var typeWriter = new typeWriterAnimation(generatedMessage, 1, currentMessage, sendBtn);
               typeWriter.typeWriter();

               scrollToBottom(chatWindow);
          }).catch(error => {
               // For error stages
               console.error(error);
               console.log('error api');
               if(error.response.status === 500){
                    console.log('Server error.');
               }

               // Remove loading stage and remove disabled button
               loadingMessage.remove();
               sendBtn.removeAttribute('disabled');
          });

          // Do something with the message (e.g., send it to the server)
          console.log("Sending message:", message);

          scrollToBottom(chatWindow);

          // Clear the input field after sending the message
          messageInput.value = "";
     }
}

