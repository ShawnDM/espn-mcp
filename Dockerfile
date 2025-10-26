FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001

# Change ownership of the app directory
RUN chown -R mcp:nodejs /app
USER mcp

# Start the MCP server
CMD ["node", "dist/index.js"]
