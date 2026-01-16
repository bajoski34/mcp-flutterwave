FROM node:20.19.5-alpine3.22 AS builder

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
FROM node:20.19.5-alpine3.22

WORKDIR /app

# Set environment variables
ENV DOCKER=true
ENV NODE_ENV=production
ENV FLW_SECRET_KEY=${FLW_SECRET_KEY}

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/build ./build

# Run the application
CMD ["node", "build/index.js", "--tools=create_checkout,disable_checkout,read_transaction,resend_transaction_webhook"] 
