"use server";

var PROTO_PATH = __dirname + '/../../../../../protos/command.proto';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';


// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var command = protoDescriptor.command;

var client = new command.Commander('fill-station:50051', grpc.credentials.createInsecure());

export async function runSendCommand() {
  var command = {
    sv1_open: false,
    bv1_open: false,
    bv1_off: false,
    qd_retract: false,
    ignite: false,
    sv2_close: false,
    mav_open: false,
    fire: false
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