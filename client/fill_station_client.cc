#include <stdio.h>
#include <iostream>
#include <memory>
#include <string>

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"

#include <grpcpp/grpcpp.h>

#include "protos/telemetry.grpc.pb.h"

ABSL_FLAG(std::string, target, "localhost:50051", "Server address");

using grpc::Channel;
using grpc::ClientContext;
using grpc::Status;
using telemetry::Telemeter;
using telemetry::Telemetry;
using telemetry::TelemetryReply;

class FillStationClient {
public:
    FillStationClient(std::shared_ptr<Channel> channel)
        : stub_(Telemeter::NewStub(channel)) {}
    
    bool SendTelemetry(const std::string& temp) {
        // Data we are sending to the server.
        Telemetry telem;
        telem.set_temp(temp);

        // Container for the Ack
        TelemetryReply reply;

        // Context for the client. It could be used to convey extra information to
        // the server and/or tweak certain RPC behaviors.
        ClientContext context;

        // The actual RPC.
        Status status = stub_->SendTelemetry(&context, telem, &reply);

        // Act upon its status.
        if (status.ok()) {
        return reply.ack();
        } else {
            std::cout << status.error_code() << ": " << status.error_message()
                << std::endl;
            return false;
        }
    }
private:
    std::unique_ptr<Telemeter::Stub> stub_;
};

int main(int argc, char** argv) {
    absl::ParseCommandLine(argc, argv);
    // Instantiate the client. It requires a channel, out of which the actual RPCs
    // are created. This channel models a connection to an endpoint specified by
    // the argument "--target=" which is the only expected argument.
    std::string target_str = absl::GetFlag(FLAGS_target);
    // We indicate that the channel isn't authenticated (use of
    // InsecureChannelCredentials()).
    FillStationClient fillStation(
        grpc::CreateChannel(target_str, grpc::InsecureChannelCredentials()));
    std::string temp("It works!");
    bool reply = fillStation.SendTelemetry(temp);
    if (reply) {
        printf("Server acknowledged\n");
    } else {
        printf("Server did not acknowledge\n");
    }

    return 0;
}