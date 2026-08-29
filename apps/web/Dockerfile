FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN npm ci

COPY apps/web ./apps/web
COPY packages/contracts ./packages/contracts
COPY turbo.json ./

RUN npx turbo run build --filter=web...


FROM nginx:alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf