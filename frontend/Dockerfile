# ---- Stage 1: Build ----
FROM node:18-alpine AS build
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the app
RUN npm run build

# ---- Stage 2: Serve ----
FROM node:18-alpine
WORKDIR /app

# Install serve to host static files
RUN npm install -g serve

# Copy build files
COPY --from=build /app/build ./build

# Create runtime config injection script
RUN echo 'window._env_ = { API_URL: "%%REACT_APP_API_URL%%" };' > ./build/env.js

# Replace placeholder in env.js at container start with actual Render env var
# CMD sh -c "sed -i 's|%%REACT_APP_API_URL%%|'\"$REACT_APP_API_URL\"'|g' build/env.js && serve -s build -l ${PORT:-3000}"
CMD sh -c "echo 'window._env_ = { API_URL: \"${REACT_APP_API_URL}\" };' > ./build/env.js && serve -s build -l ${PORT}"

