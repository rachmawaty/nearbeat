FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=frontend-builder /app/dist ./dist
COPY server/ ./server/
WORKDIR /app/server
RUN npm ci --omit=dev
WORKDIR /app
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server/index.js"]
