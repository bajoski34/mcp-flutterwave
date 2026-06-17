FROM node:20.20.0-alpine3.22 AS builder

WORKDIR /app

ENV DOCKER=true

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code AND bin directory
COPY tsconfig.json ./
COPY bin/ ./bin/
COPY src/ ./src/

# Build the application
RUN npm run build

# Start a new stage for a smaller production image
FROM node:20.20.0-alpine3.22

WORKDIR /app

# Set environment variables
ARG FLW_SECRET_KEY
ARG FLW_ENCRYPTION_KEY

ENV DOCKER=true
ENV NODE_ENV=production
ENV FLW_SECRET_KEY=${FLW_SECRET_KEY}
ENV FLW_ENCRYPTION_KEY=${FLW_ENCRYPTION_KEY}

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/build ./build

# Run the application
CMD ["node", "build/index.js", "--tools=all"] 
