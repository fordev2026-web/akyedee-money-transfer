# Railway Dockerfile for Hono Backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (including dev deps for build) with legacy peer deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the backend with explicit TypeScript compilation
RUN npx tsc backend/railway.ts --outDir dist --target ES2022 --module CommonJS --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports --skipLibCheck

# Verify the build output exists
RUN ls -la dist/ && cat dist/railway.js | head -10

# Clean up dev dependencies to reduce image size
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Railway automatically sets the PORT environment variable
# Start the application
CMD ["node", "dist/railway.js"]