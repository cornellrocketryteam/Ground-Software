#include "proto_build.h"
#include <iostream>

RocketTelemetryProtoBuilder::RocketTelemetryProtoBuilder(): serial_data(usb_port, std::ios::in | std::ios::out | std::ios::binary){}

RocketTelemetryProtoBuilder::~RocketTelemetryProtoBuilder(){
    serial_data.close();
}

void RocketTelemetryProtoBuilder::sendCommand(const Command* com) {
    if (com->has_sv2_close()){
        if (com->sv2_close()) {
            serial_data << (uint8_t)CLOSE_SV << std::flush; 
        } else {
            serial_data << (uint8_t)OPEN_SV << std::flush; 
        }
    }

    if (com->has_mav_open()){
        if (com->mav_open()){
            serial_data << (uint8_t)OPEN_MAV << std::flush; 
        } else {
            serial_data << (uint8_t)CLOSE_MAV << std::flush;
        }
    }

    if (com->launch()){
        serial_data << (uint8_t)LAUNCH << std::flush; 
    }
    // if (com->clear_sd()){
    //     serial_data << (uint8_t)CLEAR_SD << std::flush;
    // }
}

RocketTelemetry RocketTelemetryProtoBuilder::buildProto(){
    RocketTelemetry rocketTelemetry; 
     if (serial_data.is_open()){
        RocketUmbTelemetry* rocketUmbTelemetry = rocketTelemetry.mutable_umb_telem();
        RocketMetadata* rocketMetadata = rocketUmbTelemetry->mutable_metadata();
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

        char packet[28]; 
        serial_data.getline(packet, UMB_PACKET_SIZE);

        memcpy(&metadata, packet, sizeof(metadata));
        memcpy(&ms_since_boot, packet + 2, sizeof(ms_since_boot));
        memcpy(&events_val, packet + 6, sizeof(events_val));

        memcpy(&radio_state, packet + 10, sizeof(radio_state));
        memcpy(&transmit_state, packet + 11, sizeof(transmit_state));

        memcpy(&voltage, packet + 12, sizeof(voltage));
        memcpy(&pt3, packet + 16, sizeof(pt3));
        memcpy(&pt4, packet + 20, sizeof(pt4));
        memcpy(&temp, packet + 24, sizeof(temp));

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
        rocketUmbTelemetry->set_voltage(voltage);
        rocketUmbTelemetry->set_pt3(pt3);
        rocketUmbTelemetry->set_pt4(pt4);
        rocketUmbTelemetry->set_rtd_temp(temp);

    } else {
        std::cout << "Serial port is not open.\n"; 
    }
    return rocketTelemetry;
}