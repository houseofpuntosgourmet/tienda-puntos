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

# Start
CMD ["node", "dist/index.js"]
