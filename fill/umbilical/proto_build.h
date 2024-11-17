#ifndef PROTO_BUILD_H
#define PROTO_BUILD_H

#define LAUNCH '0'
#define OPEN_MAV '1'
#define CLOSE_MAV '2'
#define OPEN_SV '3'
#define CLOSE_SV '4'
#define SAFE '5'
#define CLEAR_SD '6'

#define UMB_PACKET_SIZE 24

#include "protos/command.grpc.pb.h"
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

        bool is_fd_open(int fd);

        void openfile();

        ssize_t read_packet(int fd, char* packet, size_t max_size);

        void write_command(char com);
    public: 
        // Establish serial connection 
        RocketTelemetryProtoBuilder();
        ~RocketTelemetryProtoBuilder();

        void sendCommand(const Command* com); 

        // send the Safe command when ground server disconnects from the fill station
        void sendSafeCommand();

        RocketTelemetry buildProto(); 
};

#endif 