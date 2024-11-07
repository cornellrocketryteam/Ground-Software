#!/bin/bash

# Run from telemetry-proxy directory

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
export PATH="$PATH:$(go env GOPATH)/bin"
protoc --go_out=./proto-out --go_opt=paths=source_relative --go-grpc_out=./proto-out --go-grpc_opt=paths=source_relative -I../protos ../protos/command.proto --experimental_allow_proto3_optional
pushd fill-telem-proxy
go build main.go
popd && pushd websocket-proxy
go build main.go
popd
pushd ..
docker build -t ghcr.io/cornellrocketryteam/fill-telem-proxy:latest -f go-proxies/fill-telem-proxy/Dockerfile . &
docker build -t ghcr.io/cornellrocketryteam/websocket-proxy:latest -f go-proxies/websocket-proxy/Dockerfile .
popd
