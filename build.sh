#!/bin/bash
# Custom build script to avoid Smithery CLI issues

echo "Building Sports MCP Server..."

# Install dependencies
npm ci

# Build TypeScript
npm run build

# Create the output directory that Smithery expects
mkdir -p .smithery

# Copy the built files to the expected location
cp dist/index.js .smithery/index.cjs

echo "Build completed successfully!"
