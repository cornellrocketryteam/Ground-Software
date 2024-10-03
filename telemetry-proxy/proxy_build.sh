#!/bin/bash

# Run from telemetry-proxy directory

protoc --go_out=./proto-out --go_opt=paths=source_relative --go-grpc_out=./proto-out --go-grpc_opt=paths=source_relative -I../protos ../protos/command.proto
go build telemetry_proxy.go
docker build -t ghcr.io/cornellrocketryteam/telemetry-proxy:latest .
