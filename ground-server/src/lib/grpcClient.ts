"use server";

import {
  CommanderClient,
  Command,
  type CommandReply,
} from "@/proto-out/command";
import * as grpc from "@grpc/grpc-js";
import { auth } from "@/app/auth";

const client = new CommanderClient(
  "192.168.1.201:50051",
  grpc.credentials.createInsecure(),
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
