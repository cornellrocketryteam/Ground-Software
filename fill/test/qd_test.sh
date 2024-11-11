#!/bin/bash

# Check if grpcurl is already installed
if ! command -v grpcurl &> /dev/null; then
  echo "Installing grpcurl..."
  wget https://github.com/fullstorydev/grpcurl/releases/download/v1.9.1/grpcurl_1.9.1_linux_amd64.deb
  sudo apt install ./grpcurl_1.9.1_linux_amd64.deb
  rm ./grpcurl_1.9.1_linux_amd64.deb # Clean up the downloaded deb file
  echo "grpcurl installed."
fi

# Capture output and check against expected value
# Run fill_station in the background and capture its PID
stdbuf -oL ./bazel-bin/fill/fill_station > fill_station_output.txt 2>&1 &
fill_station_pid=$!

# Wait for fill_station to start listening
while [[ ! $(grep "Server listening on" fill_station_output.txt) ]]; do
  sleep 0.1 # Check every 0.1 seconds
  if [[ $(ps -p $fill_station_pid) == "" ]]; then
      echo "fill_station died unexpectedly"
      exit 1
  fi
done

# Send grpcurl command
grpcurl -plaintext -d '{"qd_retract": true}' localhost:50051 command.Commander/SendCommand

# Kill fill_station after a timeout (adjust timeout as needed)
sleep 70
pkill -9 -f fill_station

actual_output=$(cat fill_station_output.txt)
expected_output=$(cat ./fill/test/qd_test_expected_output.txt)
if [[ "$actual_output" != "$expected_output" ]]; then
    echo "Output mismatch:"
    echo "Expected:"
    echo "$expected_output"
    echo "Actual:"
    echo "$actual_output"
    exit 1
fi