FROM node

WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Build the React app for production
RUN npm run build
ENV NODE_ENV=production

# Expose port 80 to the outside world so the website can be viewed from a browser without specifying a port
EXPOSE 80
ENV PORT=80

# Start the production server
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "start"]