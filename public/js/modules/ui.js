// ui.js

import { getAssistant, getThread, getResponse } from './api.js'; // Adjust the path as necessary
import { state } from './state.js'; // Import the state object

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

export function clearMessages() {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = ""; // Clear all existing messages
}

// Fetches the selected assistant and handles the toggle
export async function toggleAssistantInput() {
  const assistantInput = document.getElementById("assistantSelect");

  // Set an event listener for the dropdown change
  assistantInput.addEventListener('change', async () => {
      await handleAssistantChange(); // Immediately handle the assistant change when the dropdown value changes
  });
}

// Function to handle the assistant change logic
async function handleAssistantChange() {
  const assistantInput = document.getElementById("assistantSelect");

  // Disable the dropdown while processing
  assistantInput.disabled = true;

  try {
      // Clear previous messages
      clearMessages();

      // Fetch the selected assistant ID from the dropdown
      const selectedAssistantId = assistantInput.value;

      // Update state with the new assistant ID
      state.assistant_id = selectedAssistantId;

      // Fetch the new assistant's data
      await getAssistant(); // Fetch the assistant based on the updated input

      // Start a new thread with the selected assistant
      await getThread();
  } catch (error) {
      console.error('Error changing assistant:', error);
  } finally {
      // Re-enable the dropdown after processing
      assistantInput.disabled = false;
  }
}

export function initializeUI() {
    const getAssistantBtn = document.getElementById("get_assistant");
    if (getAssistantBtn) {
        getAssistantBtn.onclick = toggleAssistantInput;
    }

    const newThreadBtn = document.getElementById("newThreadBtn");
    newThreadBtn.onclick = handleNewThread; // Attach the function to the button click
}

// Function to populate the assistant dropdown
export function populateAssistantDropdown(assistantMap) {
  const assistantSelect = document.getElementById('assistantSelect');
  
  // Clear existing options
  assistantSelect.innerHTML = '';

  // Loop through the assistantMap and create options
  for (const [name, id] of Object.entries(assistantMap)) {
      const option = document.createElement('option');
      option.value = id; // Set the value to the assistant ID
      option.textContent = name; // Set the display text to the assistant name
      assistantSelect.appendChild(option); // Append the option to the dropdown
  }
}

// Function to set up the assistant selection event
export function initializeAssistantSelection() {
  const assistantInput = document.getElementById("assistantSelect");

  // Set an event listener for the dropdown change
  assistantInput.addEventListener('change', async () => {
      await handleAssistantChange(); // Handle the assistant change when the dropdown value changes
  });
}

function handleNewThread() {
  // Clear messages before starting a new thread
  clearMessages();
  // Call the function to create a new thread
  getThread();
}
