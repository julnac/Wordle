FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src/repository/pgsql/prisma ./src/repository/pgsql/prisma
RUN npm install
RUN npx prisma generate --schema=src/repository/pgsql/prisma
COPY . .

RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/repository/pgsql/prisma ./src/repository/pgsql/prisma

COPY package.json ./
EXPOSE 5001
CMD ["npm", "start"]