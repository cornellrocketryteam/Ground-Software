#include "proto_build.h"
#include <iostream>
#include <unistd.h>
#include <poll.h>

bool is_fd_disconnected(int fd) {
    struct pollfd pfd = {fd, POLLIN | POLLPRI | POLLERR | POLLHUP, 0};
    int ret = poll(&pfd, 1, 0); // Timeout = 0 (non-blocking check)

    return (ret > 0 && (pfd.revents & (POLLHUP | POLLERR)));
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

    // Return the number of bytes read
    return index;
}

void RocketTelemetryProtoBuilder::openfile(){
    if ((serial_data = open("/dev/rocket", O_RDWR | O_NOCTTY)) == -1) {
        spdlog::debug("Umb: Error opening /dev/rocket"); 
    }

    fcntl(serial_data, F_SETFL, O_RDWR) ;

    struct termios tty;
    memset(&tty, 0, sizeof(tty));

    if (tcgetattr(serial_data, &tty) != 0) {
        // spdlog::debug("Umb: Error getting termios attributes for file descriptor");
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
        // spdlog::debug("Umb: Error setting termios attributes");
    }

    usleep(10);
}

RocketTelemetryProtoBuilder::RocketTelemetryProtoBuilder(){
    openfile();
    recycle_count = 0;
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
            spdlog::critical("SV2: Close command received");
            write_command(CLOSE_SV);
        } else {
            spdlog::critical("SV2: Open command received");
            write_command(OPEN_SV);
        }
    }

    if (com->has_mav_open()){
        if (com->mav_open()){
            spdlog::critical("MAV: Open command received");
            write_command(OPEN_MAV);
        } else {     
            spdlog::critical("MAV: Close command received");
            write_command(CLOSE_MAV);
        }
    }

    if (com->launch()){
        spdlog::critical("MAV: Launch command received");
        write_command(LAUNCH);
    }

    if (com->has_vent()) {
        spdlog::critical("SV2: Vent command received");

        auto sleep_duration = com->vent().vent_duration();
        std::thread vent_sender([this, sleep_duration](){
            write_command(OPEN_SV);
            sleep(sleep_duration); 
            write_command(CLOSE_SV); 
        });
        vent_sender.detach();
    }

    if (com->has_vent_and_ignite()) {
        spdlog::critical("SV2: Vent and ignite command received");

        auto sleep_duration = com->vent_and_ignite().vent_duration();
        std::thread vent_sender([this, sleep_duration](){
            write_command(OPEN_SV);
            sleep(sleep_duration); 
            write_command(CLOSE_SV); 
        });
        vent_sender.detach();
    }

    if (com->sd_clear()){
        spdlog::critical("SD: Clear command received");
        write_command(CLEAR_SD); 
    }

    if (com->fram_reset()){
        spdlog::critical("SV2: Reset command received");
        write_command(FRAM_RESET);
    }
    
    if (com->reboot()){
        spdlog::critical("Rocket: Reboot command received");
        write_command(REBOOT); 
    }
}

