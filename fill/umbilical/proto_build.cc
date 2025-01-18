#include "proto_build.h"
#include <iostream>
#include <unistd.h>

bool RocketTelemetryProtoBuilder::is_fd_open(int fd) {
    int flags = fcntl(fd, F_GETFL);
    return (flags != -1 || errno != EBADF);
}

ssize_t RocketTelemetryProtoBuilder::read_packet(int fd, char* packet, size_t max_size) {
    size_t index = 0;  // Current position in the packet
    char byte;         // Single byte buffer
    ssize_t bytesRead;

    while (index < max_size) {  
        bytesRead = read(fd, &byte, 1);  // Read one byte at a time

        if (bytesRead < 0) {
            return -1;
        }

        if (bytesRead == 0) {
            // End of file reached
            break;
        }

        // Append the byte to the packet
        packet[index++] = byte;

        // Stop if newline is found
        if (byte == '\n') {
            break;
        }
    }

    return index;  // Return the number of bytes read
}

void RocketTelemetryProtoBuilder::openfile(){
    if ((serial_data = open ("/dev/rocket", O_RDWR | O_NOCTTY)) == -1) {
        std::cout << "Error opening /dev/rocket." << std::endl;
    }

    fcntl (serial_data, F_SETFL, O_RDWR) ;

    struct termios tty;
    memset(&tty, 0, sizeof(tty));

    if (tcgetattr(serial_data, &tty) != 0) {
        std::cerr << "Error getting termios attributes." << std::endl;
        close(serial_data);
    }

    cfsetospeed(&tty, B9600); // Baud Rate
    cfsetispeed(&tty, B9600);

    tty.c_cflag &= ~PARENB;
    tty.c_cflag &= ~CSTOPB;
    tty.c_cflag &= ~CSIZE;
    tty.c_cflag |= CS8;
    tty.c_cflag &= ~CRTSCTS;
    tty.c_cflag |= CREAD | CLOCAL;

    tty.c_lflag &= ~ICANON;
    tty.c_lflag &= ~ECHO;
    tty.c_lflag &= ~ECHOE;
    tty.c_lflag &= ~ECHONL;
    tty.c_lflag &= ~ISIG;

    tty.c_iflag &= ~(IXON | IXOFF | IXANY);
    tty.c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL);

    tty.c_oflag &= ~OPOST;

    tty.c_cc[VMIN] = 0;
    tty.c_cc[VTIME] = 10;

    if (tcsetattr(serial_data, TCSANOW, &tty) != 0) {
        std::cerr << "Error setting termios attributes." << std::endl;
        //close(serial_data);
    }

    usleep(10); 

}

RocketTelemetryProtoBuilder::RocketTelemetryProtoBuilder(){
    openfile();
}

RocketTelemetryProtoBuilder::~RocketTelemetryProtoBuilder(){
    close(serial_data);
}

void RocketTelemetryProtoBuilder::write_command(char com){
    write(serial_data, &com, 1);
}

void RocketTelemetryProtoBuilder::sendCommand(const Command* com) {
    if (com->has_sv2_close()){
        if (com->sv2_close()) {
            printf("Received sv2 close\n");
            write_command(CLOSE_SV);
        } else {
            printf("Received  opensv\n");
            write_command(OPEN_SV);
        }
    }

    if (com->has_mav_open()){
        if (com->mav_open()){
            printf("received open mav\n");
            write_command(OPEN_MAV);
        } else {     
            printf("Received close mav\n");
            write_command(CLOSE_MAV);
        }
    }

    if (com->launch()){
        printf("Received launch\n");
        write_command(LAUNCH);
    }
}

