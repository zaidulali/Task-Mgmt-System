# Stage 1: Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json /app/

# Install dependencies (npm ci is faster and guarantees matching lock file versions)
RUN npm ci

# Copy application source code
COPY . /app/

# Build static assets
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build


# Stage 2: Serve stage
FROM nginx:stable-alpine

# Copy built assets from Stage 1 into the Nginx HTML root folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx server configurations to support single-page application routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx in foreground to prevent container from exiting immediately
CMD ["nginx", "-g", "daemon off;"]
