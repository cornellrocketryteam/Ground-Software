// The telemetry_proxy program receives telemetry from the fill station over gRPC and serves it to web clients via WebSocket.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"slices"
	"strconv"
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

type HistoricalDataRequest struct {
	Start       int    `json:"start"` // Minutes ago
	Stop        int    `json:"stop"`  // Minutes ago
	Field       string `json:"field"`
	Aggregation string `json:"aggregation"` //e.g., "mean", "max", etc.
	Every       int    `json:"every"`       // Seconds for aggregateWindow
}

type DataPoint struct {
	Timestamp time.Time `json:"timestamp"`
	Value     float64   `json:"value"`
}

type HistoricalDataResponse struct {
	Field      string      `json:"field"`
	Data       []DataPoint `json:"data"`
	Historical bool        `json:"historical"`
	Error      string      `json:"error"`
}

type Datastore struct {
	ctx          context.Context
	token        string
	influxUrl    string
	influxClient influxdb2.Client
	org          string
	bucket       string
	writeAPI     api.WriteAPIBlocking
	queryAPI     api.QueryAPI
}

var datastore Datastore
var legalFields = []string{
	"rocket_time", "altitude", "temp", "voltage", "current", "pt3", "blims_state",
	"latitude", "longitude", "num_satellites",
	"accel_x", "accel_y", "accel_z",
	"gyro_x", "gyro_y", "gyro_z", "imu_accel_x", "imu_accel_y", "imu_accel_z",
	"ori_x", "ori_y", "ori_z", "grav_x", "grav_y", "grav_z",
	"pt1", "pt2", "lc1", "sv1_cont", "ign1_cont", "ign2_cont",
	"key_armed", "altitude_armed", "altimeter_init_failed", "altimeter_reading_failed",
	"altimeter_was_turned_off", "gps_init_failed", "gps_reading_failed", "gps_was_turned_off",
	"imu_init_failed", "imu_reading_failed", "imu_was_turned_off", "accelerometer_init_failed",
	"accelerometer_reading_failed", "accelerometer_was_turned_off", "thermometer_init_failed",
	"thermometer_reading_failed", "thermometer_was_turned_off", "sd_init_failed", "sd_write_failed",
	"rfm_init_failed", "rfm_transmit_failed",
}
var legalAggregation = []string{"mean", "median", "mode"}

// Init initializes the struct with default values
func (d *Datastore) Init(ctx context.Context) {
	// Set up a connection to the influxdb instance.
	d.ctx = ctx
	d.token = os.Getenv("INFLUXDB_TOKEN")
	d.influxUrl = "http://" + os.Getenv("INFLUXDB_HOSTNAME") + ":8086"
	d.influxClient = influxdb2.NewClient(d.influxUrl, d.token)

	d.org = "crt"
	d.bucket = "telemetry"
	d.writeAPI = d.influxClient.WriteAPIBlocking(d.org, d.bucket)
	d.queryAPI = d.influxClient.QueryAPI(d.org)
}

