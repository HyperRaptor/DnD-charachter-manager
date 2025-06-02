FROM node:18-slim

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies inside the image
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 3000

# Use the --host flag to bind to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 