#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>
#include <chrono>
#include <thread>

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

ABSL_FLAG(uint16_t, server_port, 50052, "Server port for the service");
ABSL_FLAG(std::string, client_target, "localhost:50051", "Server address");

/*
SERVER CODE
*/

// Ground Station service to receive telemetry.
class TelemeterServiceImpl final : public Telemeter::Service
{
    Status SendTelemetry(ServerContext *context, const Telemetry *request,
                         TelemetryReply *reply) override
    {
        // TODO(Zach) read request, update telemetry based on values, and set reply values
        std::cout << "Temp: " << request->temp() << std::endl;
        reply->set_ack(true);
        return Status::OK;
    }
};

// Server startup function
void RunServer(uint16_t port)
{
    std::string server_address = absl::StrFormat("0.0.0.0:%d", port);
    TelemeterServiceImpl service;

    grpc::EnableDefaultHealthCheckService(true);
    grpc::reflection::InitProtoReflectionServerBuilderPlugin();
    ServerBuilder builder;
    // Listen on the given address without any authentication mechanism.
    builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
    // Register "service" as the instance through which we'll communicate with
    // clients. In this case it corresponds to an *synchronous* service.
    builder.RegisterService(&service);
    // Finally assemble the server.
    std::unique_ptr<Server> server(builder.BuildAndStart());
    std::cout << "Server listening on " << server_address << std::endl;

    // Wait for the server to shutdown. Note that some other thread must be
    // responsible for shutting down the server for this call to ever return.
    server->Wait();
}

/*
CLIENT CODE
*/

// Client for sending telemetry
class GroundStationClient
{
public:
    GroundStationClient(std::shared_ptr<Channel> channel)
        : stub_(Commander::NewStub(channel)) {}

    // TODO(Zach) add parameters for commanding
    bool SendCommand(const std::string &temp)
    {
        // Data we are sending to the server.
        Command cmd;
        // TODO(Zach) add parameters for commanding
        cmd.set_temp(temp);

        // Container for the Ack
        CommandReply reply;

        // Context for the client. It could be used to convey extra information to
        // the server and/or tweak certain RPC behaviors.
        ClientContext context;

        // The actual RPC.
        Status status = stub_->SendCommand(&context, cmd, &reply);

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
    std::unique_ptr<Commander::Stub> stub_;
};

/*
MAIN
*/

// Start server and client services
int main(int argc, char **argv)
{
    absl::ParseCommandLine(argc, argv);
    // Start the server in another thread
    std::thread serverThread(RunServer, absl::GetFlag(FLAGS_server_port));
    // Instantiate the client. It requires a channel, out of which the actual RPCs
    // are created. This channel models a connection to an endpoint specified by
    // the argument "--client_target=" which is the only expected argument.
    std::string target_str = absl::GetFlag(FLAGS_client_target);
    // We indicate that the channel isn't authenticated (use of
    // InsecureChannelCredentials()).
    GroundStationClient fillStation(
        grpc::CreateChannel(target_str, grpc::InsecureChannelCredentials()));

    // TODO(Zach) tie into command interface and populate SendCommand
    // Sleep for a second
    std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    while(true) {
        std::string temp;
        std::cout << "Enter command: ";
        std::cin >> temp;
        if (temp == "q") break;
        bool reply = fillStation.SendCommand(temp);

        // Check reply
        if (reply)
        {
            printf("Fill Station acknowledged\n");
        }
        else
        {
            printf("Fill Station did not acknowledge\n");
        }
    }
    return 0;
}