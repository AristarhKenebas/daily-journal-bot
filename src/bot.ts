import { Bot } from "grammy";
import { saveEntry } from "./journal";
import { registerCommands } from "./commands";

const bot = new Bot(process.env.BOT_TOKEN!);
const MY_CHAT_ID = Number(process.env.YOUR_CHAT_ID);

bot.use(async (ctx, next) => {
  if (ctx.chat?.id !== MY_CHAT_ID) {
    await ctx.reply("Это приватный бот.");
    return;
  }
  await next();
});

registerCommands(bot);

export { bot };
bot.start();