# Node.js build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for tsx/typescript)
RUN npm install

# Copy source code
COPY . .

# Final stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY --from=builder /app /app

# Expose the port (matches .env)
EXPOSE 5000

# Start the application using tsx as defined in package.json
CMD ["npm", "start"]
