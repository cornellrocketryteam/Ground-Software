#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>
#include <random>
#include <filesystem>

#include <spdlog/spdlog.h>
#include <spdlog/sinks/rotating_file_sink.h>
#include "spdlog/sinks/stdout_color_sinks.h"

#include "actuators/qd.h"
#include "actuators/ball_valve.h"
#include "actuators/sol_valve.h"
#include "actuators/ignitor.h"

#include "sensors/sensor.h"
#include "umbilical/proto_build.h"

#include "wiringPi.h"

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/strings/str_format.h"

#include <grpcpp/ext/proto_server_reflection_plugin.h>
#include <grpcpp/grpcpp.h>
#include <grpcpp/health_check_service_interface.h>

#include "protos/command_grpc.grpc.pb.h"

using command::Command;
using command::Commander;
using command::FillStationTelemeter;
using command::CommandReply;
using command::FillStationTelemetry;
using command::FillStationTelemetryRequest;
using command::RocketTelemetryRequest;
using command::RocketTelemetry;
using command::RocketTelemeter;
using grpc::Channel;
using grpc::ClientContext;
using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::ServerWriter;
using grpc::Status;


/* Actuators */
QD qd; 
BallValve ball_valve;
SolValve sv1;
Ignitor ignitor; 

/* Sensor Suite*/
Sensor sensor_suite; 

/* Umblical Tools */
RocketTelemetryProtoBuilder protoBuild;

ABSL_FLAG(uint16_t, server_port, 50051, "Server port for the fill station telemetry");

FillStationTelemetry readTelemetry() {
    FillStationTelemetry t;

    t.set_timestamp(std::time(nullptr));

    t.set_pt1(sensor_suite.ReadPT1());
    t.set_pt2(sensor_suite.ReadPT2());

    t.set_ign1_cont(sensor_suite.ReadIgnitorOneContinuity());
    t.set_ign2_cont(sensor_suite.ReadIgnitorTwoContinuity());

    t.set_lc1(sensor_suite.ReadLoadCell());
    return t;
}

// Fill Station service to accept commands.
class CommanderServiceImpl final : public Commander::Service
{
    Status SendCommand(ServerContext *context, const Command *request,
                       CommandReply *reply) override
    {
        if (request->qd_retract()) {
            qd.Actuate();
            spdlog::critical("QD: Retract command received");
        }

        if (request->has_bv1_open()) {
            if (request->bv1_open()) {
                ball_valve.open();
                spdlog::critical("BV: Open command received");
            } else {
                ball_valve.close();
                spdlog::critical("QD: Close command received");
            }
        }

        if (request->has_bv1_off()) {
            if (request->bv1_off()) {
                ball_valve.powerOff();
                spdlog::critical("BV: Off command received");
            } else {
                ball_valve.powerOn();
                spdlog::critical("BV: On command received");
            }
        }

        if(request->has_sv1_open()){
            if(request->sv1_open()){
                sv1.openAsync();
                spdlog::critical("SV1: Open command received");
            } else {
                sv1.close();
                spdlog::critical("SV1: Close command received");
            }
        }
        
        if (request->has_ignite()){
            if (request->ignite()){
                ignitor.Actuate();
                spdlog::critical("Ignitor: Ignite command received");
            }
        }

        if (request->has_vent_and_ignite()) {
            spdlog::critical("Ignitor: Vent and ignite command received");
            auto sleep_duration = request->vent_and_ignite().ignite_delay();
            std::thread ignite_sender([sleep_duration](){
                sleep(sleep_duration); 
                ignitor.Actuate();
            });
            ignite_sender.detach();
        }
    
        protoBuild.sendCommand(request);

        return Status::OK;
    }
};

