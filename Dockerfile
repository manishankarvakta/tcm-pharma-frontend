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
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

# Stage 2: Serve the application using Node.js 'serve'
FROM node:18-alpine

WORKDIR /app

# Install the 'serve' package locally or globally to serve the build
RUN npm install -g serve

# Copy the build output from the first stage
COPY --from=build /app/build ./build

EXPOSE 3005

# Serve the static files on port 3005 with SPA routing (-s)
CMD ["serve", "-s", "build", "-l", "3005"]
