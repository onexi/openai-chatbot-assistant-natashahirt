// Load environment variables
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// If using Node.js < 18, uncomment the next line
// const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// State dictionary
let state = {
  assistant_id: null,
  assistant_name: null,
  threadId: null,
  messages: [],
};
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
// Route to get the list of Assistants
app.post('/api/assistants', async (req, res) => {
  let assistant_id = req.body.name;
    try {
        let myAssistant = await openai.beta.assistants.retrieve(
          assistant_id
        );
        console.log(myAssistant);
              // Extract the list of assistants from 'data.data'
        state.assistant_id = myAssistant.id; // Updated line
        state.assistant_name = myAssistant.name; // Updated line
        res.status(200).json(state);
      }
      catch{
        if (!myAssistant.ok) {
          const errorText = await myAssistant.text;
          console.error('Error fetching assistants:', errorText);
          return res.status(myAssistant.status).json({ error: 'Failed to fetch assistants' });
        }
      }
  });
  

  app.post('/api/threads', async (req, res) => {
    const { assistantId } = req.body;
    try {
      // Call OpenAI API to create a thread
      const response = await openai.beta.threads.create({
        assistant_id: assistantId,
      });
  
      // Set the threadId in state and send it in the response
      state.threadId = response.id;
      state.messages = []; // Reset messages
      res.json({ threadId: state.threadId });
    } catch (error) {
      console.error('Error creating thread:', error);
      res.status(500).json({ error: 'Failed to create thread' });
    }
  });


// Route to send a message and run the Assistant
app.post('/api/run', async (req, res) => {
  const { message } = req.body;
  state.messages.push({ role: 'user', content: message });

  try {
    // Send message to assistant in the thread
    await openai.beta.threads.messages.create(state.threadId, {
      role: "user",
      content: message,
    });

    // Run and poll the thread
    const run = await openai.beta.threads.runs.createAndPoll(state.threadId, {
      assistant_id: state.assistant_id,
    });

    // Check if run is successful
    if (!run || !run.status || run.status !== "completed") {
      console.error('Error: Assistant run did not complete successfully');
      return res.status(500).json({ error: 'Failed to run assistant' });
    }

    // Get messages from the thread and find the assistant's latest response
    const messages = await openai.beta.threads.messages.list(state.threadId);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    // Add the assistant's message to the state
    if (assistantMessage) {
      state.messages.push({ role: 'assistant', content: assistantMessage.content });
    }

    res.json({ messages: state.messages });
  } catch (error) {
    console.error('Error running assistant:', error);
    res.status(500).json({ error: 'Failed to run assistant' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});