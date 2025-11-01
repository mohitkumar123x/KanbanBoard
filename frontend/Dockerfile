# # ---- Stage 1: Build ----
# FROM node:18-alpine AS build
# WORKDIR /app

# # Copy and install dependencies
# COPY package*.json ./
# RUN npm ci

# # Copy all source files
# COPY . .

# # Build the app
# RUN npm run build

# # ---- Stage 2: Serve ----
# FROM node:18-alpine
# WORKDIR /app

# # Install serve to host static files
# RUN npm install -g serve

# # Copy build files
# COPY --from=build /app/build ./build

# # Create runtime config injection script
# RUN echo 'window._env_ = { API_URL: "%%REACT_APP_API_URL%%" };' > ./build/env.js

# # Replace placeholder in env.js at container start with actual Render env var
# # CMD sh -c "sed -i 's|%%REACT_APP_API_URL%%|'\"$REACT_APP_API_URL\"'|g' build/env.js && serve -s build -l ${PORT:-3000}"
# CMD sh -c "echo 'window._env_ = { API_URL: \"${REACT_APP_API_URL}\" };' > ./build/env.js && serve -s build -l ${PORT}"

# ========================================
# STAGE 1: BUILD THE REACT APP
# ========================================
# Use lightweight Node.js 18 Alpine image for building
FROM node:18-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy only package files first (optimizes Docker layer caching)
COPY package*.json ./

# Install dependencies (npm ci = clean install from package-lock.json)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Optional: Build-time fallback for local development
# If REACT_APP_API_URL is not provided, default to localhost
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Build the production-ready static files
# This runs `react-scripts build` or your custom build script
RUN npm run build


# ========================================
# STAGE 2: SERVE THE BUILT APP
# ========================================
# Use a fresh, minimal Node.js image for runtime
FROM node:18-alpine

# Set working directory for the server
WORKDIR /app

# Install 'serve' globally to host static files
# 'serve' is a lightweight static file server
RUN npm install -g serve

# Copy only the built files from the previous stage
# This keeps the final image small and secure
COPY --from=build /app/build ./build

# Create base env.js to avoid runtime errors
# Ensures window._env_ exists even if no variables are injected
RUN echo "window._env_ = window._env_ || {};" > ./build/env.js

# Expose port (optional, but good practice)
# Render will override with $PORT anyway
EXPOSE 3000

# ========================================
# RUNTIME: INJECT ENV VARS + START SERVER
# ========================================
# This command runs when the container starts
CMD sh -c "\
  # Write the API URL from Render environment variable \
  echo \"window._env_.API_URL = \\\"${REACT_APP_API_URL:-http://localhost:5000/api}\\\";\" > ./build/env.js.tmp && \
  \
  # Append the base env.js content (preserves structure) \
  cat ./build/env.js >> ./build/env.js.tmp && \
  \
  # Replace the original env.js with the new one \
  mv ./build/env.js.tmp ./build/env.js && \
  \
  # Start the static server \
  # -s: serve single-page app (SPA) with client-side routing \
  # -l: listen port (uses Render's $PORT or fallback 3000) \
  # --listen 0.0.0.0: forces binding to all interfaces (required by Render) \
  # exec: replaces shell with serve → PID 1 → keeps container alive \
  exec serve -s build --listen tcp://0.0.0.0:\${PORT}"
