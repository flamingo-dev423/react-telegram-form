const cookieParser = require("cookie-parser");
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json()); // To parse incoming JSON data
app.use(cookieParser()); // To parse cookies

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // Replace with your Telegram Bot API token
const CHAT_ID = process.env.CHAT_ID; // Replace with your Telegram chat ID (can be a user or group ID)

const cors = require("cors");
app.use(cors({
    origin: [
        "https://react-telegram-form-5.onrender.com", // Replace with your React app's URL
        "https://react-telegram-form-4.onrender.com", // Replace with your React app's URL
        "http://localhost:3000", // Local development URL
    ],
    methods: "GET,POST",
    credentials: true, // Allow credentials (cookies) to be sent
    optionsSuccessStatus: 200, // For legacy browser support
})); // Enable CORS for all routes


app.get("/set-test-cookie", (req, res) => {
  res.cookie("testcookie", "hello", {
    httpOnly: true,
    sameSite: "lax", // or "none" if using HTTPS
    // secure: true, // only if using HTTPS
    path: "/"
  });
  res.send("Test cookie set!");
});

// POST route to receive form data and cookies
app.post("/send-to-telegram", async (req, res) => {
  const { name, email } = req.body;
  const cookies = req.cookies; // <-- This gets all cookies, including HttpOnly

  try {
    // Build the message to send to Telegram
    const message = `
      New User Submission:
      Name: ${name}
      Email: ${email}
      Cookies: ${JSON.stringify(cookies)}
    `;

    // Send message to Telegram using the Bot API
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending message to Telegram" });
  }
});

const sendMessageToTelegram = async (message) => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Telegram send error:", error); // <--- Add this line
    console.error("Error sending message to Telegram:", error);
    throw error;
  }
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});