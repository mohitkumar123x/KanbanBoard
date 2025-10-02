# Stage 1: Build Stage
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Runtime Stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install serve globally for serving the static build
RUN npm install -g serve

# Copy only the build directory from the builder stage
COPY --from=builder /app/build ./build

# Create a non-root user and switch to it
RUN useradd -m myuser && \
    chown myuser:myuser /app
USER myuser

# Set environment variables (overridden by Render)
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE ${PORT}

# Health check for the served app
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

# Serve the build directory
CMD ["serve", "-s", "build", "-l", ${PORT}]