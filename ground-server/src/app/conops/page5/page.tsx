import { auth } from "@/app/auth";
import ActuationBox from "@/components/actuation-box";
import { LiveValueWithHistoricalGraph } from "@/components/live-value-with-historical-graph";
import { CameraBox } from "@/components/camera-box";
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

export default async function Page5() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Page 5: QD Mode</h1>

      {/* Live Value with Historical Graph and Camera Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
        <LiveValueWithHistoricalGraph
          label="Pressure Transducer 2 (PT2)"
          dbField="pt2"
          chartMode="15m"
        />
        <CameraBox text="Camera pointing at QD" />
      </div>

      {/* Actuation Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mt-8">
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
          useSwitch={false}
        />
        <ActuationBox
          title="Quick Disconnect Motor"
          buttons={[
            {
              label: "Retract",
              stateLabel: "Retracted",
              command: { qdRetract: true },
              isOn: true,
            },
          ]}
          initialStateLabel="No Data"
          useSwitch={false}
        />
      </div>

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
              Are you sure the QD has been retracted?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page6" passHref>
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