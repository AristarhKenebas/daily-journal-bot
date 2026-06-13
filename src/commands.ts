import { Bot } from "grammy";
import { getTodayEntries, getJournalList, getStreak } from "./journal";

export function registerCommands(bot: Bot) {
  bot.command("today", async (ctx) => {
    const entries = await getTodayEntries();
    await ctx.reply(entries);
  });

  bot.command("list", async (ctx) => {
    const list = await getJournalList();
    await ctx.reply(list);
  });

  bot.command("stats", async (ctx) => {
    const streak = await getStreak();
    await ctx.reply(streak);
  });

  bot.command("start", (ctx) => {
    ctx.reply(
      "Личный дневник\n\n" +
      "Просто напиши как прошёл день — я сохраню.\n\n" +
      "Команды:\n" +
      "/today — записи за сегодня\n" +
      "/list — все дни\n" +
      "/stats — стрик"
    );
  });
}