// Store parses a packet and writes it to InfluxDB
func (d *Datastore) Store(packet *pb.Telemetry) {
	// Convert Protobuf enums to strings for InfluxDB tags
	flightModeStr := pb.FlightMode_name[int32(packet.RockTelem.Metadata.FlightMode)]
	thermStatusStr := pb.SensorStatus_name[int32(packet.RockTelem.Metadata.ThermStatus)]
	accStatusStr := pb.SensorStatus_name[int32(packet.RockTelem.Metadata.AccStatus)]
	imuStatusStr := pb.SensorStatus_name[int32(packet.RockTelem.Metadata.ImuStatus)]
	gpsStatusStr := pb.SensorStatus_name[int32(packet.RockTelem.Metadata.GpsStatus)]
	altStatusStr := pb.SensorStatus_name[int32(packet.RockTelem.Metadata.AltStatus)]
	framStatusStr := pb.SensorStatus_name[int32(packet.RockTelem.Metadata.FramStatus)]

	// Create tags map
	tags := map[string]string{
		"flight_mode":  flightModeStr,
		"alt_armed":    strconv.FormatBool(packet.RockTelem.Metadata.AltArmed),
		"gps_valid":    strconv.FormatBool(packet.RockTelem.Metadata.GpsValid),
		"sd_init":      strconv.FormatBool(packet.RockTelem.Metadata.SdInit),
		"therm_status": thermStatusStr,
		"acc_status":   accStatusStr,
		"imu_status":   imuStatusStr,
		"gps_status":   gpsStatusStr,
		"alt_status":   altStatusStr,
		"fram_status":  framStatusStr,
	}

	// Create fields map
	fields := map[string]interface{}{
		"rocket_time": packet.RockTelem.Timestamp,
		"altitude":    packet.RockTelem.Altitude,
		"temp":        packet.RockTelem.Temp,
		"voltage":     packet.RockTelem.Voltage,
		"current":     packet.RockTelem.Current,
		"pt3":         packet.RockTelem.Pt3,
		"blims_state": packet.RockTelem.BlimsState,

		"latitude":       packet.RockTelem.GpsTelem.Latitude,
		"longitude":      packet.RockTelem.GpsTelem.Longitude,
		"num_satellites": packet.RockTelem.GpsTelem.NumSatellites,

		"accel_x": packet.RockTelem.AccelTelem.AccelX,
		"accel_y": packet.RockTelem.AccelTelem.AccelY,
		"accel_z": packet.RockTelem.AccelTelem.AccelZ,

		"gyro_x":      packet.RockTelem.ImuTelem.GyroX,
		"gyro_y":      packet.RockTelem.ImuTelem.GyroY,
		"gyro_z":      packet.RockTelem.ImuTelem.GyroZ,
		"imu_accel_x": packet.RockTelem.ImuTelem.AccelX,
		"imu_accel_y": packet.RockTelem.ImuTelem.AccelY,
		"imu_accel_z": packet.RockTelem.ImuTelem.AccelZ,
		"ori_x":       packet.RockTelem.ImuTelem.OriX,
		"ori_y":       packet.RockTelem.ImuTelem.OriY,
		"ori_z":       packet.RockTelem.ImuTelem.OriZ,
		"grav_x":      packet.RockTelem.ImuTelem.GravX,
		"grav_y":      packet.RockTelem.ImuTelem.GravY,
		"grav_z":      packet.RockTelem.ImuTelem.GravZ,

		"pt1":       packet.Pt1,
		"pt2":       packet.Pt2,
		"lc1":       packet.Lc1,
		"sv1_cont":  packet.Sv1Cont,
		"ign1_cont": packet.Ign1Cont,
		"ign2_cont": packet.Ign2Cont,

		"key_armed":                    packet.RockTelem.Events.KeyArmed,
		"altitude_armed":               packet.RockTelem.Events.AltitudeArmed,
		"altimeter_init_failed":        packet.RockTelem.Events.AltimeterInitFailed,
		"altimeter_reading_failed":     packet.RockTelem.Events.AltimeterReadingFailed,
		"altimeter_was_turned_off":     packet.RockTelem.Events.AltimeterWasTurnedOff,
		"gps_init_failed":              packet.RockTelem.Events.GpsInitFailed,
		"gps_reading_failed":           packet.RockTelem.Events.GpsReadingFailed,
		"gps_was_turned_off":           packet.RockTelem.Events.GpsWasTurnedOff,
		"imu_init_failed":              packet.RockTelem.Events.ImuInitFailed,
		"imu_reading_failed":           packet.RockTelem.Events.ImuReadingFailed,
		"imu_was_turned_off":           packet.RockTelem.Events.ImuWasTurnedOff,
		"accelerometer_init_failed":    packet.RockTelem.Events.AccelerometerInitFailed,
		"accelerometer_reading_failed": packet.RockTelem.Events.AccelerometerReadingFailed,
		"accelerometer_was_turned_off": packet.RockTelem.Events.AccelerometerWasTurnedOff,
		"thermometer_init_failed":      packet.RockTelem.Events.ThermometerInitFailed,
		"thermometer_reading_failed":   packet.RockTelem.Events.ThermometerReadingFailed,
		"thermometer_was_turned_off":   packet.RockTelem.Events.ThermometerWasTurnedOff,
		"sd_init_failed":               packet.RockTelem.Events.SdInitFailed,
		"sd_write_failed":              packet.RockTelem.Events.SdWriteFailed,
		"rfm_init_failed":              packet.RockTelem.Events.RfmInitFailed,
		"rfm_transmit_failed":          packet.RockTelem.Events.RfmTransmitFailed,
	}

	point := write.NewPoint("telemetry", tags, fields, time.Unix(int64(packet.Timestamp), 0))
	writeCtx, writeCancel := context.WithTimeout(d.ctx, time.Second)
	defer writeCancel()
	if err := d.writeAPI.WritePoint(writeCtx, point); err != nil {
		log.Fatal(err)
	}
}

// Query parses and executes a json request for historical data
func (d *Datastore) Query(req HistoricalDataRequest) HistoricalDataResponse {
	// Validate input (important to prevent injection attacks!)
	if req.Field == "" || !slices.Contains(legalFields, req.Field) {
		response := HistoricalDataResponse{Error: "Field does not exist"}
		return response
	}

	if req.Aggregation == "" || !slices.Contains(legalAggregation, req.Aggregation) {
		req.Aggregation = "mean" // Default to mean if not provided
	}

	if req.Every == 0 {
		// Default to 100 data points
		numDatapoints := 100.0
		if width := int((float64(req.Stop-req.Start) / numDatapoints) * 60); width != 0 {
			req.Every = width
		} else {
			req.Every = 1
		}
	}

	// Construct query
	query := fmt.Sprintf(`from(bucket: "telemetry")
	  |> range(start: %dm, stop: %dm)
	  |> filter(fn: (r) => r._field == "%s")
	  |> aggregateWindow(every: %ds, fn: %s, createEmpty: false)
	  |> drop(columns: ["table", "_measurement", "_start", "_stop"])
	  |> yield(name: "mean")`, req.Start, req.Stop, req.Field, req.Every, req.Aggregation)

	// Process historical data request.
	log.Printf("Querying with: %s", query)
	results, err := d.queryAPI.Query(d.ctx, query)
	response := HistoricalDataResponse{Historical: true}
	response.Field = req.Field
	if err != nil {
		response.Error = err.Error()
	} else {
		log.Println("Result of Query: ")
		for results.Next() {
			log.Println(results.Record())
			response.Data = append(response.Data, DataPoint{
				Timestamp: results.Record().Time(),
				Value:     results.Record().Value().(float64),
			})
		}
	}
	return response
}

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
	return http.ListenAndServe(":8080", nil)
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
			var req HistoricalDataRequest
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

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Initialize datastore
	datastore.Init(ctx)

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
				HandlePacket(ctx, packet, &webClients)
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
func HandlePacket(ctx context.Context, packet *pb.Telemetry, w *WebClients) {
	log.Printf("Received packet with temp: %.2f\n", packet.RockTelem.Temp)

	// Write to InfluxDB
	datastore.Store(packet)

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
