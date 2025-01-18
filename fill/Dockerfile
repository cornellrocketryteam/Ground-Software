# Stage 1: Build
FROM golang AS build

# Install Bazelisk
RUN go install github.com/bazelbuild/bazelisk@latest

# Set the working directory
WORKDIR /app

# Copy the source code
COPY . .

# Build the project using Bazelisk (via Bazel)
RUN bazelisk build //fill:all

# Stage 2: Create lightweight runtime image
FROM ubuntu:22.04

# Set the working directory
WORKDIR /app

# Copy the build output from the GitHub Workflow to Alpine
COPY --from=build /app/bazel-bin/fill/fill_station ./fill_station
COPY --from=build /app/bazel-bin/fill/lib/libwiringPi.so /usr/lib/libwiringPi.so
RUN export LD_LIBRARY_PATH=/usr/lib

# Expose the gRPC Server Port
EXPOSE 50051

# Run the binary
CMD [ "/app/fill_station" ]
