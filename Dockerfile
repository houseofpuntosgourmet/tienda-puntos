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

# Expose port
EXPOSE 3001

# Start with optional migration (if DATABASE_URL is set)
CMD ["sh", "-c", "[ -z \"$DATABASE_URL\" ] || npx prisma migrate deploy; node dist/index.js"]
