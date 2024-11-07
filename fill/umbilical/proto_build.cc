#include "proto_build.h"

RocketTelemetryProtoBuilder::RocketTelemetryProtoBuilder(): serial_data(usb_port, std::ios::binary){}

RocketTelemetryProtoBuilder::~RocketTelemetryProtoBuilder(){
    serial_data.close();
}

RocketTelemetry RocketTelemetryProtoBuilder::buildProto(){
    RocketTelemetry rocketTelemetry; 

    if (!serial_data){
        // link together our protobufs 
        RocketUmbTelemetry* rocketUmbTelemetry = rocketTelemetry.mutable_umb_telem();
        RocketMetadata* rocketMetadata = rocketUmbTelemetry->mutable_metadata();
        // FlightMode* flightMode = rocketMetadata->mutable_flight_mode(); 
        Events* events = rocketUmbTelemetry->mutable_events();
        

        uint16_t metadata;
        uint32_t ms_since_boot; 
        uint64_t events_val; 

        bool radio_state; 
        bool transmit_state; 

        float voltage;
        float pt3;
        float pt4; 
        float temp;

        serial_data.read(reinterpret_cast<char*>(&metadata), sizeof(metadata));
        serial_data.read(reinterpret_cast<char*>(&ms_since_boot), sizeof(ms_since_boot));
        serial_data.read(reinterpret_cast<char*>(&events_val), sizeof(events_val));

        serial_data.read(reinterpret_cast<char*>(&radio_state), sizeof(radio_state));
        serial_data.read(reinterpret_cast<char*>(&transmit_state), sizeof(transmit_state));

        serial_data.read(reinterpret_cast<char*>(&voltage), sizeof(voltage));
        serial_data.read(reinterpret_cast<char*>(&pt3), sizeof(pt3));
        serial_data.read(reinterpret_cast<char*>(&pt4), sizeof(pt4));
        serial_data.read(reinterpret_cast<char*>(&temp), sizeof(temp));

        // TODO: Process metadata and update rocketMetadata and flightMode
        // TODO: Process events_val and update events 

        rocketUmbTelemetry->set_ms_since_boot(ms_since_boot);
        rocketUmbTelemetry->set_radio_state(radio_state);
        rocketUmbTelemetry->set_transmit_state(transmit_state);
        
        rocketUmbTelemetry->set_voltage(voltage);
        rocketUmbTelemetry->set_pt3(pt3);
        rocketUmbTelemetry->set_pt4(pt4);
        rocketUmbTelemetry->set_rtd_temp(temp);

    } else {
        printf("Serial port is not open.");
    }
    return rocketTelemetry;
}