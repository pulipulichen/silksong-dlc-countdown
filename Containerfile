# Optional Podman-only local build: no host Node.js/npm.
FROM docker.io/library/node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM docker.io/library/nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/silksong-dlc-countdown/
EXPOSE 80
