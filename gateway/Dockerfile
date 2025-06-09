FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/keycloak-config.js ./
COPY --from=builder /app/keycloak-config.d.ts ./
COPY package.json ./
EXPOSE 5000
CMD ["npm", "start"]