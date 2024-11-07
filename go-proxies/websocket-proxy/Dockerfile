FROM golang AS build

# Set destination for COPY
WORKDIR /app

# Install protobuf compiler
RUN apt-get update && apt-get install -y protobuf-compiler
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Download Go modules
COPY go-proxies/go.mod go-proxies/go.sum ./
RUN go mod download

# Build the protobufs
COPY protos /protos
RUN mkdir proto-out
RUN protoc --go_out=./proto-out --go_opt=paths=source_relative --go-grpc_out=./proto-out --go-grpc_opt=paths=source_relative -I../protos ../protos/command.proto

# Copy the source code
ADD go-proxies ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build websocket-proxy/main.go

# Use a minimal base image
FROM ubuntu:22.04

# Copy the binary
COPY --from=build /app/main /bin/main

# Expose port
EXPOSE 8080

# Run
CMD ["/bin/main"]