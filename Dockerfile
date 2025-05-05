# Start from Ubuntu 20.04
FROM ubuntu:20.04

# Avoid interactive prompts during package installs
ENV DEBIAN_FRONTEND=noninteractive

# Update and install basic tools
RUN apt-get update && apt-get install -y \
    bash git curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# Use a small, stable base for Node apps
FROM node:18-bullseye-slim

# Create app directory and set working dir
WORKDIR /workspace

# Copy package manifests first (for layer caching)
COPY package*.json ./

# Install production dependencies (use npm ci for reproducible installs)
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the port your app listens on
EXPOSE 8080

# Use a non-root user for better security (optional but recommended)
RUN useradd --user-group --create-home --shell /bin/bash appuser \
 && chown -R appuser:appuser /workspace
USER appuser

# Default command to start the app
CMD ["node", "index.js"]
