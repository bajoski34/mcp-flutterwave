FROM node:20-alpine AS builder

WORKDIR /app

ENV DOCKER=true

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY tsconfig.json ./
COPY bin/ ./bin/
COPY src/ ./src/

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV DOCKER=true
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=builder /app/build ./build

CMD ["node", "build/index.js", "--tools=all"]
