
# =====================================
# Stage 1: Production Dependencies
# =====================================
FROM node:26-bookworm-slim AS dependencies

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts \
    && npm rebuild bcrypt \
    && npm cache clean --force


# =====================================
# Stage 2: Production
# =====================================
FROM node:26-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy application source
COPY --chown=node:node . .

# Copy only production dependencies
COPY --from=dependencies --chown=node:node \
    /app/node_modules ./node_modules

# Non-root user
USER node

EXPOSE 5000

CMD ["npm", "start"]
