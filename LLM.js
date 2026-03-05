import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// ── Shared chat session (persists for the lifetime of the server process)
const chat = {
  model: "openai/gpt-3.5-turbo",
  history: [
    {
      role: "system",
      content: `You are DeepChat, a friendly, helpful, and professional AI assistant.
Keep responses concise and clear.
When listing multiple options or steps, use a short bullet list.`
    }
  ]
};

// ── Sends a message and returns the assistant reply
export async function sendMessage(userMessage) {
  chat.history.push({
    role: "user",
    content: userMessage
  });

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: chat.model,
      messages: chat.history
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const reply = response.data.choices[0].message.content;

  chat.history.push({
    role: "assistant",
    content: reply
  });

  return reply;
}