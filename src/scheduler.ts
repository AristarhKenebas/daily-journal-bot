import { Cron } from "croner";
import { bot } from "./bot";

const CHAT_ID = Number(process.env.YOUR_CHAT_ID);

new Cron("0 21 * * *", () => {
  bot.api.sendMessage(CHAT_ID, "Привет! Как прошёл сегодняшний день?");
});