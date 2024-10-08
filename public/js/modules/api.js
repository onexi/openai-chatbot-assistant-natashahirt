// api.js

import { state } from './state.js';
import { writeToMessages, displayLastMessage, airplaneIconHTML, clearMessages } from './ui.js';

export async function getAssistant() {
    const assistantSelect = document.getElementById('assistantSelect');
    const assistant_id = assistantSelect.value; // Get the selected assistant ID

    console.log(`assistant_id: ${assistant_id}`);

    try {
      const response = await fetch('/api/assistants', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: assistant_id }),
      });
      Object.assign(state, await response.json()); // Update properties without reassigning
      writeToMessages(`Assistant ${state.assistant_name} is ready to chat.`,"system");
      console.log(`back from fetch with state: ${JSON.stringify(state)}`);
    } catch (error) {
      console.error('Error fetching assistant:', error);
    }
}
  
export async function getThread() {
    try {
        const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assistant_id: state.assistant_id }),
        });
        const data = await response.json();
        state.threadId = data.thread_id;
        writeToMessages('New thread created.',"system");
    } catch (error) {
        console.error('Error creating thread:', error);
    }
}

export async function getResponse() {
    console.log("Send button clicked"); // DEBUG Log button click
  
    const sendBtn = document.getElementById("sendBtn");
    const spinner = document.getElementById("spinner"); // Select the spinner
  
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
  
    console.log("Message to send:", message); // DEBUG Log the message from the input
  
    if (!message) {
      console.log("No message to send"); // DEBUG Log if message is empty
      return; //
    }

    messageInput.value = "";
  
    // Disable the send button
    sendBtn.disabled = true;
    spinner.style.display = "inline-block"; // Show spinner
    buttonText.innerHTML = ""; // Update button text to the spinner
    console.log("Send button disabled");

    state.messages.push({ role: "user", content: message });
    displayLastMessage(state);
  
    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: state.threadId,
          assistant_id: state.assistant_id,
          message: message,
        }),
      });
  
      const data = await response.json();
      console.log("Messages in response:", data.messages); // Log to check structure

      // Retrieve the assistant's message with flexible structure access
      const lastAssistantMessage = data.messages[data.messages.length - 1]; // Get the last message
      let assistantResponse = "No response available";

      if (lastAssistantMessage && lastAssistantMessage.content) {
        if (typeof lastAssistantMessage.content === "string") {
          assistantResponse = lastAssistantMessage.content; // Direct string content
        } else if (Array.isArray(lastAssistantMessage.content)) {
          console.log(lastAssistantMessage.content[0]?.text?.value)
          assistantResponse = lastAssistantMessage.content[0]?.text?.value || assistantResponse;
        }
      }

      // Add assistant response to state and display it
      state.messages.push({ role: "assistant", content: assistantResponse });
      displayLastMessage(state);
  
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      // Re-enable the send button after run is complete
      sendBtn.disabled = false;
      spinner.style.display = "none"; // Hide spinner
      buttonText.innerHTML = airplaneIconHTML;
      console.log("Send button re-enabled"); // DEBUG
    }
}
  