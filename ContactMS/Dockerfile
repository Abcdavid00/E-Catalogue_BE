#
# 🧑‍💻 Development --------------------------------------------------------
#
FROM node:18-alpine AS dev

# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn --frozen-lockfile

# Copy source code into app folder
COPY . .

CMD ["yarn", "start:dev"]
#
# 🏡 Production Base & Build ----------------------------------------------------
#
FROM node:18-alpine AS base

ENV NODE_ENV production

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --ignore-scripts --production && yarn cache clean

## Remove unnecessary files from `node_modules` directory
RUN ( wget -q -O /dev/stdout https://gobinaries.com/tj/node-prune | sh ) \
 && node-prune

# -------------------------------------------------------------------------------
FROM base AS build

ENV NODE_ENV development

RUN yarn --frozen-lockfile --ignore-scripts

COPY . .

RUN yarn build

#
# 🚀 Production Server -----------------------------------------------------------
#
FROM node:18-alpine AS prod

ENV NODE_ENV production

WORKDIR /app

## Copy required file to run the production application
COPY --from=base --chown=node:node /app/node_modules ./node_modules
COPY --from=base --chown=node:node /app/*.json ./
COPY --from=build --chown=node:node /app/dist ./dist/

## https://engineeringblog.yelp.com/2016/01/dumb-init-an-init-for-docker.html
RUN apk add --no-cache dumb-init

# Create an entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

## Dropping privileges
USER node

ENTRYPOINT ["/app/entrypoint.sh"]