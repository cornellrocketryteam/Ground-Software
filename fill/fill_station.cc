#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>
#include <random>

#include "telemetry_reader.h"
#include "sensors/ptd.h"

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/strings/str_format.h"

#include <grpcpp/ext/proto_server_reflection_plugin.h>
#include <grpcpp/grpcpp.h>
#include <grpcpp/health_check_service_interface.h>

#include "protos/command.grpc.pb.h"

using command::Command;
using command::Commander;
using command::Telemeter;
using command::CommandReply;
using command::Telemetry;
using command::RocketTelemetry;
using command::GPSTelemetry;
using command::AccelerometerTelemetry;
using command::IMUTelemetry;
using command::RocketMetadata;
using command::Events;
using command::SensorStatus;
using command::FlightMode;
using command::TelemetryRequest;
using grpc::Channel;
using grpc::ClientContext;
using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::ServerWriter;
using grpc::Status;

ABSL_FLAG(uint16_t, server_port, 50051, "Server port for the service");

Telemetry generateRandomTelemetry() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> float_dist(-100.0, 100.0);
    std::uniform_int_distribution<> int_dist(-100000, 100000);
    std::uniform_int_distribution<> uint_dist(0, 100000);
    std::uniform_int_distribution<> bool_dist(0, 1);
    std::uniform_int_distribution<> sensor_dist(0, 2);
    std::uniform_int_distribution<> flight_dist(0, 5);

    Telemetry telemetry;
    telemetry.set_timestamp(std::time(0));
    telemetry.set_pt1(float_dist(gen));
    telemetry.set_pt2(float_dist(gen));
    telemetry.set_lc1(float_dist(gen));
    telemetry.set_sv1_cont(float_dist(gen));
    telemetry.set_ign1_cont(float_dist(gen));
    telemetry.set_ign2_cont(float_dist(gen));

    RocketTelemetry* rockTelem = telemetry.mutable_rock_telem();
    rockTelem->set_timestamp(0);
    rockTelem->set_altitude(float_dist(gen));
    rockTelem->set_temp(float_dist(gen));
    rockTelem->set_voltage(float_dist(gen));
    rockTelem->set_current(float_dist(gen));
    rockTelem->set_pt3(float_dist(gen));
    rockTelem->set_blims_state(int_dist(gen));


    GPSTelemetry* gpsTelem = rockTelem->mutable_gps_telem();
    gpsTelem->set_latitude(int_dist(gen));
    gpsTelem->set_longitude(int_dist(gen));
    gpsTelem->set_num_satellites(uint_dist(gen));

    AccelerometerTelemetry* accelTelem = rockTelem->mutable_accel_telem();
    accelTelem->set_accel_x(float_dist(gen));
    accelTelem->set_accel_y(float_dist(gen));
    accelTelem->set_accel_z(float_dist(gen));

    IMUTelemetry* imuTelem = rockTelem->mutable_imu_telem();
    imuTelem->set_gyro_x(float_dist(gen));
    imuTelem->set_gyro_y(float_dist(gen));
    imuTelem->set_gyro_z(float_dist(gen));
    imuTelem->set_accel_x(float_dist(gen));
    imuTelem->set_accel_y(float_dist(gen));
    imuTelem->set_accel_z(float_dist(gen));
    imuTelem->set_ori_x(float_dist(gen));
    imuTelem->set_ori_y(float_dist(gen));
    imuTelem->set_ori_z(float_dist(gen));
    imuTelem->set_grav_x(float_dist(gen));
    imuTelem->set_grav_y(float_dist(gen));
    imuTelem->set_grav_z(float_dist(gen));

    RocketMetadata* metadata = rockTelem->mutable_metadata();
    metadata->set_alt_armed(0);
    metadata->set_gps_valid(1);
    metadata->set_sd_init(1);
    metadata->set_therm_status(static_cast<SensorStatus>(1));
    metadata->set_acc_status(static_cast<SensorStatus>(1));
    metadata->set_imu_status(static_cast<SensorStatus>(1));
    metadata->set_gps_status(static_cast<SensorStatus>(1));
    metadata->set_alt_status(static_cast<SensorStatus>(1));
    metadata->set_fram_status(static_cast<SensorStatus>(1));
    metadata->set_flight_mode(static_cast<FlightMode>(1));

    Events* events = rockTelem->mutable_events();
    events->set_key_armed(bool_dist(gen));
    events->set_altitude_armed(bool_dist(gen));
    events->set_altimeter_init_failed(bool_dist(gen));
    events->set_altimeter_reading_failed(bool_dist(gen));
    events->set_altimeter_was_turned_off(bool_dist(gen));
    events->set_gps_init_failed(bool_dist(gen));
    events->set_gps_reading_failed(bool_dist(gen));
    events->set_gps_was_turned_off(bool_dist(gen));
    events->set_imu_init_failed(bool_dist(gen));
    events->set_imu_reading_failed(bool_dist(gen));
    events->set_imu_was_turned_off(bool_dist(gen));
    events->set_accelerometer_init_failed(bool_dist(gen));
    events->set_accelerometer_reading_failed(bool_dist(gen));
    events->set_accelerometer_was_turned_off(bool_dist(gen));
    events->set_thermometer_init_failed(bool_dist(gen));
    events->set_thermometer_reading_failed(bool_dist(gen));
    events->set_thermometer_was_turned_off(bool_dist(gen));
    events->set_sd_init_failed(bool_dist(gen));
    events->set_sd_write_failed(bool_dist(gen));
    events->set_rfm_init_failed(bool_dist(gen));
    events->set_rfm_transmit_failed(bool_dist(gen));

    return telemetry;
}

