#ifndef STORAGE_H
#define STORAGE_H

#include <InfluxDB/InfluxDBFactory.h>
#include <iostream>
#include <string> 

// protobuf definitions 
#include "protos/command.grpc.pb.h"

// protobuf commands 
using command::FillStationTelemetry;
using command::RocketUmbTelemetry;

// pointer type 
using influxdb::InfluxDB;

class DataBase {
    private: 
    std::string ground_server_IP; 
    std::string port_number; 

    std::string org; 

    // Stores the InfluxDBFactory objects. Different objects are needed for different 
    // buckets according to the InfluxDB-cxx library. 
    std::unique_ptr<InfluxDB> fill_db; 
    std::unique_ptr<InfluxDB> rocket_db; 

    std::unique_ptr<InfluxDB> fill_rats_db; 
    std::unique_ptr<InfluxDB> ground_rats_db; 

    public: 
    // initializes influxDB and sets [db]
    DataBase();     
    ~DataBase(); 

    void writeUmbilicalTelemetry(FillStationTelemetry t); 
    void writeFillStationTelemetry(RocketUmbTelemetry t); 

    // TODO: Create protobuf format for RATS Telemetry 
    void writeFillRATSTelemetry(); 
    void writeGroundRATSTelemetry(); 
};

#endif 