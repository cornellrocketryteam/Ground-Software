"use server";

import { CommanderClient } from "@/proto-out/protos/command_grpc";

import { Buffer } from 'node:buffer';
import { Command, type CommandReply } from "@/proto-out/protos/command";
import * as grpc from "@grpc/grpc-js";
import { auth } from "@/app/auth";
import process from 'node:process';

function getSslCredentials() {
  const rootCA = process.env.ROOT_CA;
  const clientCert = process.env.CLIENT_CERT;
  const clientKey = process.env.CLIENT_KEY;

  if (!clientCert || !clientKey || !rootCA) {
    throw new Error('SSL certificates not found in environment variables.');
  }

  return grpc.credentials.createSsl(
    Buffer.from(rootCA, 'base64'),
    Buffer.from(clientKey, 'base64'),
    Buffer.from(clientCert, 'base64'),
  );
}

const server_path = process.env.GRPC_SERVER
if (!server_path) {
  throw new Error('gRPC Server Path not found in environment variables. (GRPC_SERVER)')
}

const client = new CommanderClient(
  server_path,
  getSslCredentials()
);

export async function isConnected() {
  const channel = client.getChannel();
  const state = channel.getConnectivityState(true); // pass true to try connecting if idle
  return state === grpc.connectivityState.READY;
}

export async function sendCommand(command: Command) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  console.log("Sending command: ", command);

  const response = await new Promise<CommandReply>((resolve, reject) => {
    client.sendCommand(Command.fromPartial(command), (err, response) => {
      if (err) {
        console.error("Error: ", err);
        return reject(err);
      }
      console.log("Received Acknowledgement: ", response);
      resolve(response);
    });
  });

  return response;
}
