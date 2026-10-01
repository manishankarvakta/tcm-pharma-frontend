# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
# Note: REACT_APP_API_URL should be passed as a build argument
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true
ENV TSC_COMPILE_ON_ERROR=true
ENV CI=false
ENV INLINE_RUNTIME_CHUNK=false
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm run build

# Stage 2: Serve the application using ultra-lightweight Nginx (~10-15MB RAM)
FROM nginx:alpine

# Copy custom Nginx configuration with SPA routing and Gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the first stage
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3005

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
