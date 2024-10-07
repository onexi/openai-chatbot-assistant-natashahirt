// eventListeners.js

import { toggleAssistantInput } from './ui.js';

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
