# Railway Dockerfile for Hono Backend
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (including dev deps for build)
RUN npm ci --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the railway.ts file directly (single file, ES modules)
RUN npx tsc backend/railway.ts --outDir dist --target ES2022 --module ES2022 --moduleResolution bundler --esModuleInterop --allowSyntheticDefaultImports --skipLibCheck

# Create a package.json in dist to mark it as ES module
RUN echo '{"type":"module"}' > dist/package.json

# Verify the build
RUN ls -la dist/ && echo "✅ Build complete"

# Clean up dev dependencies to reduce image size
RUN npm prune --production --legacy-peer-deps

# Railway automatically sets the PORT environment variable
# Start the backend application
CMD ["node", "dist/railway.js"]