absl::StatusOr<RocketTelemetry> RocketTelemetryProtoBuilder::buildProto(){
    RocketTelemetry rocketTelemetry; 

    recycle_count++;

    if (recycle_count == 100){
        recycle_count = 0;
        // spdlog::info("Umb: Recycle limit reached. Opening file again");
        openfile();
    }

     if (!is_fd_disconnected(serial_data)){
        RocketUmbTelemetry* rocketUmbTelemetry = rocketTelemetry.mutable_umb_telem();
        RocketMetadata* rocketMetadata = rocketUmbTelemetry->mutable_metadata();
        Events* events = rocketUmbTelemetry->mutable_events();

        uint16_t metadata;
        uint32_t ms_since_boot; 
        uint32_t events_val; 

        float battery_voltage;
        float pt3;
        float pt4; 
        float rtd_temp;

        char packet[UMB_PACKET_SIZE]; 

        int status = read_packet(serial_data, packet, UMB_PACKET_SIZE);

        if (status == -1 || status < UMB_PACKET_SIZE - 1){
            // This means we did not read enough bytes 
            // spdlog::debug("Umb: Only {} bytes read", status); 
            return absl::InternalError("Not enough Bytes"); 
        }

        memcpy(&metadata, packet, sizeof(metadata));
        memcpy(&ms_since_boot, packet + 2, sizeof(ms_since_boot));
        memcpy(&events_val, packet + 6, sizeof(events_val));
        memcpy(&battery_voltage, packet + 10, sizeof(battery_voltage));
        memcpy(&pt3, packet + 14, sizeof(pt3));
        memcpy(&pt4, packet + 18, sizeof(pt4));
        memcpy(&rtd_temp, packet + 22, sizeof(rtd_temp));

        rocketMetadata->set_alt_armed(static_cast<bool>((metadata >> 0) & 0x1));
        rocketMetadata->set_alt_valid(static_cast<bool>((metadata >> 1) & 0x1));
        rocketMetadata->set_gps_valid(static_cast<bool>((metadata >> 2) & 0x1));
        rocketMetadata->set_imu_valid(static_cast<bool>((metadata >> 3) & 0x1));
        rocketMetadata->set_acc_valid(static_cast<bool>((metadata >> 4) & 0x1));
        // bit index 5 is unused
        rocketMetadata->set_adc_valid(static_cast<bool>((metadata >> 6) & 0x1));
        rocketMetadata->set_fram_valid(static_cast<bool>((metadata >> 7) & 0x1));
        rocketMetadata->set_sd_valid(static_cast<bool>((metadata >> 8) & 0x1));
        rocketMetadata->set_gps_msg_fresh(static_cast<bool>((metadata >> 9) & 0x1));
        rocketMetadata->set_rocket_was_safed(static_cast<bool>((metadata >> 10) & 0x1));
        rocketMetadata->set_mav_state(static_cast<bool>((metadata >> 11) & 0x1));
        rocketMetadata->set_sv2_state(static_cast<bool>((metadata >> 12) & 0x1));

        switch((metadata >> 13) & 0b111) {
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

        events->set_altitude_armed(static_cast<bool>((events_val >> 0) & 0x1));
        events->set_altimeter_init_failed(static_cast<bool>((events_val >> 1) & 0x1));
        events->set_altimeter_reading_failed(static_cast<bool>((events_val >> 2) & 0x1));
        events->set_gps_init_failed(static_cast<bool>((events_val >> 3) & 0x1));
        events->set_gps_reading_failed(static_cast<bool>((events_val >> 4) & 0x1));
        events->set_imu_init_failed(static_cast<bool>((events_val >> 5) & 0x1));
        events->set_imu_reading_failed(static_cast<bool>((events_val >> 6) & 0x1));
        events->set_accelerometer_init_failed(static_cast<bool>((events_val >> 7) & 0x1));
        events->set_accelerometer_reading_failed(static_cast<bool>((events_val >> 8) & 0x1));
        events->set_adc_init_failed(static_cast<bool>((events_val >> 9) & 0x1));
        events->set_adc_reading_failed(static_cast<bool>((events_val >> 10) & 0x1));
        events->set_fram_init_failed(static_cast<bool>((events_val >> 11) & 0x1));
        events->set_fram_read_failed(static_cast<bool>((events_val >> 12) & 0x1));
        events->set_fram_write_failed(static_cast<bool>((events_val >> 13) & 0x1));
        events->set_sd_init_failed(static_cast<bool>((events_val >> 14) & 0x1));
        events->set_sd_write_failed(static_cast<bool>((events_val >> 15) & 0x1));
        events->set_mav_was_actuated(static_cast<bool>((events_val >> 16) & 0x1));
        events->set_sv_was_actuated(static_cast<bool>((events_val >> 17) & 0x1));
        events->set_main_deploy_wait_end(static_cast<bool>((events_val >> 18) & 0x1));
        events->set_main_log_shutoff(static_cast<bool>((events_val >> 19) & 0x1));
        events->set_cycle_overflow(static_cast<bool>((events_val >> 20) & 0x1));
        events->set_unknown_command_received(static_cast<bool>((events_val >> 21) & 0x1));
        events->set_launch_command_received(static_cast<bool>((events_val >> 22) & 0x1));
        events->set_mav_command_received(static_cast<bool>((events_val >> 23) & 0x1));
        events->set_sv_command_received(static_cast<bool>((events_val >> 24) & 0x1));
        events->set_safe_command_received(static_cast<bool>((events_val >> 25) & 0x1));
        events->set_reset_card_command_received(static_cast<bool>((events_val >> 26) & 0x1));
        events->set_reset_fram_command_received(static_cast<bool>((events_val >> 27) & 0x1));
        events->set_state_change_command_received(static_cast<bool>((events_val >> 28) & 0x1));
        events->set_umbilical_disconnected(static_cast<bool>((events_val >> 29) & 0x1));

        rocketUmbTelemetry->set_ms_since_boot(ms_since_boot);
        rocketUmbTelemetry->set_battery_voltage(battery_voltage);
        rocketUmbTelemetry->set_pt3(pt3);
        rocketUmbTelemetry->set_pt4(pt4);
        rocketUmbTelemetry->set_rtd_temp(rtd_temp);

        spdlog::info("Umb: Metadata: {:032b}", metadata);
        spdlog::info("Umb: Events: {:032b}", events_val);
        spdlog::info("Umb: MS: {}", ms_since_boot);
        spdlog::info("Umb: PT3: {}, PT4: {}, RTD: {}", pt3, pt4, rtd_temp);

    } else {
        spdlog::error("Umb: Serial port is not open. Trying again");
        openfile();
    }
    return rocketTelemetry;
}