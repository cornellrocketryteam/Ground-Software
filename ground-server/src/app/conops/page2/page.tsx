import { auth } from "@/app/auth";
import ActuationBox from "@/components/conops/actuation-box";
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

export default async function Page2() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black relative text-gray-900 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Page 2: Actuation Checks</h1>

      {/* Actuation Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
        <ActuationBox
          title="MAV"
          buttons={[
            { label: "Open", stateLabel: "Opened", command: { mavOpen: true }, isOn: true },
            { label: "Close", stateLabel: "Closed", command: { mavOpen: false }, isOn: false },
          ]}
          initialStateLabel="No Data"
          useSwitch={false}
        />
        <ActuationBox
          title="Solenoid Valve 1 (SV1)"
          buttons={[
            { label: "Open", stateLabel: "Opened", command: { sv1Open: true }, isOn: true },
            { label: "Close", stateLabel: "Closed", command: { sv1Open: false }, isOn: false },
          ]}
          initialStateLabel="No Data"
          useSwitch={false}
        />
        <ActuationBox
          title="Quick Disconnect Motor (QD)"
          buttons={[
            { label: "Retract", stateLabel: "Retracted", command: { qdRetract: true }, isOn: true },
          ]}
          initialStateLabel="No Data"
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
          />
        <ActuationBox
          title="Solenoid Valve 2 (SV2)"
          buttons={[
            { label: "Open", stateLabel: "Opened", command: { sv2Close: false }, isOn: true },
            { label: "Close", stateLabel: "Closed", command: { sv2Close: true }, isOn: false },
          ]}
          initialStateLabel="No Data"
          useSwitch={false}
        />
      </div>

        {/* Previous Page Button */}
        <PreviousButton
        label="Previous Page"
        confirmMessage="Are you sure you want to move to the previous page?"
        href="/conops/page1" // Adjust to the correct previous page URL
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
              Are you sure all actuators are functioning correctly?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page3" passHref>
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