// Fill Station service to stream telemetry.
class TelemeterServiceImpl final : public FillStationTelemeter::Service
{
    Status StreamTelemetry(ServerContext *context, const FillStationTelemetryRequest *request,
                       ServerWriter<FillStationTelemetry> *writer) override
    {
        spdlog::critical("Received initial connection point for the fill station telemetry");
        while (true) {
            FillStationTelemetry t = readTelemetry();
            if (!writer->Write(t)) {
                // Broken stream
                return Status::CANCELLED; 
            }
        }
        return Status::OK;
    }
};

class RocketTelemeterServiceImpl final : public RocketTelemeter::Service 
{
    Status StreamTelemetry(ServerContext *context, const RocketTelemetryRequest *request,
                       ServerWriter<RocketTelemetry> *writer) override
    {
        spdlog::critical("Received initial connection point for rocket telemetry");
        while (true) {
            auto now = std::chrono::high_resolution_clock::now();
            absl::StatusOr<RocketTelemetry> t = protoBuild.buildProto();
            
            if (t.ok()) {
                // Operation was successful, access the value
                if (!writer->Write(*t)) {
                    // Broken stream
                    return Status::CANCELLED; 
                }
            }
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
    RocketTelemeterServiceImpl rocket_telemeter_service; 

    grpc::EnableDefaultHealthCheckService(true);
    grpc::reflection::InitProtoReflectionServerBuilderPlugin();
    ServerBuilder builder;
    // Listen on the given address without any authentication mechanism.
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    // Register services.
    builder.RegisterService(&commander_service);
    builder.RegisterService(&telemeter_service);
    builder.RegisterService(&rocket_telemeter_service);
    // Finally assemble the server.
    server = builder.BuildAndStart();

    spdlog::info("Server listening on {}\n", server_address); 

    // Wait for the server to shutdown. Note that some other thread must be
    // responsible for shutting down the server for this call to ever return.
    server->Wait();
}

void setup_logging() {
    // Base logs directory
    std::filesystem::create_directories("logs");

    // Generate timestamped subdirectory
    auto t = std::time(nullptr);
    std::tm tm = *std::localtime(&t);
    std::ostringstream folder_stream;
    folder_stream << "logs/" << std::put_time(&tm, "%Y-%m-%d_%H-%M-%S");

    std::string log_folder = folder_stream.str();
    std::filesystem::create_directories(log_folder);

    // Create "logs/latest" symlink
    std::filesystem::path latest_symlink = "logs/latest";
    std::error_code ec;
    std::filesystem::remove(latest_symlink, ec);  // ignore error if it doesn't exist
    std::filesystem::create_symlink(std::filesystem::absolute(log_folder), latest_symlink, ec);
    if (ec) {
        spdlog::warn("Could not create latest symlink: {}", ec.message());
    }

    // Log file path
    std::string log_base = log_folder + "/log.txt";

    // Max file size: 1.9 GiB
    size_t max_file_size = 1900 * 1024 * 1024;
    size_t max_files = 10;

    // Write all logs to the file
    auto rotating_sink = std::make_shared<spdlog::sinks::rotating_file_sink_mt>(log_base, max_file_size, max_files);
    rotating_sink->set_level(spdlog::level::debug);

    // Only show warning or higher in terminal
    auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
    console_sink->set_level(spdlog::level::warn);

    std::vector<spdlog::sink_ptr> sinks {rotating_sink, console_sink};
    auto logger = std::make_shared<spdlog::logger>("multi_sink", sinks.begin(), sinks.end());

    logger->set_level(spdlog::level::debug);
    logger->flush_on(spdlog::level::warn);

    spdlog::set_default_logger(logger);

    // Set log pattern
    spdlog::set_pattern("[%H:%M:%S.%e] [%^%l%$] %v");
}

/*
MAIN
*/
// Start server and client services
int main(int argc, char **argv)
{
    absl::ParseCommandLine(argc, argv);

    // Set up spdlog
    setup_logging();

    // Start the server in another thread
    std::shared_ptr<Server> server;
    RunServer(absl::GetFlag(FLAGS_server_port), server);

    server->Shutdown();

    return 0;
}