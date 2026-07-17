FROM node:24-alpine

WORKDIR /app

# Copy entire repo
COPY . .

# Install backend deps
WORKDIR /app/backend
RUN npm ci --legacy-peer-deps || npm ci

# Build
RUN npm run build

# Generate Prisma
RUN npx prisma generate

# Expose port (matches runtime PORT injected by Railway; Railway may seed the
# public domain Target Port from this EXPOSE value on domain creation)
EXPOSE 8080

# Start with optional migration (if DATABASE_URL is set)
CMD ["sh", "-c", "[ -z \"$DATABASE_URL\" ] || npx prisma migrate deploy; node dist/index.js"]
