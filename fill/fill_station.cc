#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>

#include "telemetry_reader.h"

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/strings/str_format.h"

#include <grpcpp/ext/proto_server_reflection_plugin.h>
#include <grpcpp/grpcpp.h>
#include <grpcpp/health_check_service_interface.h>

#include "protos/telemetry.grpc.pb.h"
#include "protos/command.grpc.pb.h"

using command::Command;
using command::Commander;
using command::CommandReply;
using grpc::Channel;
using grpc::ClientContext;
using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::Status;
using telemetry::Telemeter;
using telemetry::Telemetry;
using telemetry::TelemetryReply;

ABSL_FLAG(uint16_t, server_port, 50051, "Server port for the service");
ABSL_FLAG(std::string, client_target, "localhost:50052", "Server address");

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
        return Status::OK;
    }
};

// Server startup function
void RunServer(uint16_t port, std::shared_ptr<Server> server)
{
    std::string server_address = absl::StrFormat("0.0.0.0:%d", port);
    CommanderServiceImpl service;

    grpc::EnableDefaultHealthCheckService(true);
    grpc::reflection::InitProtoReflectionServerBuilderPlugin();
    ServerBuilder builder;
    // Listen on the given address without any authentication mechanism.
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    // Register "service" as the instance through which we'll communicate with
    // clients. In this case it corresponds to an *synchronous* service.
    builder.RegisterService(&service);
    // Finally assemble the server.
    server = builder.BuildAndStart();
    // std::unique_ptr<Server> server(builder.BuildAndStart());
    std::cout << "Server listening on " << server_address << std::endl;

    // Wait for the server to shutdown. Note that some other thread must be
    // responsible for shutting down the server for this call to ever return.
    server->Wait();
}

/*
CLIENT CODE
*/

// Client for sending telemetry
class FillStationClient
{
public:
    FillStationClient(std::shared_ptr<Channel> channel)
        : stub_(Telemeter::NewStub(channel)) {}

    // TODO(Zach) add telemetry parameters
    bool SendTelemetry(const std::string &temp)
    {
        TelemetryReader reader;
        Telemetry telem = reader.read();

        // Container for the Ack
        TelemetryReply reply;

        // Context for the client. It could be used to convey extra information to
        // the server and/or tweak certain RPC behaviors.
        ClientContext context;

        // The actual RPC.
        Status status = stub_->SendTelemetry(&context, telem, &reply);

        // Act upon its status.
        if (status.ok())
        {
            // TODO(Zach) do something with reply?
            return reply.ack();
        }
        else
        {
            std::cout << status.error_code() << ": " << status.error_message()
                      << std::endl;
            return false;
        }
    }

private:
    std::unique_ptr<Telemeter::Stub> stub_;
};

/*
MAIN
*/

// Start server and client services
int main(int argc, char **argv)
{
    absl::ParseCommandLine(argc, argv);
    // Start the server in another thread
    std::shared_ptr<Server> server;
    std::thread serverThread(RunServer, absl::GetFlag(FLAGS_server_port), server);

    // Instantiate the client. It requires a channel, out of which the actual RPCs
    // are created. This channel models a connection to an endpoint specified by
    // the argument "--client_target=" which is the only expected argument.
    std::string target_str = absl::GetFlag(FLAGS_client_target);
    // We indicate that the channel isn't authenticated (use of
    // InsecureChannelCredentials()).
    FillStationClient fillStation(
        grpc::CreateChannel(target_str, grpc::InsecureChannelCredentials()));

    // TODO(Zach) tie into command interface and populate SendTelemetry
    std::string temp("It works!");
    while (true)
    {
        bool reply = fillStation.SendTelemetry(temp);

        // Check reply
        if (reply)
        {
            printf("Ground Station acknowledged\n");
        }
        else
        {
            printf("Ground Station did not acknowledge\n");
        }
        // Sleep for a second
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }
    server->Shutdown();
    return 0;
}