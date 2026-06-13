FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

VOLUME ["/app/journals"]

CMD ["bun", "--env-file=.env", "index.ts"]
