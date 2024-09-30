package main

import (
	"context"
	"fmt"
	"io"
	"log"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "github.com/cornellrocketryteam/Ground-Software/telemetry-proxy/proto-out" // Replace with your proto package path
)

const (
	address = "localhost:50051" // Replace with your server address
)

func main() {
	// Set up a connection to the grpc server
	conn, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewTelemeterClient(conn)

	// Contact the server and print out its response.
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	stream, err := c.StreamTelemetry(ctx, &pb.TelemetryRequest{})
	if err != nil {
		log.Fatalf("could not receive stream: %v", err)
	}

	for {
		packet, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("error receiving packet: %v", err)
		}

		// Parse and process the telemetry packet
		fmt.Printf("Received packet with temp: %.2f\n",
			packet.Temp)
	}
}
