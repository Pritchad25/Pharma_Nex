# Start from Ubuntu 20.04
FROM ubuntu:20.04

# Avoid interactive prompts during package installs
ENV DEBIAN_FRONTEND=noninteractive

# Update and install basic tools
RUN apt-get update && apt-get install -y \
    bash git curl build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS version, e.g. 18.x)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Set working directory inside container
WORKDIR /workspace

