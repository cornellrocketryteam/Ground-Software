// The telemetry_proxy program receives telemetry from the fill station over gRPC and serves it to web clients via WebSocket.
package main

import (
	"context"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	pb "github.com/cornellrocketryteam/Ground-Software/telemetry-proxy/proto-out"
	"github.com/gorilla/websocket"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/encoding/protojson"
)

// connections stores active WebSocket connections.
var connectionsMutex sync.RWMutex
var connections = make(map[*websocket.Conn]bool)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Set up a connection to the influxdb instance.
	token := os.Getenv("INFLUXDB_TOKEN")
	influxUrl := "http://" + os.Getenv("INFLUXDB_HOSTNAME") + ":8086"
	influxClient := influxdb2.NewClient(influxUrl, token)

	org := "crt"
	bucket := "telemetry"
	writeAPI := influxClient.WriteAPIBlocking(org, bucket)

	// Set up a connection to the grpc server
	address := os.Getenv("FILL_HOSTNAME") + ":50051"
	conn, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	grpcClient := pb.NewTelemeterClient(conn)

	// telemetryChannel passes Protobuf telemetry messages to the WebSocket handler.
	var telemetryChannel = make(chan *pb.Telemetry)

	// Start gRPC stream in a separate Goroutine
	// go receiveTelemetry(ctx, grpcClient)
	go func(ctx context.Context, grpcClient pb.TelemeterClient) {
		for {

			stream, err := grpcClient.StreamTelemetry(ctx, &pb.TelemetryRequest{})
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

				// Send packet over websocket
				telemetryChannel <- packet
			}
		}
	}(ctx, grpcClient)

	// Start the broadcaster Goroutine
	go func() {
		for {
			select {
			case packet := <-telemetryChannel:
				HandlePacket(ctx, packet, writeAPI)
			case <-ctx.Done():
				log.Println("Broadcaster stopping...")
				return
			}
		}
	}()

	websocketHandlerWrapper := func(w http.ResponseWriter, r *http.Request) {
		websocketHandler(ctx, w, r) // Pass rootCtx to the actual handler
	}

	// Start the WebSocket Server
	http.HandleFunc("/ws", websocketHandlerWrapper)
	// Listen on port 8080 for WebSocket connections
	if err = http.ListenAndServe(":8080", nil); err != nil {
		log.Println("Error starting WebSocket server:", err)
	}
}

// HandlePacket parses and processes a telemetry packet
// then stores it to InfluxDB and sends it to all active websocket connections.
func HandlePacket(ctx context.Context, packet *pb.Telemetry, writeAPI api.WriteAPIBlocking) {
	log.Printf("Received packet with temp: %.2f\n", packet.Temp)

	// Write to InfluxDB
	tags := map[string]string{}
	fields := map[string]interface{}{
		"temp": packet.Temp,
	}
	point := write.NewPoint("temperature", tags, fields, time.Now())
	writeCtx, writeCancel := context.WithTimeout(ctx, time.Second)
	defer writeCancel()
	if err := writeAPI.WritePoint(writeCtx, point); err != nil {
		log.Fatal(err)
	}

	marshaler := protojson.MarshalOptions{
		EmitUnpopulated: true, // Include fields with zero values
	}

	// Marshal the Protobuf message to JSON using the custom marshaler
	jsonData, err := marshaler.Marshal(packet)
	if err != nil {
		log.Println("Error marshaling Protobuf to JSON:", err)
		return
	}

	// Iterate through all active connections and send the data
	connectionsMutex.RLock()
	defer connectionsMutex.RUnlock()
	for c := range connections {
		connectionsMutex.RUnlock()
		if err := c.WriteMessage(websocket.TextMessage, jsonData); err != nil {
			log.Println("Error writing JSON message:", err)
			// Remove the connection from the map if there's an error
			connectionsMutex.Lock()
			delete(connections, c)
			connectionsMutex.Unlock()
			// Close the connection
			c.Close()
		}
		connectionsMutex.RLock()
	}
}

func websocketHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	// upgrader is used to upgrade an http connection to a websocket connection.
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for now (we might want to restrict this in production).
		},
	}

	// Upgrade the HTTP connection to a WebSocket connection.
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}

	// Add the new connection to the map
	connectionsMutex.Lock()
	connections[conn] = true
	connectionsMutex.Unlock()

	conn.SetCloseHandler(func(code int, text string) error {
		connectionsMutex.Lock()
		defer connectionsMutex.Unlock()
		delete(connections, conn)
		return nil
	})

	// Handle WebSocket messages in a separate goroutine with context
	go func(ctx context.Context, conn *websocket.Conn) {
		defer conn.Close()
		for {
			select {
			case <-ctx.Done(): // Handle context cancellation (server shutdown)
				conn.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "Server shutting down"), time.Now().Add(5*time.Second))
				return // Exit the goroutine

			default:
				messageType, p, err := conn.ReadMessage()
				if err != nil {
					log.Println("Error reading message:", err)
					return
				}
				log.Printf("Received message: %s\n", p)

				// Process Message
				if err := conn.WriteMessage(messageType, []byte("Message received!")); err != nil {
					log.Println("Error writing message:", err)
				}
			}
		}
	}(ctx, conn)
}
