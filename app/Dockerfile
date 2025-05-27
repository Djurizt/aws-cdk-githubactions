
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build 

# —— runtime image ——
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV=production
CMD ["./dist/index.js"]