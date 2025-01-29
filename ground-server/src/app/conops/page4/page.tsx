import { auth } from "@/app/auth";
import { LiveValueWithHistoricalGraph } from "@/components/live-value-with-historical-graph";
import { CameraBox } from "@/components/camera-box";
import ActuationBox from "@/components/actuation-box";
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
import PreviousButton from "@/components/previous-button"; 

export default async function Page4() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Page 4: Fill</h1>

      {/* Live Value and Historical Graph Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
        <LiveValueWithHistoricalGraph
          label="RTD Temperature"
          dbField="rtdTemp"
          chartMode="15m"
        />
        <LiveValueWithHistoricalGraph
          label="Load Cell 1 (LC1)"
          dbField="lc1"
          chartMode="60m"
        />
        <LiveValueWithHistoricalGraph
          label="Pressure Transducer 4 (PT4)"
          dbField="pt4"
          chartMode="15m"
        />
        <LiveValueWithHistoricalGraph
          label="Pressure Transducer 1 (PT1)"
          dbField="pt1"
          chartMode="60m"
        />
      </div>

      {/* Camera and Actuation Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mt-8">
        {/* Camera Box */}
        <div className="col-span-1 w-80">
          <CameraBox text="Camera pointing at BV1" />
        </div>
        {/* Actuation Boxes */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ActuationBox
            title="Solenoid Valve 2"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { sv2Close: false },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { sv2Close: true },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            compactLayout={true}
            useSwitch={false}
          />
          <ActuationBox
            title="Ball Valve"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opening",
                command: { bv1Open: true },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closing",
                command: { bv1Open: false },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={true}
            switchLabel="Ball Valve On/Off"
            switchOnCommand={{ bv1Off: false }}
            switchOffCommand={{ bv1Off: true }}
            compactLayout={true}
          />
        </div>
      </div>

    {/* Previous Page Button */}
      <PreviousButton
        label="Previous Page"
        confirmMessage="Are you sure you want to move to the previous page?"
        href="/conops/page3" // Adjust to the correct previous page URL
        className="left-6 right-auto"
      />

      {/* Alert Dialog Button */}
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
              Are you sure the fill process is complete?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page5" passHref>
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
