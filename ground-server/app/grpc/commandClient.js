"use server";
var PROTO_PATH = __dirname + '/../../../../../protos/command.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');


// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var command = protoDescriptor.command;

var client = new command.Commander('localhost:50051', grpc.credentials.createInsecure());

export async function runSendCommand() {
    var command = {
        temp: 'Goodbye'
    };
    console.log(command);
    
    const response = await new Promise((resolve, reject) => {
        client.sendCommand(command, (err, response) => {
            if (err) {
                console.error('Error: ', err);
                return reject(err);
            }
            console.log('Received Acknowledgement: ', response);
            resolve(response);
        });
    });
    return response;
}


exports.runSendCommand = runSendCommand;