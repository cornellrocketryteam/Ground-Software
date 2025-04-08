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
#include "spdlog/sinks/basic_file_sink.h"
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

#include "protos/command.grpc.pb.h"

#include <sdbus-c++/sdbus-c++.h>

// #include <sdbus-c++/sdbus-c++.h>

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

// Function to send a Bluetooth message to start the payload
void sendPayloadStartCommand() {
    try {
        // Connect to the system bus
        auto connection = sdbus::createSystemBusConnection();
        connection->enterEventLoopAsync();

        const std::string devicePath = "/org/bluez/hci0/dev_XX_XX_XX_XX_XX_XX"; // Raspberry Pico W's object path
        const std::string charPath = devicePath + "/service0010/char0011";      // Characteristic for payload command

        // Create a proxy for the GATT characteristic
        auto characteristicProxy = sdbus::createProxy(*connection, "org.bluez", charPath);

        // Prepare the command value to send
        const std::vector<uint8_t> commandValue = { 0x01 };

        // Prepare an empty options dictionary
        std::map<std::string, sdbus::Variant> options;

        std::cout<<"Sending Payload Start Command\n";

        // Invoke the WriteValue method on the GATT characteristic
        characteristicProxy->callMethod("WriteValue")
            .onInterface("org.bluez.GattCharacteristic1")
            .withArguments(commandValue, options);

        spdlog::info("Payload start command sent successfully");
    }
    catch (const sdbus::Error &e) {
        spdlog::error("Failed to send payload start command: {}", e.what());
    }
}


// Fill Station service to accept commands.
class CommanderServiceImpl final : public Commander::Service
{
    Status SendCommand(ServerContext *context, const Command *request,
                       CommandReply *reply) override
    {
        if (request->qd_retract()) {
            spdlog::critical("QD: Retract command received");
            qd.Actuate();
        }

        if (request->has_bv1_open()) {
            if (request->bv1_open()) {
                spdlog::critical("BV: Open command received");
                ball_valve.open();
            } else {
                spdlog::critical("QD: Close command received");
                ball_valve.close();
            }
        }

        if (request->has_bv1_off()) {
            if (request->bv1_off()) {
                spdlog::critical("BV: Off command received");
                ball_valve.powerOff();
            } else {
                spdlog::critical("BV: On command received");
                ball_valve.powerOn();
            }
        }

        if(request->has_sv1_open()){
            if(request->sv1_open()){
                spdlog::critical("SV1: Open command received");
                sv1.openAsync();
            } else{
                spdlog::critical("SV1: Close command received");
                sv1.close();
            }
        }
        
        if (request->has_ignite()){
            if (request->ignite()){
                spdlog::critical("Ignitor: Ignite command received");
                ignitor.Actuate();
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

        // If request to start payload on rocket
        if (request->payload_start()) {
            spdlog::critical("Payload: Start command received");
            sendPayloadStartCommand();
            // TODO: Implement payload start command
        }
    
        // protoBuild.sendCommand(request);

        return Status::OK;
    }
};

// Fill Station service to stream telemetry.
class TelemeterServiceImpl final : public FillStationTelemeter::Service
{
    Status StreamTelemetry(ServerContext *context, const FillStationTelemetryRequest *request,
                       ServerWriter<FillStationTelemetry> *writer) override
    {
        spdlog::info("Received initial connection point for the fill-station telemetry service.\n");
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
            // absl::StatusOr<RocketTelemetry> t = protoBuild.buildProto();
            
            // if (t.ok()) {
            //     // Operation was successful, access the value
            //     if (!writer->Write(*t)) {
            //         // Broken stream
            //         return Status::CANCELLED; 
            //     }
            // } else {
            //     spdlog::error("Error reading rocket packet: {}", t.status().ToString());      
            // }
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
    // Create the log file
    std::filesystem::create_directories("logs");

    auto t = std::time(nullptr);
    std::tm tm = *std::localtime(&t);

    std::ostringstream oss;
    oss << "logs/log_" << std::put_time(&tm, "%Y-%m-%d_%H-%M-%S") << ".txt";

    // Write all logs to the file
    auto file_sink = std::make_shared<spdlog::sinks::basic_file_sink_mt>(oss.str(), true);

    // Only show warning or higher in terminal
    auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();
    console_sink->set_level(spdlog::level::warn);  

    std::vector<spdlog::sink_ptr> sinks {file_sink, console_sink};
    auto logger = std::make_shared<spdlog::logger>("multi_sink", sinks.begin(), sinks.end());

    logger->set_level(spdlog::level::debug);
    logger->flush_on(spdlog::level::warn);

    spdlog::set_default_logger(logger);

    spdlog::set_pattern("[%H:%M:%S] [%^%l%$] [%s:%#] %v");
    spdlog::info("Logging system initialized");
}






/*
MAIN
*/
// Start server and client services
int main(int argc, char **argv)
{
    std::cout<<"Fill Station Server\n";
    sendPayloadStartCommand();

    absl::ParseCommandLine(argc, argv);

    // Set up spdlog
    setup_logging();

    // Start the server in another thread
    std::shared_ptr<Server> server;
    RunServer(absl::GetFlag(FLAGS_server_port), server);
    std::thread serverThread(RunServer, absl::GetFlag(FLAGS_server_port), server);

    server->Shutdown();

    return 0;
}