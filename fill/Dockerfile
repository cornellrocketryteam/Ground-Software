# Stage 1: Build
FROM golang AS build

# Install Bazelisk
RUN go install github.com/bazelbuild/bazelisk@latest

# Set the working directory
WORKDIR /app

# Copy the source code
COPY . .

# Build the project using Bazelisk (via Bazel)
RUN --mount=type=cache,target=~/.cache/bazel bazelisk build fill:all

# Stage 2: Create lightweight runtime image
FROM ubuntu

# Set the working directory
WORKDIR /app

# Install WiringPi
RUN apt-get install git
RUN git clone https://github.com/WiringPi/WiringPi.git
RUN cd WiringPi && ./build && cd ..

# Copy the build output from the GitHub Workflow to Alpine
COPY --from=build /app/bazel-bin/fill/fill_station ./fill_station

# Expose the gRPC Server Port
EXPOSE 50051

# Run the binary
CMD [ "/app/fill_station" ]
