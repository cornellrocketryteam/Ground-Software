# Stage 1: Build the React app
FROM node AS build

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install --frozen-lockfile

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration file that instruct Nginx how to serve our files (once we add one)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world so the website can be viewed from a browser without specifying a port
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]