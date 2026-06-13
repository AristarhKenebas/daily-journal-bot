# Daily Journal Bot

A personal Telegram bot that asks how your day went every evening and saves your answer as a Markdown file.

Built with [Bun](https://bun.sh) and [grammY](https://grammy.dev).

## Features

- Sends you a reminder every evening at 21:00
- Saves your replies as `.md` files organized by date
- Private by default — only responds to your Telegram account

## Stack

- **Runtime:** Bun
- **Language:** TypeScript
- **Telegram:** grammY
- **Scheduler:** croner

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AristarhKenebas/daily-journal-bot.git
cd daily-journal-bot
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

- `BOT_TOKEN` — get it from [@BotFather](https://t.me/BotFather)
- `YOUR_CHAT_ID` — send any message to your bot and check the console output

### 4. Run

```bash
bun --env-file=.env index.ts
```

## Journal Storage

Entries are saved to the `journals/` directory as daily Markdown files:

```
journals/
├── 2026-06-13.md
├── 2026-06-14.md
└── ...
```

Each file contains timestamped entries for that day.

## Docker

```bash
docker build -t daily-journal-bot .
docker run -d \
  --env-file .env \
  -v $(pwd)/journals:/app/journals \
  daily-journal-bot
```