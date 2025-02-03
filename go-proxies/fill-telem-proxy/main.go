// The telemetry_proxy program receives telemetry from the fill station over gRPC and serves it to web clients via WebSocket.
package main

import (
	"context"
	"io"
	"log"
	"os"
	"time"

	"github.com/cornellrocketryteam/Ground-Software/go-proxies/pkg/types"
	// "github.com/gogo/protobuf/proto"

	pb "github.com/cornellrocketryteam/Ground-Software/go-proxies/proto-out"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize datastore
	var datastore types.Datastore
	datastore.Init(ctx)

	// Set up a connection to the grpc server
	address := os.Getenv("FILL_HOSTNAME") + ":50051"
	conn, err := grpc.NewClient(
		address,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                10 * time.Second, // send pings every 10 seconds if there is no activity
			Timeout:             2 * time.Second,  // wait 2 seconds for ping ack before considering the connection dead
			PermitWithoutStream: true,
		}),
	)
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	grpcClient := pb.NewFillStationTelemeterClient(conn)

	// Start gRPC stream in a separate Goroutine
	// go receiveTelemetry(ctx, grpcClient)
	go func(ctx context.Context, grpcClient pb.FillStationTelemeterClient) {
		for {

			stream, err := grpcClient.StreamTelemetry(ctx, &pb.FillStationTelemetryRequest{})
			if err != nil {
				log.Printf("could not receive stream: %v, retrying in 5 seconds...", err)
				time.Sleep(5 * time.Second)
				continue // Retry the connection
			}

			for {
				packet, err := stream.Recv()
				if err == io.EOF || err != nil {
					log.Printf("ERROR: %v, retrying connection...\n", err)
					break // Break out of the inner loop to retry the connection
				} else {
					// log.Printf("Received Packet: %s", proto.MarshalTextString(packet))
				}

				// Store packet
				datastore.FillStationTelemetryStore(packet)
			}
		}
	}(ctx, grpcClient)

	select {}
}
