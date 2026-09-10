FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p public/uploads

EXPOSE 3001

VOLUME ["/app/public/uploads", "/app/db"]

CMD ["node", "server.js"]
