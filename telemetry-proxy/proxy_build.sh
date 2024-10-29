#!/bin/bash

# Run from telemetry-proxy directory

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
export PATH="$PATH:$(go env GOPATH)/bin"
protoc --go_out=./proto-out --go_opt=paths=source_relative --go-grpc_out=./proto-out --go-grpc_opt=paths=source_relative -I../protos ../protos/command.proto --experimental_allow_proto3_optional
go build telemetry_proxy.go
pushd ..
docker build -t ghcr.io/cornellrocketryteam/telemetry-proxy:latest -f telemetry-proxy/Dockerfile .
popd
