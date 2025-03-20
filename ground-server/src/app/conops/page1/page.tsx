"use client";

import { LiveValueBox } from "@/components/conops/live-value-box";
import { TELEMETRY_CHANNELS } from "@/lib/telemetry-channels";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function Conops() {
  // Precompute channels so we only do the lookup once
  const channels = TELEMETRY_CHANNELS.filter((c) =>
    ["pt1", "pt2", "lc1", "rtd_temp", "pt3", "pt4"].includes(c.dbField),
  );

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black relative">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Page 1: Sensor Checks
      </h1>

      <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
        {channels.map((channel) => (
          <LiveValueBox
            key={channel.dbField}
            measurement={channel.dbMeasurements[0]}
            channel={channel}
          />
        ))}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="default"
            className="fixed bottom-6 right-6 px-6 py-6 text-lg rounded-lg shadow-lg"
          >
            {"Next Page"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Next Page</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure all sensors are displaying correct values?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page2" passHref>
              <AlertDialogAction asChild>
                <button>Yes</button>
              </AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
