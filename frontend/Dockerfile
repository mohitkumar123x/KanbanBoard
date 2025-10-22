# ---- Stage 1: Build ----
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install ALL dependencies (not just prod — build needs dev deps)
RUN npm ci

# Copy rest of the project files
COPY . .

# Build the production bundle
RUN npm run build

# ---- Stage 2: Serve ----
FROM node:18-alpine

WORKDIR /app

# Install 'serve' to serve the static files
RUN npm install -g serve

# Copy build output from previous stage
COPY --from=build /app/build ./build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose Render's expected port
EXPOSE 3000

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Run serve on all interfaces
CMD ["sh", "-c", "serve -s build -l 0.0.0.0:$PORT"]