// Fill Station service to accept commands.
class CommanderServiceImpl final : public Commander::Service
{
    Status SendCommand(ServerContext *context, const Command *request,
                       CommandReply *reply) override
    {
        return Status::OK;
    }
};

// Fill Station service to stream telemetry.
class TelemeterServiceImpl final : public Telemeter::Service
{
    Status StreamTelemetry(ServerContext *context, const TelemetryRequest *request,
                       ServerWriter<Telemetry> *writer) override
    {
        while (true) {
            auto now = std::chrono::high_resolution_clock::now();
            Telemetry t = generateRandomTelemetry();
            if (!writer->Write(t)) {
                // Broken stream
                return Status::CANCELLED; 
            }
            std::this_thread::sleep_until(now + std::chrono::milliseconds(1000));
        }
        return Status::OK;
    }
};

// Server startup function
void RunServer(uint16_t port, std::shared_ptr<Server> server)
{
    std::string server_address = absl::StrFormat("0.0.0.0:%d", port);
    CommanderServiceImpl commander_service;
    TelemeterServiceImpl telemeter_service;

    grpc::EnableDefaultHealthCheckService(true);
    grpc::reflection::InitProtoReflectionServerBuilderPlugin();
    ServerBuilder builder;
    // Listen on the given address without any authentication mechanism.
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    // Register services.
    builder.RegisterService(&commander_service);
    builder.RegisterService(&telemeter_service);
    // Finally assemble the server.
    server = builder.BuildAndStart();
    // std::unique_ptr<Server> server(builder.BuildAndStart());
    std::cout << "Server listening on " << server_address << std::endl;

    // Wait for the server to shutdown. Note that some other thread must be
    // responsible for shutting down the server for this call to ever return.
    server->Wait();
}

/*
MAIN
*/

// Start server and client services
int main(int argc, char **argv)
{
    absl::ParseCommandLine(argc, argv);
    // Start the server in another thread
    std::shared_ptr<Server> server;
    RunServer(absl::GetFlag(FLAGS_server_port), server);
    // std::thread serverThread(RunServer, absl::GetFlag(FLAGS_server_port), server);

    server->Shutdown();
    return 0;
}