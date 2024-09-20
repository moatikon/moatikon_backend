# 내가 사용하는 node version
FROM node:22.9-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Nest.js application
RUN npm run build

# Expose the port that the Nest.js app runs on (default is 3000)
EXPOSE 3000

# Start the Nest.js application
CMD ["npm", "run", "start:prod"]