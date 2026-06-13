import { Bot, InlineKeyboard } from "grammy";
import { getTodayEntries, getJournalList, getStreak, deleteEntry, editLastEntry, saveEntry } from "./journal";
import { readdir } from "fs/promises";
import { join } from "path";

export function registerCommands(bot: Bot) {
  bot.command("start", (ctx) => {
    ctx.reply(
      "Личный дневник \n" +
      "Просто напиши как прошёл день — я сохраню.\n\n" +
      "/menu — открыть меню\n" +
      "/today — записи за сегодня\n" +
      "/list — все дни\n" +
      "/stats — стрик"
    );
  });

  bot.command("menu", async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text("Сегодня", "today")
      .text("Список", "list")
      .row()
      .text("Стрик", "stats")
      .text("Помощь", "help");

    await ctx.reply("Главное меню:", { reply_markup: keyboard });
  });

  bot.callbackQuery("today", async (ctx) => {
    const entries = await getTodayEntries();
    await ctx.answerCallbackQuery();
    await ctx.reply(entries);
  });

  bot.callbackQuery("list", async (ctx) => {
    await ctx.answerCallbackQuery();
    await showDateList(ctx);
  });

  bot.callbackQuery("stats", async (ctx) => {
    const streak = await getStreak();
    await ctx.answerCallbackQuery();
    await ctx.reply(streak);
  });

  bot.callbackQuery("help", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.reply(
      "Команды:\n\n" +
      "/menu — главное меню\n" +
      "/today — записи за сегодня\n" +
      "/list — все дни\n" +
      "/stats — стрик\n\n" +
      "Просто напиши текст — я сохраню запись."
    );
  });

  bot.command("list", async (ctx) => {
    await showDateList(ctx);
  });

  bot.callbackQuery(/^day:(.+)$/, async (ctx) => {
    const date = ctx.match[1]!;
    const entries = await getTodayEntries(date);
    await ctx.answerCallbackQuery();

    const keyboard = new InlineKeyboard()
      .text("Удалить день", `delete:${date}`)
      .row()
      .text("Редактировать последнюю", `edit:${date}`)
      .row()
      .text("Назад", "list");

    await ctx.reply(`📅 ${date}:\n\n${entries}`, { reply_markup: keyboard });
  });

  bot.callbackQuery(/^delete:(.+)$/, async (ctx) => {
    const date = ctx.match[1]!;
    await ctx.answerCallbackQuery();

    const keyboard = new InlineKeyboard()
      .text("Да, удалить", `confirm_delete:${date}`)
      .text("Отмена", `day:${date}`);

    await ctx.reply(`Удалить все записи за ${date}?`, { reply_markup: keyboard });
  });

  bot.callbackQuery(/^confirm_delete:(.+)$/, async (ctx) => {
    const date = ctx.match[1]!;
    await ctx.answerCallbackQuery();
    await deleteEntry(date);
    await ctx.reply(`✓ Записи за ${date} удалены.`);
  });

  bot.callbackQuery(/^edit:(.+)$/, async (ctx) => {
    const date = ctx.match[1]!;
    await ctx.answerCallbackQuery();
    await ctx.reply(
      `Напиши новый текст для последней записи за ${date}.\n\nОтветь на это сообщение:`,
      { reply_markup: { force_reply: true } }
    );

    editState.set(ctx.from!.id, date);
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (text.startsWith("/")) return;

    const userId = ctx.from!.id;

    if (editState.has(userId)) {
      const date = editState.get(userId)!;
      editState.delete(userId);
      await editLastEntry(date, text);
      await ctx.reply(`✓ Последняя запись за ${date} обновлена.`);
      return;
    }

    const filename = await saveEntry(text);
    await ctx.reply(`✓ Записано в ${filename}`);
  });

  bot.command("today", async (ctx) => {
    const entries = await getTodayEntries();
    await ctx.reply(entries);
  });

  bot.command("stats", async (ctx) => {
    const streak = await getStreak();
    await ctx.reply(streak);
  });
}

const editState = new Map<number, string>();

async function showDateList(ctx: any) {
  const dirPath = join(process.cwd(), "journals");

  try {
    const files = await readdir(dirPath);
    const dates = files
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""))
      .sort()
      .reverse()
      .slice(0, 10);

    if (dates.length === 0) {
      await ctx.reply("Записей пока нет.");
      return;
    }

    const keyboard = new InlineKeyboard();
    dates.forEach((date, i) => {
      keyboard.text(`📅 ${date}`, `day:${date}`);
      if (i % 2 === 1) keyboard.row();
    });

    await ctx.reply("Выбери день:", { reply_markup: keyboard });
  } catch {
    await ctx.reply("Записей пока нет.");
  }
}