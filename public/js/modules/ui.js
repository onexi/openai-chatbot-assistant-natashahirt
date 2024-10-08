// ui.js

// icon html for send button
export const airplaneIconHTML = '<i class="fas fa-paper-plane"></i>';

export function formatMessageContent(content) {
  // Remove "Source: [" and trim any extra whitespace
  content = content.replace(/Source:\s*\[/g, ""); 

  // Replace "**text**" with "<strong>text</strong>" for bold text
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Add line breaks for numbered and bullet points
  content = content.replace(/(\d+\.) /g, "<br><strong>$1</strong> ");
  content = content.replace(/- /g, "&nbsp;&nbsp;&bull; ");
  content = content.replace(/\n/g, "<br>");
  
  // Detect source markers like "8:3†bankingProducts.json" and format them
  content = content.replace(/(\d+:\d+)†(.*?)\]/g, (match, p1, p2) => {
  const [page, section] = p1.split(':');
  return `<span class="citation">(Source: ${p2}, page ${page}, section ${section})</span>`;
  });

  return content;
}

// write to messages
export function writeToMessages(message, role = 'assistant') {
    const messageContainer = document.getElementById("message-container");
    const messageElement = document.createElement("div");

    // append styling based on the role
    messageElement.classList.add("message", role); // Add "user" or "assistant" class based on role
    messageElement.innerHTML = message;

    // append message element to message container
    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to latest message
}

// Function to display only the last message in the messages array
export function displayLastMessage(state) {
  const lastMessage = state.messages[state.messages.length - 1]; // Get the last message

  if (lastMessage.role === "assistant") {
      const formattedContent = formatMessageContent(lastMessage.content);
      writeToMessages(formattedContent, "assistant"); // Display the assistant's response
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

