// The telemetry_proxy program receives telemetry from the fill station over gRPC and serves it to web clients via WebSocket.
package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"io"
	"log"
	"os"
	"time"

	"github.com/cornellrocketryteam/Ground-Software/go-proxies/pkg/types"
	// "github.com/gogo/protobuf/proto"

	pb "github.com/cornellrocketryteam/Ground-Software/go-proxies/proto-out"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize datastore
	var datastore types.Datastore
	datastore.Init(ctx)

	// Set up certs for the grpc server
	// Load certificates from environment variables
	clientCertB64 := os.Getenv("CLIENT_CERT")
	clientKeyB64 := os.Getenv("CLIENT_KEY")
	caCertB64 := os.Getenv("CA_CERT")

	if clientCertB64 == "" {
		log.Fatal("CLIENT_CERT environment variable not set or empty")
	}
	if clientKeyB64 == "" {
		log.Fatal("CLIENT_KEY environment variable not set or empty")
	}
	if caCertB64 == "" {
		log.Fatal("CA_CERT environment variable not set or empty")
	}
	// log.Printf("CLIENT_CERT: %s\nCLIENT_KEY: %s\nCA_CERT: %s", clientCertPEM, clientKeyPEM, caCertPEM)

	clientCertPEM, _ := base64.StdEncoding.DecodeString(clientCertB64)
	clientKeyPEM, _ := base64.StdEncoding.DecodeString(clientKeyB64)
	caCertPEM, _ := base64.StdEncoding.DecodeString(caCertB64)

	// Decode PEM encoded certificates and keys
	clientCert, _ := pem.Decode([]byte(clientCertPEM))
	clientKey, _ := pem.Decode([]byte(clientKeyPEM))
	caCert, _ := pem.Decode([]byte(caCertPEM))

	// Parse certificates and keys
	clientCertParsed, _ := x509.ParseCertificate(clientCert.Bytes)
	clientKeyParsed, _ := x509.ParsePKCS1PrivateKey(clientKey.Bytes)
	caCertParsed, _ := x509.ParseCertificate(caCert.Bytes)

	// Create TLS credentials
	cert := tls.Certificate{
		Certificate: [][]byte{clientCertParsed.Raw},
		PrivateKey:  clientKeyParsed,
	}

	certPool := x509.NewCertPool()
	certPool.AddCert(caCertParsed)

	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{cert},
		RootCAs:      certPool,
		//InsecureSkipVerify: true, // Only use for testing, not production
	}

	// Create gRPC dial options
	creds := credentials.NewTLS(tlsConfig)
	opts := grpc.WithTransportCredentials(creds)

	// Set up a connection to the grpc server
	address := os.Getenv("FILL_HOSTNAME") + ":50051"
	conn, err := grpc.NewClient(
		address,
		opts,
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
