// The telemetry_proxy program receives telemetry from the rocket umbilical from the fill station over gRPC and serves it to web clients via WebSocket.
package main

import (
	"context"
	"io"
	"log"
	"os"
	"time"

	"github.com/cornellrocketryteam/Ground-Software/go-proxies/pkg/types"

	pb "github.com/cornellrocketryteam/Ground-Software/go-proxies/proto-out"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize datastore
	var datastore types.Datastore
	datastore.Init(ctx)

	// Set up a connection to the grpc server
	address := os.Getenv("FILL_HOSTNAME") + ":50051"
	conn, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	grpcClient := pb.NewRocketTelemeterClient(conn)

	// Start gRPC stream in a separate Goroutine
	// go receiveTelemetry(ctx, grpcClient)
	go func(ctx context.Context, grpcClient pb.RocketTelemeterClient) {
		for {

			stream, err := grpcClient.StreamTelemetry(ctx, &pb.RocketTelemetryRequest{})
			if err != nil {
				log.Printf("could not receive stream: %v, retrying in 5 seconds...", err)
				time.Sleep(5 * time.Second)
				continue // Retry the connection
			}

			for {
				packet, err := stream.Recv()
				if err == io.EOF || err != nil {
					log.Printf("Received %v, retrying connection...\n", err)
					break // Break out of the inner loop to retry the connection
				}

				// Store packet
				datastore.RocketTelemetryStore(packet)
			}
		}
	}(ctx, grpcClient)

	select {}
}
