FROM node

WORKDIR /ground-server

# Copy the application code
COPY ./ground-server/package.json .
COPY ./ground-server/package-lock.json .

# Install dependencies
RUN npm ci

# Set environment variables 
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=80

# Build the React app for production
COPY ./ground-server .
COPY ./protos /protos
RUN npm run build

# Expose port 80 to the outside world so the website can be viewed from a browser without specifying a port
EXPOSE 80

# Start the production server
CMD ["npm", "run", "start"]
