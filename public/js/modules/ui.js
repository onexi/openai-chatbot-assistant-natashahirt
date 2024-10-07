// ui.js

// icon html for send button
export const airplaneIconHTML = '<i class="fas fa-paper-plane"></i>';

// write to messages
export function writeToMessages(message, role = 'assistant') {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.createElement("div");

    // append styling based on the role
    messageElement.classList.add("message", role); // Add "user" or "assistant" class based on role
    messageElement.textContent = message;

    // append message element to message container
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to latest message
}

// Function to display only the last message in the messages array
export function displayLastMessage(state) {
  const lastMessage = state.messages[state.messages.length - 1]; // Get the last message

  if (lastMessage.role === "assistant") {
      writeToMessages(lastMessage.content, "assistant"); // Display the assistant's response
  } else if (lastMessage.role === "user") {
      writeToMessages(lastMessage.content, "user"); // Display the user's message
  }
}

// Toggle between showing the text and input field
export function toggleAssistantInput() {
    const assistantDisplay = document.getElementById("assistantDisplay");
    const assistantInput = document.getElementById("assistant_name");
    const getAssistantBtn = document.getElementById("get_assistant");
  
    if (getAssistantBtn.textContent === "Change Assistant") {
      // Switch to input mode
      assistantInput.style.display = "inline-block";
      assistantDisplay.style.display = "none";
      assistantInput.value = assistantDisplay.textContent; // Set input value to current assistant ID
      assistantInput.focus();
      getAssistantBtn.textContent = "Save";
    } else {
      // Save the assistant ID and switch to display mode
      assistantDisplay.textContent = assistantInput.value;
      assistantDisplay.style.display = "inline";
      assistantInput.style.display = "none";
      getAssistantBtn.textContent = "Change Assistant";
    }
}

export function initializeUI() {
    const getAssistantBtn = document.getElementById("get_assistant");
    if (getAssistantBtn) {
        getAssistantBtn.onclick = toggleAssistantInput;
    }
}