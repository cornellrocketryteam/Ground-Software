# Base the installation on the node.js image since React is based on Node
FROM node:hydrogen-alpine3.20

# Set the working directory (where all commands will be run) to a docker directory
WORKDIR /ground-server/

# Copy the code that's needed into the working directory
COPY public/ /ground-server/public
COPY src/ /ground-server/src
COPY package.json /ground-server/

# Expose a port to run it on
EXPOSE 3000

# Install dependencies in package.json
RUN npm install

# Define the command that will actually start the container (in our case npm start)
CMD ["npm", "start"]

