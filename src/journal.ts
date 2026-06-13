import { mkdir, appendFile } from "fs/promises";
import { join } from "path";

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