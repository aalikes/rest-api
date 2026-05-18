# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ---- Run stage ----
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tini

# Copy production node_modules and source
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Create data directory with proper permissions
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
