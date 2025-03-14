#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>
#include <random>
#include <spdlog/spdlog.h>

#include "actuators/qd.h"
#include "actuators/ball_valve.h"
#include "actuators/sol_valve.h"
#include "actuators/ignitor.h"

#include "sensors/sensor.h"
#include "umbilical/proto_build.h"

#include "storage/storage.h" 

#include "wiringPi.h"

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

/* Database */
DataBase db; 

const int PORT_NUMBER = 50051;

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

RocketUmbTelemetry readUmbTelemetry() {
    return protoBuild.buildProto();
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

        if (request->has_vent_and_ignite()) {
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

// Server startup function
void RunServer(uint16_t port, std::shared_ptr<Server> server)
{
    std::string server_address = "0.0.0.0:" + std::to_string(port); 

    CommanderServiceImpl commander_service;
  
    grpc::EnableDefaultHealthCheckService(true);
    grpc::reflection::InitProtoReflectionServerBuilderPlugin();
    ServerBuilder builder;
    // Listen on the given address without any authentication mechanism.
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    // Register services.
    builder.RegisterService(&commander_service);
    // Finally assemble the server.
    server = builder.BuildAndStart();

    spdlog::info("Server listening on {}\n", server_address); 

    // Wait for the server to shutdown. Note that some other thread must be
    // responsible for shutting down the server for this call to ever return.
    server->Wait();
}

// Thread functions for reading telemetry 
void fill_telemetry_thread() {
    while(true){
        db.writeFillStationTelemetry(readTelemetry());
    }
}

void umb_telemetry_thread() {
    while(true){
        db.writeUmbilicalTelemetry(readUmbTelemetry());
    }
}

/*
MAIN
*/
// Start server and client services
int main(int argc, char **argv)
{
    // start telemetry threads 
    std::thread fill_thread(fill_telemetry_thread);
    std::thread umb_thread(umb_telemetry_thread);

    // Start the server in another thread
    std::shared_ptr<Server> server;
    RunServer(PORT_NUMBER, server);
    std::thread serverThread(RunServer, PORT_NUMBER, server);

    server->Shutdown();

    return 0;
}