#ifndef PROTO_BUILD_H
#define PROTO_BUILD_H

#define LAUNCH '0'
#define OPEN_MAV '1'
#define CLOSE_MAV '2'
#define OPEN_SV '3'
#define CLOSE_SV '4'
#define CLEAR_SD '5'

#define UMB_PACKET_SIZE 28

#include "protos/command.grpc.pb.h"
#include <iostream>
#include <termios.h>    // POSIX terminal control definitions
#include <unistd.h>     // UNIX standard function definitions
#include <cstring>      // For memset
#include <fcntl.h>      // File control definitions
using command::RocketTelemetry;
using command::RocketMetadata;
using command::Events;
using command::FlightMode; 
using command::RocketUmbTelemetry;
using command::Command; 

class RocketTelemetryProtoBuilder {
    private:
        const char* usb_port = "/dev/rocket";

        int serial_data;
    public: 
        // Establish serial connection 
        RocketTelemetryProtoBuilder();
        ~RocketTelemetryProtoBuilder();

        void sendCommand(const Command* com); 

        RocketTelemetry buildProto(); 
};

#endif 