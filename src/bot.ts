import { Bot } from "grammy";
import { saveEntry } from "./journal";

const bot = new Bot(process.env.BOT_TOKEN!);
const MY_CHAT_ID = Number(process.env.YOUR_CHAT_ID);

// Защита — отвечаем только себе
bot.use(async (ctx, next) => {
  if (ctx.chat?.id !== MY_CHAT_ID) {
    await ctx.reply("Это приватный бот.");
    return;
  }
  await next();
});

// Когда пишем текст — сохраняем в файл
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;

  // Игнорируем команды типа /start
  if (text.startsWith("/")) return;

  const filename = await saveEntry(text);
  await ctx.reply(`✓ Записано в ${filename}`);
});

bot.command("start", (ctx) => {
  ctx.reply("Привет! Напиши как прошёл день — я сохраню это в дневник.");
});

export { bot };

bot.start();