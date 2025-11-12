# Railway Dockerfile for Hono Backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy all source files
COPY . .

# Install all dependencies (including dev dependencies for build) with legacy peer deps
RUN npm ci --legacy-peer-deps

# Build the backend
RUN npm run backend:build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/railway.js"]