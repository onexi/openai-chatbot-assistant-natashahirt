const airplaneIconHTML = '<i class="fas fa-paper-plane"></i>';

// Initiate the state object with the assistant_id and threadId as null and an empty array for messages
let state = {
  assistant_id: null,
  assistant_name: null,
  threadId: null,
  messages: [],
};

async function getAssistant() {
  let name = document.getElementById('assistant_name').value;
  console.log(`assistant_id: ${name}`);
  try {
    const response = await fetch('/api/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    });
    state = await response.json(); // Update state with server response
    writeToMessages(`Assistant ${state.assistant_name} is ready to chat.`,user="system");
    console.log(`back from fetch with state: ${JSON.stringify(state)}`);
  } catch (error) {
    console.error('Error fetching assistant:', error);
  }
}

async function getThread() {
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
    writeToMessages('New thread created.',role="system");
  } catch (error) {
    console.error('Error creating thread:', error);
  }
}

async function getResponse() {
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

  // Disable the send button
  sendBtn.disabled = true;
  spinner.style.display = "inline-block"; // Show spinner
  buttonText.innerHTML = ""; // Update button text to the spinner
  console.log("Send button disabled");
  writeToMessages(message, role='user');

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
    console.log(data); // DEBUG Log the response data structure
    const assistantResponse = data.messages[1]?.content[0]?.text?.value || "No response available";
    writeToMessages(assistantResponse, role='assistant'); // Display the assistant's response

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

function writeToMessages(message, role = 'assistant') {
  const messageContainer = document.getElementById("message-container");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", role); // Add "user" or "assistant" class based on role
  messageElement.textContent = message;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to latest message
}

document.addEventListener("DOMContentLoaded", async () => {
  const buttonText = document.getElementById("buttonText");
  buttonText.innerHTML = airplaneIconHTML;
  const sendBtn = document.getElementById("sendBtn");
  const messageInput = document.getElementById("messageInput");

  // Set the default airplane icon for the send button
  buttonText.innerHTML = '<i class="fas fa-paper-plane"></i>';

  // Set the default assistant ID
  document.getElementById("assistant_name").value = "asst_mKubPnoRJxz3sL90FRE9NEZH";

  // Load the assistant and create a new thread
  await getAssistant();
  await getThread();

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

// Toggle between showing the text and input field
function toggleAssistantInput() {
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

// Event listener
document.addEventListener("DOMContentLoaded", () => {
  // Attach the toggle function to the button
  document.getElementById("get_assistant").onclick = toggleAssistantInput;

  // Handle Enter key to save the assistant ID
  document.getElementById("assistant_name").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      toggleAssistantInput(); // Call toggle function to save and switch back
    }
  });
});
