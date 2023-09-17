require("dotenv").config(); // Load environment variables from .env file

const TelegramBot = require("node-telegram-bot-api"); // Import the Telegram bot library

// Create a new TelegramBot instance using the bot token from environment variables
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true, // Enable polling to receive messages
});

module.exports = {
  // Define a function to send a message via the Telegram bot
  sendMessage: async (message) => {
    // Use the Telegram bot to send a message to the specified chat ID
    await telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, `${message}`, {
      parse_mode: "MarkdownV2", // Parse the message using MarkdownV2
    });
  },
};
