import express from "express";
import { sendMessage } from "./llm.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// Serve index.html and static files from the same folder
app.use(express.static(__dirname));

// ── Health check (used by frontend to detect if server is running)
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "DeepChat server is running" });
});

// ── Main chat endpoint (called by index.html sendMsg())
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {
    const reply = await sendMessage(message.trim());
    res.json({ reply });
  } catch (err) {
    console.error("llm.js error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ DeepChat server running at http://localhost:${PORT}`);
  console.log(`   Open your browser → http://localhost:${PORT}\n`);
});