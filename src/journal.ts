import { join } from "path";
import { mkdir, appendFile, readFile, readdir } from "fs/promises";

export async function saveEntry(text: string): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const filename = `${year}-${month}-${day}.md`;
  const dirPath = join(process.cwd(), "journals");
  const filePath = join(dirPath, filename);

  const time = now.toTimeString().slice(0, 5);
  const content = `\n## ${time}\n\n${text}\n`;

  await mkdir(dirPath, { recursive: true });
  await appendFile(filePath, content, "utf-8");

  return filename;
}

export async function getTodayEntries(): Promise<string> {
  const now = new Date();
  const filename = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}.md`;
  const filePath = join(process.cwd(), "journals", filename);

  try {
    const content = await readFile(filePath, "utf-8");
    return content.trim() || "Сегодня записей нет.";
  } catch {
    return "Сегодня записей нет.";
  }
}

export async function getJournalList(): Promise<string> {
  const dirPath = join(process.cwd(), "journals");

  try {
    const files = await readdir(dirPath);
    const mdFiles = files.filter(f => f.endsWith(".md")).sort().reverse();

    if (mdFiles.length === 0) return "Записей пока нет.";

    const list = mdFiles.map(f => `📅 ${f.replace(".md", "")}`).join("\n");
    return `Твои записи:\n\n${list}`;
  } catch {
    return "Записей пока нет.";
  }
}

export async function getStreak(): Promise<string> {
  const dirPath = join(process.cwd(), "journals");

  try {
    const files = await readdir(dirPath);
    const dates = files
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""))
      .sort()
      .reverse();

    if (dates.length === 0) return "Стрик: 0 дней";

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const current = new Date(dates[i]as string);
      const next = new Date(dates[i + 1]as string);
      const diff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }

    return `Стрик: ${streak} ${streak === 1 ? "день" : streak < 5 ? "дня" : "дней"} подряд`;
  } catch {
    return "Стрик: 0 дней";
  }
}