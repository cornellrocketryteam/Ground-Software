"use client";

import ActuationBox from "@/components/conops/actuation-box";
import { LiveValueWithHistoricalGraph } from "@/components/conops/live-value-with-historical-graph";
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
import { Button } from "@/components/ui/button";
import PreviousButton from "@/components/conops/previous-button";

export default function Page6() {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Page 6: Arm Igniter
      </h1>

      {/* Row with Live Value and Actuation Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
        {/* 1-minute chart for igniter current */}
        <LiveValueWithHistoricalGraph
          channel={{
            label: "Igniter Current",
            dbMeasurement: "Umbilical",
            dbField: "igniterCurrent",
          }}
          duration={1}
        />

        <div className="flex justify-center">
          <ActuationBox
            title="Igniter"
            buttons={[
              {
                label: "Arm",
                stateLabel: "Armed",
                command: { ignite: true },
                isOn: true,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
          />
        </div>
      </div>

      {/* Previous Page Button */}
      <PreviousButton
        label="Previous Page"
        confirmMessage="Are you sure you want to move to the previous page?"
        href="/conops/page5" // Adjust to the correct previous page URL
        className="left-6 right-auto"
      />

      {/* Next Page Button */}
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
              Are you sure the igniter is armed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page7" passHref>
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
