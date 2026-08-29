FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN npm ci

COPY apps/api ./apps/api
COPY packages/contracts ./packages/contracts
COPY turbo.json ./

RUN npx turbo run build --filter=api...


FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json

RUN npm ci --omit=dev

COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/packages/contracts/dist ./packages/contracts/dist

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/server.js"]