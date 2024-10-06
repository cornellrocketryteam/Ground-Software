FROM golang AS build

# Set destination for COPY
WORKDIR /app

# Install protobuf compiler
RUN apt-get update && apt-get install -y protobuf-compiler
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Download Go modules
COPY telemetry-proxy/go.mod telemetry-proxy/go.sum ./
RUN go mod download

# Build the protobufs
COPY protos /protos
RUN mkdir proto-out
RUN protoc --go_out=./proto-out --go_opt=paths=source_relative --go-grpc_out=./proto-out --go-grpc_opt=paths=source_relative -I../protos ../protos/command.proto

# Copy the source code
COPY telemetry-proxy/telemetry_proxy.go .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build telemetry_proxy.go

# Use a minimal base image
FROM ubuntu:22.04

# Copy the binary
COPY --from=build /app/telemetry_proxy /bin/telemetry_proxy

# Expose port
EXPOSE 8080

# Run
CMD ["/bin/telemetry_proxy"]