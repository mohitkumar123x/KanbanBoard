# Stage 1: Build Stage
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Stage 2: Runtime Stage
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app /app

# Create a non-root user and switch to it
RUN useradd -m myuser && \
    chown myuser:myuser /app
USER myuser

# Set environment variables (overridden by Render)
ENV NODE_ENV=production \
    PORT=5000

# Expose port (Render assigns dynamically, but this is for clarity)
EXPOSE ${PORT}

# Health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

# Run the application
CMD ["node", "server.js"]