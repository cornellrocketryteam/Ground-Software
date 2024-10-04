package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "github.com/cornellrocketryteam/Ground-Software/telemetry-proxy/proto-out" // Replace with your proto package path

	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
)

// Define the WebSocket upgrader
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for now (you might want to restrict this in production)
	},
}

func main() {
	// Set up a connection to the influxdb instance.
	token := os.Getenv("INFLUXDB_TOKEN")
	influx_url := "http://" + os.Getenv("INFLUXDB_HOSTNAME") + ":8086"
	influx_client := influxdb2.NewClient(influx_url, token)

	org := "crt"
	bucket := "telemetry"
	writeAPI := influx_client.WriteAPIBlocking(org, bucket)

	// Set up a connection to the grpc server
	address := os.Getenv("FILL_HOSTNAME") + ":50051"
	conn, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	c := pb.NewTelemeterClient(conn)

	// Start gRPC stream in a separate Goroutine
	go receiveTelemetry(c, writeAPI)

	// Start the WebSocket Server
	http.HandleFunc("/ws", websocketHandler)
	log.Fatal(http.ListenAndServe(":8080", nil)) // Listen on port 8080 for WebSocket connections
}

func receiveTelemetry(c pb.TelemeterClient, writeAPI api.WriteAPIBlocking) {
	for {
		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()

		stream, err := c.StreamTelemetry(ctx, &pb.TelemetryRequest{})
		if err != nil {
			log.Printf("could not receive stream: %v, retrying in 5 seconds...", err)
			time.Sleep(5 * time.Second)
			continue // Retry the connection
		}

		for {
			packet, err := stream.Recv()
			if err == io.EOF {
				log.Println("stream ended, retrying connection...")
				break // Break out of the inner loop to retry the connection
			}
			if err != nil {
				log.Printf("error receiving packet: %v, retrying connection...", err)
				break // Break out of the inner loop to retry the connection
			}

			// Parse and process the telemetry packet
			fmt.Printf("Received packet with temp: %.2f\n", packet.Temp)
			// Write to InfluxDB
			tags := map[string]string{}
			fields := map[string]interface{}{
				"temp": packet.Temp,
			}
			point := write.NewPoint("temperature", tags, fields, time.Now())

			if err := writeAPI.WritePoint(context.Background(), point); err != nil {
				log.Fatal(err)
			}
		}
	}
}

func websocketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}
	defer conn.Close()

	// Handle WebSocket messages
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error reading message:", err)
			break
		}
		fmt.Printf("Received message: %s\n", p)

		// You can process the received message here and potentially send a response back to the client
		if err := conn.WriteMessage(messageType, []byte("Message received!")); err != nil {
			log.Println("Error writing message:", err)
			break
		}
	}
}
