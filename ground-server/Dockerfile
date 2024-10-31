FROM node

# Set destination for COPY
WORKDIR /ground-server

# Install protobuf compiler
RUN apt-get update && apt-get install -y protobuf-compiler

# Disable Next telemetry
RUN npx next telemetry disable

# Copy the application code
COPY ./ground-server/package.json .
COPY ./ground-server/package-lock.json .

# Install dependencies
RUN npm ci

# Generate a NextAuth encryption secret
RUN npx auth secret

# Set environment variables 
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=80

# Build the protobufs
COPY protos /protos
RUN mkdir src && mkdir src/proto-out
RUN protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=src/proto-out --ts_proto_opt=outputClientImpl=grpc-js,esModuleInterop=true,outputServices=grpc-js,paths=source_relative -I../protos ../protos/command.proto

# Build the React app for production
COPY ./ground-server .
RUN npm run build

# Expose port 80 to the outside world so the website can be viewed from a browser without specifying a port
EXPOSE 80

# Start the production server
CMD ["npm", "run", "start"]
