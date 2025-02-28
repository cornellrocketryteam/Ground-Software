#include "storage.h"
#include <InfluxDB/InfluxDB.h>
#include <InfluxDB/InfluxDBBuilder.h>
#include <map> 

DataBase::DataBase() {
    ground_server_IP = "192.168.1.200"; 

    // TODO: Change port number? and api auth token 
    port_number = "8086";

    std::string token = "9jxXHQMRtzDP4epS25mYMS4kf2KtSLX2RrWlh6T0yUH0Tb6bBeNTVdtr519UWTiYQGu5bSthu16rpHSQx1YYGw==";

    std::string full_url = ground_server_IP + ":" + port_number + "?db="; 

    fill_db = influxdb::InfluxDBBuilder::http(full_url + "fill_telemetry").setTimeout(std::chrono::seconds{20}).setAuthToken(token).connect();
    rocket_db = influxdb::InfluxDBBuilder::http(full_url + "umb_telemetry").setTimeout(std::chrono::seconds{20}).setAuthToken(token).connect();

    printf("Created influxdb objects. \n");
}

DataBase::~DataBase(){}

void DataBase::writeUmbilicalTelemetry(RocketUmbTelemetry t){
    printf("Writing to umb_telemetry bucket. \n");

    std::map<std::string, float> field_map; 
    // Metadata 
    field_map.insert(std::make_pair("alt_armed", t.metadata().alt_armed()));
    field_map.insert(std::make_pair("alt_valid", t.metadata().alt_valid()));
    field_map.insert(std::make_pair("gps_valid", t.metadata().gps_valid()));
    field_map.insert(std::make_pair("imu_valid", t.metadata().imu_valid()));
    field_map.insert(std::make_pair("acc_valid", t.metadata().acc_valid()));
    field_map.insert(std::make_pair("therm_valid", t.metadata().therm_valid()));
    field_map.insert(std::make_pair("voltage_valid", t.metadata().voltage_valid()));
    field_map.insert(std::make_pair("adc_valid", t.metadata().adc_valid()));
    field_map.insert(std::make_pair("fram_valid", t.metadata().fram_valid()));
    field_map.insert(std::make_pair("sd_valid", t.metadata().sd_valid()));
    field_map.insert(std::make_pair("gps_msg_valid", t.metadata().gps_msg_valid()));
    field_map.insert(std::make_pair("mav_state", t.metadata().mav_state()));
    field_map.insert(std::make_pair("sv2_state", t.metadata().sv2_state()));
    field_map.insert(std::make_pair("flight_mode", t.metadata().flight_mode()));
    // ms_since_boot
    field_map.insert(std::make_pair("ms_since_boot", t.ms_since_boot()));

    // Events 
    field_map.insert(std::make_pair("altitude_armed", t.events().altitude_armed()));
    field_map.insert(std::make_pair("altimeter_init_failed", t.events().altimeter_init_failed()));
    field_map.insert(std::make_pair("altimeter_reading_failed", t.events().altimeter_reading_failed()));
    field_map.insert(std::make_pair("gps_init_failed", t.events().gps_init_failed()));
    field_map.insert(std::make_pair("gps_reading_failed", t.events().gps_reading_failed()));
    field_map.insert(std::make_pair("imu_init_failed", t.events().imu_init_failed()));
    field_map.insert(std::make_pair("imu_reading_failed", t.events().imu_reading_failed()));
    field_map.insert(std::make_pair("accelerometer_init_failed", t.events().accelerometer_init_failed()));
    field_map.insert(std::make_pair("accelerometer_reading_failed", t.events().accelerometer_reading_failed()));
    field_map.insert(std::make_pair("thermometer_init_failed", t.events().thermometer_init_failed()));
    field_map.insert(std::make_pair("thermometer_reading_failed", t.events().thermometer_reading_failed()));
    field_map.insert(std::make_pair("voltage_init_failed", t.events().voltage_init_failed()));
    field_map.insert(std::make_pair("voltage_reading_failed", t.events().voltage_reading_failed()));
    field_map.insert(std::make_pair("adc_init_failed", t.events().adc_init_failed()));
    field_map.insert(std::make_pair("adc_reading_failed", t.events().adc_reading_failed()));
    field_map.insert(std::make_pair("fram_init_failed", t.events().fram_init_failed()));
    field_map.insert(std::make_pair("fram_write_failed", t.events().fram_write_failed()));
    field_map.insert(std::make_pair("sd_init_failed", t.events().sd_init_failed()));
    field_map.insert(std::make_pair("sd_write_failed", t.events().sd_write_failed()));
    field_map.insert(std::make_pair("mav_was_actuated", t.events().mav_was_actuated()));
    field_map.insert(std::make_pair("sv_was_actuated", t.events().sv_was_actuated()));
    field_map.insert(std::make_pair("main_deploy_wait_end", t.events().main_deploy_wait_end()));
    field_map.insert(std::make_pair("main_log_shutoff", t.events().main_log_shutoff()));
    field_map.insert(std::make_pair("cycle_overflow", t.events().cycle_overflow()));
    field_map.insert(std::make_pair("invalid_command", t.events().invalid_command()));
        
    // Rest of packet 
    field_map.insert(std::make_pair("radio_state", t.radio_state()));
    field_map.insert(std::make_pair("transmite_state", t.transmit_state()));
    field_map.insert(std::make_pair("voltage", t.voltage()));
    field_map.insert(std::make_pair("pt3", t.pt3()));
    field_map.insert(std::make_pair("pt4", t.pt4()));
    field_map.insert(std::make_pair("rtd_temp", t.rtd_temp()));

    // write points in the map with timestamp 
    for (auto map_pair : field_map) {
        rocket_db->write(influxdb::Point{"telemetry"}.addField(map_pair.first,map_pair.second).setTimestamp(std::chrono::system_clock::now()));
    } 
} 

void DataBase::writeFillStationTelemetry(FillStationTelemetry t){
    printf("Writing to fill_telemetry bucket. \n");

    std::map<std::string, float> field_map; 

    field_map.insert(std::make_pair("timestamp", t.timestamp()));
    field_map.insert(std::make_pair("pt1", t.pt1()));
    field_map.insert(std::make_pair("pt2", t.pt2()));
    field_map.insert(std::make_pair("lc1", t.lc1()));
    field_map.insert(std::make_pair("ign1_cont", t.ign1_cont()));
    field_map.insert(std::make_pair("ign2_cont", t.ign2_cont()));

    // write points in the map with timestamp 
    for (auto map_pair : field_map) {
        fill_db->write(influxdb::Point{"telemetry"}.addField(map_pair.first,map_pair.second).setTimestamp(std::chrono::system_clock::now()));
    } 
} 