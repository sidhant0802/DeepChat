import { sendMessage } from "./llm.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const reply = await sendMessage(message.trim());
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}