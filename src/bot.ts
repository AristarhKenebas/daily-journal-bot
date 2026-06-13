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

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith("/")) return;
  const filename = await saveEntry(text);
  await ctx.reply(`✓ Записано в ${filename}`);
});

export { bot };

bot.start();