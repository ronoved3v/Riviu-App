require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

module.exports = {
  sendMessage: async (message) => {
    await telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, `${message}`, {
      parse_mode: "MarkdownV2",
    });
  },
};
