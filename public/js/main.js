// main.js

// import necessary modules
import { getAssistant, getThread, getResponse } from './modules/api.js';
import { airplaneIconHTML, initializeUI, populateAssistantDropdown, initializeAssistantSelection } from './modules/ui.js'; 

// Assign getThread to the global scope so HTML can access it
window.getThread = getThread;

const assistantMap = {
  "BankTest": "asst_mKubPnoRJxz3sL90FRE9NEZH",
  "Course TA": "asst_l94g43kQzS4ubStOC3F2tqpY",
  "TestAgent": "asst_ou57mAE4347tiKDTyXh2IzWL"
};

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  const buttonText = document.getElementById("buttonText");
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");

  // Set the default airplane icon for the send button
  buttonText.innerHTML = airplaneIconHTML;

  populateAssistantDropdown(assistantMap);
  initializeAssistantSelection();

  // Set the default assistant ID
  const defaultAssistantID = assistantMap["BankTest"];
  document.getElementById("assistantSelect").value = defaultAssistantID;

  // Initialize UI components
  initializeUI();

  // Load the assistant and create a new thread
  await getAssistant(assistantMap);
  await getThread(assistantMap);

  // Send message on button click
  sendBtn.onclick = getResponse;

  // Send message on Command + Enter (Mac) or Ctrl + Enter (Windows/Linux)
  messageInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault(); // Prevent new line in the input field
      getResponse();
    }
  });
});