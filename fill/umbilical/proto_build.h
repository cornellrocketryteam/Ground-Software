#ifndef PROTO_BUILD_H
#define PROTO_BUILD_H

#include <fstream>
#include "protos/command.grpc.pb.h"
#include <iostream>

using command::RocketTelemetry;
using command::RocketMetadata;
using command::Events;
using command::FlightMode; 
using command::RocketUmbTelemetry;

class RocketTelemetryProtoBuilder {
    private:
        const char* usb_port = "PUT NAME HERE";

        std::ifstream serial_data;
    public: 
        // Establish serial connection 
        RocketTelemetryProtoBuilder();
        ~RocketTelemetryProtoBuilder();

        RocketTelemetry buildProto(); 
};

#endif 