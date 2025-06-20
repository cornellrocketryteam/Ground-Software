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
	Measurement string `json:"measurement"`
	Field       string `json:"field"`
	Start       int    `json:"start"`       // Minutes ago
	Stop        int    `json:"stop"`        // Minutes ago
	Aggregation string `json:"aggregation"` //e.g., "mean", "max", etc.
	Every       int    `json:"every"`       // Seconds for aggregateWindow
}

type DataPoint struct {
	Timestamp string      `json:"timestamp"`
	Value     interface{} `json:"value"`
}

type HistoricalDataResponse struct {
	Measurement string      `json:"measurement"`
	Field       string      `json:"field"`
	Data        []DataPoint `json:"data"`
	Historical  bool        `json:"historical"`
	Error       string      `json:"error"`
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

var legalMeasurements = []string{
	"Fill Station", "Ground Radio", "Fill Radio", "Umbilical",
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

var timestampLayout = "2006-01-02T15:04:05.000Z07:00"

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
func (d *Datastore) FillStationTelemetryStore(packet *pb.FillStationTelemetry) {
	// Create tags map
	tags := map[string]string{}

	// Create fields map
	fields := map[string]interface{}{
		"pt1":       packet.Pt1,
		"pt2":       packet.Pt2,
		"lc1":       packet.Lc1,
		"ign1_cont": packet.Ign1Cont,
		"ign2_cont": packet.Ign2Cont,
	}

	point := write.NewPoint("Fill Station", tags, fields, time.Unix(int64(packet.Timestamp), 0))
	log.Printf("Writing fill station telemetry to influxDB: %v", point)
	writeCtx, writeCancel := context.WithTimeout(d.ctx, time.Second)
	defer writeCancel()
	if err := d.writeAPI.WritePoint(writeCtx, point); err != nil {
		log.Println(err)
	}
}

// Stores RocketTelemetry to InfluxDB
func (d *Datastore) RocketTelemetryStore(packet *pb.RocketTelemetry) {
	timestamp := time.Now()
	// Create tags map
	tags := map[string]string{}

	log.Printf("Timestamp: %s\n", timestamp.Format(time.RFC3339Nano))

	// Create fields map
	fields := map[string]interface{}{}

	// Access Umb telemetry data if available
	if packet.UmbTelem != nil {
		umbTelem := packet.UmbTelem
		fields["ms_since_boot"] = umbTelem.MsSinceBoot
		fields["battery_voltage"] = umbTelem.BatteryVoltage
		fields["pt3"] = umbTelem.Pt3
		fields["pt4"] = umbTelem.Pt4
		fields["rtd_temp"] = umbTelem.RtdTemp
		fields["altitude"] = umbTelem.Altitude

		// TODO: Find a better way of flattening (or removing the flattening) so that this does not have to be manually updated

		if umbTelem.Metadata != nil {
			metaData := umbTelem.Metadata
			fields["alt_armed"] = metaData.AltArmed
			fields["alt_valid"] = metaData.AltValid
			fields["gps_valid"] = metaData.GpsValid
			fields["imu_valid"] = metaData.ImuValid
			fields["acc_valid"] = metaData.AccValid
			fields["umbilical_connection_lock"] = metaData.UmbilicalConnectionLock
			fields["adc_valid"] = metaData.AdcValid
			fields["fram_valid"] = metaData.FramValid
			fields["sd_valid"] = metaData.SdValid
			fields["gps_msg_fresh"] = metaData.GpsMsgFresh
			fields["rocket_was_safed"] = metaData.RocketWasSafed
			fields["mav_state"] = metaData.MavState
			fields["sv2_state"] = metaData.Sv2State
			fields["flight_mode"] = metaData.FlightMode
		}

		if umbTelem.Events != nil {
			events := umbTelem.Events
			fields["altitude_armed"] = events.AltitudeArmed
			fields["altimeter_init_failed"] = events.AltimeterInitFailed
			fields["altimeter_reading_failed"] = events.AltimeterReadingFailed
			fields["gps_init_failed"] = events.GpsInitFailed
			fields["gps_reading_failed"] = events.GpsReadingFailed
			fields["imu_init_failed"] = events.ImuInitFailed
			fields["imu_reading_failed"] = events.ImuReadingFailed
			fields["accelerometer_init_failed"] = events.AccelerometerInitFailed
			fields["accelerometer_reading_failed"] = events.AccelerometerReadingFailed
			fields["adc_init_failed"] = events.AdcInitFailed
			fields["adc_reading_failed"] = events.AdcReadingFailed
			fields["fram_init_failed"] = events.FramInitFailed
			fields["fram_read_failed"] = events.FramReadFailed
			fields["fram_write_failed"] = events.FramWriteFailed
			fields["sd_init_failed"] = events.SdInitFailed
			fields["sd_write_failed"] = events.SdWriteFailed
			fields["mav_was_actuated"] = events.MavWasActuated
			fields["sv_was_actuated"] = events.SvWasActuated
			fields["main_deploy_wait_end"] = events.MainDeployWaitEnd
			fields["main_log_shutoff"] = events.MainLogShutoff
			fields["cycle_overflow"] = events.CycleOverflow
			fields["unknown_command_received"] = events.UnknownCommandReceived
			fields["launch_command_received"] = events.LaunchCommandReceived
			fields["mav_command_received"] = events.MavCommandReceived
			fields["sv_command_received"] = events.SvCommandReceived
			fields["safe_command_received"] = events.SafeCommandReceived
			fields["reset_card_command_received"] = events.ResetCardCommandReceived
			fields["reset_fram_command_received"] = events.ResetFramCommandReceived
			fields["state_change_command_received"] = events.StateChangeCommandReceived
			fields["umbilical_disconnected"] = events.UmbilicalDisconnected
		}
	}

	point := write.NewPoint("Umbilical", tags, fields, timestamp)
	// log.Printf("Writing rocket telemetry to influxDB: %v", point)
	writeCtx, writeCancel := context.WithTimeout(d.ctx, time.Second)
	defer writeCancel()
	if err := d.writeAPI.WritePoint(writeCtx, point); err != nil {
		log.Println(err)
	}
}

// Query parses and executes a json request for historical data
func (d *Datastore) Query(req HistoricalDataRequest) HistoricalDataResponse {
	// Validate input (important to prevent injection attacks!)
	if req.Measurement == "" || !slices.Contains(legalMeasurements, req.Measurement) {
		response := HistoricalDataResponse{Error: "Measurement does not exist", Historical: true}
		return response
	}

	if req.Field == "" || !slices.Contains(legalFields, req.Field) {
		response := HistoricalDataResponse{Error: "Field does not exist", Historical: true}
		return response
	}

	if req.Aggregation == "" || !slices.Contains(legalAggregation, req.Aggregation) {
		req.Aggregation = "last" // Default to last if not provided
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
	  |> filter(fn: (r) => r._measurement == "%s")
	  |> filter(fn: (r) => r._field == "%s")
	  |> aggregateWindow(every: %ds, fn: %s, createEmpty: false)
	  |> yield(name: "last")`, req.Start, req.Stop, req.Measurement, req.Field, req.Every, req.Aggregation)

	// Process historical data request.
	log.Printf("Querying with: %s", query)
	results, err := d.queryAPI.Query(d.ctx, query)
	response := HistoricalDataResponse{Historical: true}
	response.Measurement = req.Measurement
	response.Field = req.Field
	if err != nil {
		response.Error = err.Error()
	} else {
		log.Println("Result of Query: ")
		for results.Next() {
			log.Println(results.Record())
			response.Data = append(response.Data, DataPoint{
				Timestamp: results.Record().Time().Format(timestampLayout),
				Value:     results.Record().Value(),
			})
		}
	}
	return response
}

func (d *Datastore) GetLastPoint() ([]byte, error) {
	query := `from(bucket: "telemetry")
		|> range(start: 0)
		|> last()`

	results, err := d.queryAPI.Query(d.ctx, query)
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}

	if results == nil {
		return []byte("[]"), nil // Return an empty JSON array if no data
	}

	var jsonData []byte

	//Use a map to accumulate all fields for a single data point
	data := make(map[string]map[string]DataPoint)

	for results.Next() {
		record := results.Record()
		if record == nil {
			continue
		}
		measurement := record.Measurement()
		fieldName := record.Field()
		fieldValue := record.Value()

		if data[measurement] == nil {
			data[measurement] = make(map[string]DataPoint)
		}
		data[measurement][fieldName] = DataPoint{
			Timestamp: record.Time().Format(timestampLayout),
			Value:     fieldValue,
		}
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
