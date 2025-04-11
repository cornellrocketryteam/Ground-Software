#ifndef PROTO_BUILD_H
#define PROTO_BUILD_H

// 28 to account for 26 byte packet, then /r/n characters
#define UMB_PACKET_SIZE 28

#include "protos/command_grpc.grpc.pb.h"
#include <iostream>
#include <fcntl.h>   

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdarg.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include "absl/status/statusor.h"
#include <spdlog/spdlog.h>

using command::RocketTelemetry;
using command::RocketMetadata;
using command::Events;
using command::FlightMode; 
using command::RocketUmbTelemetry;
using command::Command; 

class RocketTelemetryProtoBuilder {
    private:
        typedef enum {
            LAUNCH,
            OPEN_MAV,
            CLOSE_MAV,
            OPEN_SV,
            CLOSE_SV,
            SAFE,
            CLEAR_SD,
            FRAM_RESET,
            REBOOT,
            CHANGE_BLIMS_LAT,
            CHANGE_BLIMS_LONG,
            CHANGE_REF_PRESS,
            CHANGE_ALT_STATE,
            CHANGE_SD_STATE,
            CHANGE_ALT_ARMED,
            CHANGE_FLIGHTMODE
        } COMMAND_OPTIONS; 

        const char* usb_port = "/dev/rocket";

        int serial_data;

        void openfile();

        ssize_t read_packet(int fd, char* packet, size_t max_size);

        uint32_t recycle_count;

    public: 
        // Establish serial connection 
        RocketTelemetryProtoBuilder();
        ~RocketTelemetryProtoBuilder();

        void sendCommand(const Command* com); 

        // send the Safe command when ground server disconnects from the fill station
        void sendSafeCommand();

        absl::StatusOr<RocketTelemetry> buildProto(); 
};

#endif