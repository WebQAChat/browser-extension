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

          // Do something with the message (e.g., send it to the server)
          console.log("Sending message:", message);
          chatWindow.innerHTML += `
               <div class="user-message-container message-container" id="user-message-container">
                    <div class="message">${message}</div>
                    <span class="time">${currentTime}</span>
               </div>
               <div class="gpt-message-container message-container loading" id="gpt-message-container">
                    <div class="message"><div class="message-generating-loader"></div></div>
               </div>
          `;

          setTimeout(function() {
               // Generated message
               var generatedMessage = 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, quia. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus, quia. Lorem ipsum dolor sit amet consectetur adipisicing elit.';
               
               // Replace to loading message with generated message
               const loadingMessage = document.querySelector('.loading');
               loadingMessage.classList.remove('loading');
               loadingMessage.innerHTML = `
                    <div class="message currentMessage"></div>
                    <span class="time">${currentTime}</span>
               `;

               var i = 0;
               var speed = 10; /* The speed/duration of the effect in milliseconds */
               var typingInterval;
               
               function startTypingAnimation() {
                  typingInterval = setInterval(typeWriter, speed);
               }
               
               // Type Writer function
               function typeWriter() {
                  if (i < generatedMessage.length) {
                     document.querySelector(".currentMessage").innerHTML += generatedMessage.charAt(i);
                     i++;
                  } else {
                     clearInterval(typingInterval);
                     document.querySelector('.currentMessage').classList.remove('currentMessage');
                     sendBtn.removeAttribute('disabled');
                  }
                  scrollToBottom(chatWindow);
               }
               
               // Call the function to start the typing animation
               startTypingAnimation();

               scrollToBottom(chatWindow);
          }, 1000);

          scrollToBottom(chatWindow);

          // Clear the input field after sending the message
          messageInput.value = "";
     }
}