RocketTelemetry RocketTelemetryProtoBuilder::buildProto(){
    RocketTelemetry rocketTelemetry; 
     if (is_fd_open(serial_data)){
        RocketUmbTelemetry* rocketUmbTelemetry = rocketTelemetry.mutable_umb_telem();
        RocketMetadata* rocketMetadata = rocketUmbTelemetry->mutable_metadata();
        Events* events = rocketUmbTelemetry->mutable_events();

        uint16_t metadata;
        uint32_t ms_since_boot; 
        uint64_t events_val; 

        bool radio_state; 
        bool transmit_state; 

        float pt3;
        float pt4; 
        float temp;

        char packet[UMB_PACKET_SIZE]; 

        int status = read_packet(serial_data, packet, UMB_PACKET_SIZE);
        if (status == -1 || status < UMB_PACKET_SIZE - 1){
            // This means we did not read enough bytes 

            return rocketTelemetry; // Is this correct?? 
        }
        // For Debugging 
        std::cout << "Packet: \n" << packet << std::endl;

        memcpy(&metadata, packet, sizeof(metadata));
        memcpy(&ms_since_boot, packet + 2, sizeof(ms_since_boot));
        memcpy(&events_val, packet + 6, sizeof(events_val));

        memcpy(&radio_state, packet + 10, sizeof(radio_state));
        memcpy(&transmit_state, packet + 11, sizeof(transmit_state));

        memcpy(&pt3, packet + 12, sizeof(pt3));
        memcpy(&pt4, packet + 16, sizeof(pt4));
        memcpy(&temp, packet + 20, sizeof(temp));

        rocketMetadata->set_alt_armed(static_cast<bool>(metadata & 0x1)); 
        rocketMetadata->set_alt_valid(static_cast<bool>((metadata & 0x2) >> 1)); 
        rocketMetadata->set_gps_valid(static_cast<bool>((metadata & 0x4) >> 2)); 
        rocketMetadata->set_imu_valid(static_cast<bool>((metadata & 0x8) >> 3)); 
        rocketMetadata->set_acc_valid(static_cast<bool>((metadata & 0x10) >> 4)); 
        rocketMetadata->set_therm_valid(static_cast<bool>((metadata & 0x20) >> 5)); 
        rocketMetadata->set_voltage_valid(static_cast<bool>((metadata & 0x40) >> 6)); 
        rocketMetadata->set_adc_valid(static_cast<bool>((metadata & 0x80) >> 7)); 
        rocketMetadata->set_fram_valid(static_cast<bool>((metadata & 0x100) >> 8)); 
        rocketMetadata->set_sd_valid(static_cast<bool>((metadata & 0x200) >> 9)); 
        rocketMetadata->set_gps_msg_valid(static_cast<bool>((metadata & 0x400) >> 10)); 
        rocketMetadata->set_mav_state(static_cast<bool>((metadata & 0x800) >> 11)); 
        rocketMetadata->set_sv_state(static_cast<bool>((metadata & 0x1000) >> 12)); 

        switch((metadata & 0xE000) >> 13) {
            case 0b000:
                rocketMetadata->set_flight_mode(command::STARTUP);
                break; 
            case 0b001:
                rocketMetadata->set_flight_mode(command::STANDBY);
                break; 
            case 0b010:
                rocketMetadata->set_flight_mode(command::ASCENT);
                break; 
            case 0b011:
                rocketMetadata->set_flight_mode(command::DROGUE_DEPLOYED);
                break; 
            case 0b100:
                rocketMetadata->set_flight_mode(command::MAIN_DEPLOYED);
                break; 
            case 0b101:
                rocketMetadata->set_flight_mode(command::FAULT);
                break; 
        }

        events->set_altitude_armed(static_cast<bool>(events_val & 0x1));
        events->set_altimeter_init_failed(static_cast<bool>((events_val & 0x2) >> 1)); 
        events->set_altimeter_reading_failed(static_cast<bool>((events_val & 0x4) >> 2)); 
        events->set_gps_init_failed(static_cast<bool>((events_val & 0x8) >> 3)); 
        events->set_gps_reading_failed(static_cast<bool>((events_val & 0x10) >> 4)); 
        events->set_imu_init_failed(static_cast<bool>((events_val & 0x20) >> 5)); 
        events->set_imu_reading_failed(static_cast<bool>((events_val & 0x40) >> 6)); 
        events->set_accelerometer_init_failed(static_cast<bool>((events_val & 0x80) >> 7)); 
        events->set_accelerometer_reading_failed(static_cast<bool>((events_val & 0x100) >> 8)); 
        events->set_thermometer_init_failed(static_cast<bool>((events_val & 0x200) >> 9)); 
        events->set_thermometer_reading_failed(static_cast<bool>((events_val & 0x400) >> 10)); 
        events->set_voltage_init_failed(static_cast<bool>((events_val & 0x800) >> 11)); 
        events->set_voltage_reading_failed(static_cast<bool>((events_val & 0x1000) >> 12)); 
        events->set_adc_init_failed(static_cast<bool>((events_val & 0x2000) >> 13)); 
        events->set_adc_reading_failed(static_cast<bool>((events_val & 0x4000) >> 14)); 
        events->set_fram_init_failed(static_cast<bool>((events_val & 0x8000) >> 15)); 
        events->set_fram_write_failed(static_cast<bool>((events_val & 0x10000) >> 16)); 
        events->set_sd_init_failed(static_cast<bool>((events_val & 0x20000) >> 17)); 
        events->set_sd_write_failed(static_cast<bool>((events_val & 0x40000) >> 18)); 
        events->set_mav_was_actuated(static_cast<bool>((events_val & 0x80000) >> 19)); 
        events->set_sv_was_actuated(static_cast<bool>((events_val & 0x100000) >> 20)); 
        events->set_main_deploy_wait_end(static_cast<bool>((events_val & 0x200000) >> 21)); 
        events->set_main_log_shutoff(static_cast<bool>((events_val & 0x400000) >> 22)); 
        events->set_cycle_overflow(static_cast<bool>((events_val & 0x800000) >> 23)); 
        events->set_invalid_command(static_cast<bool>((events_val & 0x1000000) >> 24)); 

        rocketUmbTelemetry->set_ms_since_boot(ms_since_boot);
        rocketUmbTelemetry->set_radio_state(radio_state);
        rocketUmbTelemetry->set_transmit_state(transmit_state);
        rocketUmbTelemetry->set_pt3(pt3);
        rocketUmbTelemetry->set_pt4(pt4);
        rocketUmbTelemetry->set_rtd_temp(temp);

    } else {
        std::cout << "Serial port is not open. Trying to open again.\n"; 
        openfile();
    }
    return rocketTelemetry;
}