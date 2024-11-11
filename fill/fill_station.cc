#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>
#include <random>

#include "actuators/qd.h"
#include "actuators/ball_valve.h"
#include "actuators/sol_valve.h"

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
using command::TelemetryRequest;
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

ABSL_FLAG(uint16_t, server_port, 50051, "Server port for the service");

FillStationTelemetry generateRandomTelemetry() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> float_dist(-100.0, 100.0);
    std::uniform_int_distribution<> int_dist(-100000, 100000);
    std::uniform_int_distribution<> uint_dist(0, 100000);
    std::uniform_int_distribution<> bool_dist(0, 1);
    std::uniform_int_distribution<> sensor_dist(0, 2);
    std::uniform_int_distribution<> flight_dist(0, 5);

    FillStationTelemetry telemetry;
    telemetry.set_timestamp(std::time(0));
    telemetry.set_pt1(float_dist(gen));
    telemetry.set_pt2(float_dist(gen));
    telemetry.set_lc1(float_dist(gen));
    telemetry.set_sv1_cont(float_dist(gen));
    telemetry.set_ign1_cont(float_dist(gen));
    telemetry.set_ign2_cont(float_dist(gen));

    return telemetry;
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
        if (request->sv2_close()){
            // send TCP command to rocket_controller 
        }
        if (request->mav_open()){
            // send TCP command to rocket_controller 
        }
        if (request->fire()){
            // send TCP command to rocket_controller 
        }
        return Status::OK;
    }
};

// Fill Station service to stream telemetry.
class TelemeterServiceImpl final : public FillStationTelemeter::Service
{
    Status StreamTelemetry(ServerContext *context, const TelemetryRequest *request,
                       ServerWriter<FillStationTelemetry> *writer) override
    {
        while (true) {
            auto now = std::chrono::high_resolution_clock::now();
            FillStationTelemetry t = generateRandomTelemetry();
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
    std::thread serverThread(RunServer, absl::GetFlag(FLAGS_server_port), server);

    server->Shutdown();

    return 0;
}