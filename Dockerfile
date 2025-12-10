# BoxTrack - Multi-stage Docker build
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runtime

WORKDIR /app

# Install runtime dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Rebuild better-sqlite3 for this architecture
RUN npm rebuild better-sqlite3

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create data directory for SQLite database
RUN mkdir -p /data && chown -R node:node /data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001
ENV BOXTRACK_DATA_DIR=/data

# Expose port
EXPOSE 5001

# Switch to non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5001/api/health || exit 1

# Start the application
CMD ["node", "dist/index.cjs"]
