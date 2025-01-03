// The telemetry_proxy program receives telemetry from the fill station over gRPC and serves it to web clients via WebSocket.
package types

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"slices"
	"time"

	pb "github.com/cornellrocketryteam/Ground-Software/go-proxies/proto-out"
	influxdb2 "github.com/influxdata/influxdb-client-go/v2"
	"github.com/influxdata/influxdb-client-go/v2/api"
	"github.com/influxdata/influxdb-client-go/v2/api/write"
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
func (d *Datastore) Store(packet *pb.FillStationTelemetry) {
	// Create tags map
	tags := map[string]string{}

	// Create fields map
	fields := map[string]interface{}{
		"pt1":       packet.Pt1,
		"pt2":       packet.Pt2,
		"lc1":       packet.Lc1,
		"sv1_cont":  packet.Sv1Cont,
		"ign1_cont": packet.Ign1Cont,
		"ign2_cont": packet.Ign2Cont,
	}

	point := write.NewPoint("telemetry", tags, fields, time.Unix(int64(packet.Timestamp), 0))
	writeCtx, writeCancel := context.WithTimeout(d.ctx, time.Second)
	defer writeCancel()
	if err := d.writeAPI.WritePoint(writeCtx, point); err != nil {
		log.Println(err)
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

func (d *Datastore) GetLastPoint() ([]byte, error) {
	query := `from(bucket: "telemetry")
		|> range(start: -2s, stop: 0s)
		|> filter(fn: (r) => r["_measurement"] == "telemetry")
		|> filter(fn: (r) => r["_field"] == "ign1_cont" or r["_field"] == "ign2_cont" or r["_field"] == "lc1" or r["_field"] == "pt1" or r["_field"] == "pt2" or r["_field"] == "pt3" or r["_field"] == "pt4" or r["_field"] == "rtd_temp" or r["_field"] == "sv1_cont")
		|> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
		|> drop(columns: ["table", "_measurement", "_start", "_stop", "_time"])
		|> yield(name: "mean")`

	results, err := d.queryAPI.Query(d.ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}

	if results == nil {
		return []byte("[]"), nil // Return an empty JSON array if no data
	}

	var jsonData []byte

	//Use a map to accumulate all fields for a single data point
	data := make(map[string]interface{})

	for results.Next() {
		record := results.Record()
		if record == nil {
			continue
		}
		fieldName := record.Field()
		fieldValue := record.Value()

		data[fieldName] = fieldValue
	}

	if err := results.Err(); err != nil {
		return nil, fmt.Errorf("iteration error: %w", err)
	}

	jsonData, err = json.MarshalIndent(data, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("JSON marshaling error: %w", err)
	}

	return jsonData, nil
}
