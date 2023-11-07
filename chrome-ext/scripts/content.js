// // https://developer.chrome.com/docs/extensions/mv3/content_scripts/#security
// (async () => {
//     let some_variable;

//     // Send a 'ready' message to the background script
//     chrome.runtime.sendMessage({ type: "content_script_ready" });

//     chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
//         const { type, value, parameters } = message;

//         console.log("content script: ", message);

//         if (type == "chat_btn_create") {
//             chatBtnLoaded();
//         }

//         // senderResponse();
//     });

//     const chatBtnLoaded = () => {
//         const chatBtnExists = document.getElementsByClassName("chat-btn")[0];

//         console.log(chatBtnExists);
//     };
// })();

// document.addEventListener("DOMContentLoaded", function () {
//     const questionInput = document.getElementById("questionInput");
//     const submitButton = document.getElementById("submitButton");
//     const answerContainer = document.getElementById("answerContainer");

//     // Send a question to the backend server and handle the response
//     function askQuestion(context) {
//         const question = questionInput.value;
//         const apiUrl = "http://your-backend-server.com/api/question"; // Replace with your backend server URL

//         fetch(apiUrl, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ question, context }),
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
//     submitButton.addEventListener("click", function () {
//         chrome.tabs.query(
//             { active: true, currentWindow: true },
//             function (tabs) {
//                 chrome.tabs.sendMessage(
//                     tabs[0].id,
//                     { method: "getContext" },
//                     function (response) {
//                         if (response.method == "getContext") {
//                             askQuestion(response.data);
//                         }
//                     }
//                 );
//             }
//         );
//     });
// });
