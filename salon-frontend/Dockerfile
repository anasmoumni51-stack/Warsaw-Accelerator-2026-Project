FROM node:20-alpine

WORKDIR /app

# Build arg for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies and build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve the app
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
