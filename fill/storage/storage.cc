#include "storage.h"

DataBase::DataBase() {
    ground_server_IP = "192.168.1.200"; 
    port_number = "8080";

    org = "crt";

    std::string full_url = "http://" + ground_server_IP + ":" + port_number + "/api/v2/write?org=" + org + "&bucket=";

    fill_db = influxdb::InfluxDBFactory::Get(full_url + "fill_telemetry");
    rocket_db = influxdb::InfluxDBFactory::Get(full_url + "umbilical_telemetry");
    fill_rats_db = influxdb::InfluxDBFactory::Get(full_url + "fill_rats_telemetry");
    ground_rats_db = influxdb::InfluxDBFactory::Get(full_url + "ground_rats_telemetry");
}

DataBase::~DataBase(){}

// temporary point writing to test 
void DataBase::writeUmbilicalTelemetry(FillStationTelemetry t){
    rocket_db->write(influxdb::Point{"temperature"}.addTag("city","DALLAS").addTag("device","companyX").addField("value",28));
} 

void DataBase::writeFillStationTelemetry(RocketUmbTelemetry t){
    fill_db->write(influxdb::Point{"temperature"}.addTag("city","DALLAS").addTag("device","companyX").addField("value",28));
} 

void DataBase::writeFillRATSTelemetry(){
    fill_rats_db->write(influxdb::Point{"temperature"}.addTag("city","DALLAS").addTag("device","companyX").addField("value",28));
} 

void DataBase::writeGroundRATSTelemetry(){
    ground_rats_db->write(influxdb::Point{"temperature"}.addTag("city","DALLAS").addTag("device","companyX").addField("value",28));
} 