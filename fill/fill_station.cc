#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>
#include <cstdlib>

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
using command::TelemetryRequest;
using grpc::Channel;
using grpc::ClientContext;
using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::ServerWriter;
using grpc::Status;

ABSL_FLAG(uint16_t, server_port, 50051, "Server port for the service");

/*
SERVER CODE
*/

// Fill Station service to accept commands.
class CommanderServiceImpl final : public Commander::Service
{
    Status SendCommand(ServerContext *context, const Command *request,
                       CommandReply *reply) override
    {
        // TODO(Zach) read request, execute the command and set reply values
        reply->set_ack(true);
        float temp = 3.14;
        reply->mutable_telemetry()->set_temp(temp);
        // reply->set_telemetry(temp);
        return Status::OK;
    }
};

// Fill Station service to stream telemetry.
class TelemeterServiceImpl final : public Telemeter::Service
{
    Status StreamTelemetry(ServerContext *context, const TelemetryRequest *request,
                       ServerWriter<Telemetry> *writer) override
    {
        for (int i = 0; i < 10; i++) {
            Telemetry t;
            t.set_temp(rand() % 100);
            if (!writer->Write(t)) {
                // Broken stream
                return Status::CANCELLED; 
            }
            sleep(1);
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