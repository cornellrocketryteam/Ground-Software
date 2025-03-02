#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>
#include <random>
#include <spdlog/spdlog.h>
#include "lib/WDT/wdt.h"

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
        }

        if (request->has_bv1_open()){ // ensure request contains bv1_open
            if (request->bv1_open()){
                ball_valve.open();
            } else {
                ball_valve.close();
            }
        }

        if (request->has_bv1_off()){ // ensure request contains bv1_off
            if (request->bv1_off()){
                ball_valve.powerOff();
            } else {
                ball_valve.powerOn();
            }
        }
        if(request->has_sv1_open()){
            if(request->sv1_open()){
                sv1.openAsync();
            } else{
                sv1.close();
            }
        }
        if (request->has_ignite()){
            if (request->ignite()){
                ignitor.Actuate();
            }
        }
    
        protoBuild.sendCommand(request);

        return Status::OK;
    }
};

// helper for the wdt 
void close_ball_valve(){
    ball_valve.close();
}

// Fill Station service to stream telemetry.
class TelemeterServiceImpl final : public FillStationTelemeter::Service
{
    Status StreamTelemetry(ServerContext *context, const FillStationTelemetryRequest *request,
                       ServerWriter<FillStationTelemetry> *writer) override
    {
        spdlog::info("Received initial connection point for the fill-station telemetry service.\n");

        // start the 10 second watchdog timer
        WatchdogTimer grpc_wdt(std::chrono::milliseconds(10000),close_ball_valve); 

        while (true) {  
            if (context->IsCancelled()){ 
                spdlog::warn("Lost connection to the telemetry stream.\n");
            }

            FillStationTelemetry t = readTelemetry();
            if (!writer->Write(t)) {
                // Broken stream
                return Status::CANCELLED; 
            }
            // pet the dog if we successfully write the stream
            grpc_wdt.pet();
        }
        return Status::OK;
    }
};

class RocketTelemeterServiceImpl final : public RocketTelemeter::Service 
{
    Status StreamTelemetry(ServerContext *context, const RocketTelemetryRequest *request,
                       ServerWriter<RocketTelemetry> *writer) override
    {
        spdlog::info("Received initial connection point for the rocket telemetry service.\n");

        std::chrono::steady_clock::time_point errorStartTime; // gives rocket 25 seconds to reconnect 
        bool errorTimerStarted = false;
        constexpr std::chrono::seconds errorThreshold(25);

        while (true) {
            absl::StatusOr<RocketTelemetry> t = protoBuild.buildProto();
            
            if (t.ok()) {
                // Operation was successful, access the value
                if (!writer->Write(*t)) {
                    // Broken stream
                    return Status::CANCELLED; 
                }

                errorTimerStarted = false;
            } else {
                spdlog::error("Error reading the full packet with message:\n");      
                std::cout << t.status() << std::endl;     

                // starts timer 
                if (!errorTimerStarted) { 
                    errorStartTime = std::chrono::steady_clock::now();
                    errorTimerStarted = true;
                } else {
                    if (std::chrono::steady_clock::now() - errorStartTime >= errorThreshold) {
                        spdlog::warn("Could not reconnect to rocket. Closing the ball valve.\n");
                        ball_valve.close();
                    }
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
    std::thread serverThread(RunServer, absl::GetFlag(FLAGS_server_port), server);

    server->Shutdown();

    return 0;
}