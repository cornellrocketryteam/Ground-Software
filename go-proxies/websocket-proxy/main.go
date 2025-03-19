// The telemetry_proxy program receives telemetry from the fill station over gRPC and serves it to web clients via WebSocket.
package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/cornellrocketryteam/Ground-Software/go-proxies/pkg/types"
	"github.com/gorilla/websocket"
)

type WebClients struct {
	ctx      context.Context
	upgrader *websocket.Upgrader
	mu       sync.Mutex
	clients  map[*websocket.Conn]bool
}

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
	return http.ListenAndServe(":8080", nil)
}

// Send writes data over all WebSocket connections in w.clients.
func (w *WebClients) Send(data []byte) {
	// Iterate through all active connections and send the data
	w.mu.Lock()
	defer w.mu.Unlock()
	for c := range w.clients {
		log.Println("Writing data to all websocket connections.")
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

// Serve handles WebSocket requests.
func (w *WebClients) Serve(conn *websocket.Conn) {
	for {
		select {
		case <-w.ctx.Done(): // Handle context cancellation (server shutdown)
			conn.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, "Server shutting down"), time.Now().Add(5*time.Second))
			return // Exit the goroutine
		default:
			_, p, err := conn.ReadMessage()
			if err != nil {
				log.Println("Error reading message; closing connection:", err)
				w.mu.Lock()
				conn.Close()
				w.mu.Unlock()
				return
			}

			// Check if the message is a JSON request for historical data.
			var req types.HistoricalDataRequest
			if err := json.Unmarshal(p, &req); err == nil {
				response := datastore.Query(req)
				jsonData, err := json.Marshal(response)
				if err != nil {
					log.Println("Error marshaling response to JSON:", err)
				}
				w.mu.Lock()
				if err := conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
					log.Println("Error writing message:", err)
				}
				w.mu.Unlock()
			}
		}
	}
}

var datastore types.Datastore
var webClients WebClients

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize datastore
	datastore.Init(ctx)

	// Start the broadcaster Goroutine
	go func() {
		ticker := time.NewTicker(100 * time.Millisecond)
		defer ticker.Stop()

		for {
			select {
			case <-ticker.C:
				jsonData, err := datastore.GetLastPoint()
				if err == nil {
					webClients.Send(jsonData)
				}
			case <-ctx.Done():
				log.Println("Function stopping due to context cancellation")
				return
			}
		}
	}()

	webClients.Start(ctx)

	select {}
}
