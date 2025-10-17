# Base Alpine image for all stages
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat dumb-init
WORKDIR /app

# Dependencies stage - install all dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Development stage - for hot reload
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY . .
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]