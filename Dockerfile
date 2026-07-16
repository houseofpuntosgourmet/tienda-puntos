FROM node:24-alpine

WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

# Install backend deps
WORKDIR /app/backend
RUN npm ci

# Build backend
COPY backend/src ./src
COPY backend/tsconfig.json ./
RUN npm run build

# Start
EXPOSE 3001
CMD ["node", "dist/index.js"]
