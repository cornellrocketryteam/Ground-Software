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

type WebClients struct {
	ctx      context.Context
	upgrader *websocket.Upgrader
	mu       sync.Mutex
	clients  map[*websocket.Conn]bool
}

var webClients WebClients

// Start will initialize the struct and listen for connections.
func (w *WebClients) Start(ctx context.Context) error {
	w.ctx = ctx
	w.upgrader = &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for now (we might want to restrict this in production).
		},
	}
	w.clients = map[*websocket.Conn]bool{}

	// Start the WebSocket Server on port 8080.
	http.HandleFunc("/ws", func(rw http.ResponseWriter, r *http.Request) {
		w.Handle(rw, r)
	})
	err := http.ListenAndServe(":8080", nil)
	return err
}

// Send writes data over all WebSocket connections in w.clients.
func (w *WebClients) Send(data []byte) {
	// Iterate through all active connections and send the data
	w.mu.Lock()
	defer w.mu.Unlock()
	for c := range w.clients {
		if err := c.WriteMessage(websocket.TextMessage, data); err != nil {
			log.Println("Error writing message to WebSocket client:", err)
			// Remove the connection from the map if there's an error
			delete(w.clients, c)
			// Close the connection
			c.Close()
		}
	}
}

// Handle upgrades the connection, adds a client to the list, and starts serving it.
func (w *WebClients) Handle(rw http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket connection.
	conn, err := w.upgrader.Upgrade(rw, r, nil)
	if err != nil {
		log.Println("Error upgrading connection:", err)
		return
	}

	// Add the new connection to the map
	w.mu.Lock()
	w.clients[conn] = true
	w.mu.Unlock()

	conn.SetCloseHandler(func(code int, text string) error {
		w.mu.Lock()
		defer w.mu.Unlock()
		delete(w.clients, conn)
		return nil
	})

	go w.Serve(conn)
}

// Serve gets called within a goroutine from Handle.
func (w *WebClients) Serve(conn *websocket.Conn) {
	for {
		select {
		case <-w.ctx.Done(): // Handle context cancellation (server shutdown)
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
			w.mu.Lock()
			if err := conn.WriteMessage(messageType, []byte("Message received!")); err != nil {
				log.Println("Error writing message:", err)
			}
			w.mu.Unlock()
		}
	}
}

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
				HandlePacket(ctx, packet, writeAPI, &webClients)
			case <-ctx.Done():
				log.Println("Broadcaster stopping...")
				return
			}
		}
	}()

	webClients.Start(ctx)

	select {}
}

// HandlePacket parses and processes a telemetry packet
// then stores it to InfluxDB and sends it to all active websocket connections.
func HandlePacket(ctx context.Context, packet *pb.Telemetry, writeAPI api.WriteAPIBlocking, w *WebClients) {
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

	w.Send(jsonData)
}
