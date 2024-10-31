"use server";

import {
  CommanderClient,
  type Command,
  type CommandReply,
} from "@/proto-out/command";
import * as grpc from "@grpc/grpc-js";
import { auth } from "@/app/auth";

const client = new CommanderClient(
  "fill-station:50051",
  grpc.credentials.createInsecure()
);

export async function sendCommand(command: Command) {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await new Promise<CommandReply>((resolve, reject) => {
    client.sendCommand(command, (err, response) => {
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
