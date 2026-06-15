import type { MessageEntity } from "grammy/types";

export function applyMarkdown(text: string, entities?: MessageEntity[]): string {
  if (!entities || entities.length === 0) return text;

  let result = text;
  // Сортируем с конца, чтобы не сбивались индексы
  const sortedEntities = [...entities].sort((a, b) => b.offset - a.offset);

  for (const entity of sortedEntities) {
    const before = result.slice(0, entity.offset);
    const inner = result.slice(entity.offset, entity.offset + entity.length);
    const after = result.slice(entity.offset + entity.length);

    switch (entity.type) {
      case "bold": result = `${before}**${inner}**${after}`; break;
      case "italic": result = `${before}*${inner}*${after}`; break;
      case "strikethrough": result = `${before}~~${inner}~~${after}`; break;
      case "underline": result = `${before}__${inner}__${after}`; break;
      case "spoiler": result = `${before}||${inner}||${after}`; break;
      case "code": result = `${before}\`${inner}\`${after}`; break;
      case "pre": result = `${before}\n\`\`\`\n${inner}\n\`\`\`\n${after}`; break;
      case "blockquote": 
        const quoted = inner.split('\n').map(line => `> ${line}`).join('\n');
        result = `${before}\n${quoted}\n${after}`; 
        break;
      case "text_link": result = `${before}[${inner}](${entity.url})${after}`; break;
    }
  }
  return result;
}