import { auth } from "@/app/auth";
import ActuationBox from "@/components/conops/actuation-box";
import { LiveValueBox } from "@/components/conops/live-value-box";
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

export default async function Page3() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black relative text-gray-900 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Page 3: Pre-Fill</h1>

      {/* Actuation Boxes */}
      <div className="grid grid-cols-7 gap-4 w-full max-w-7xl">
        <ActuationBox
          title="Solenoid Valve 1"
          buttons={[
            { label: "Close", stateLabel: "Closed", command: { sv1Open: false }, isOn: false },
          ]}
          initialStateLabel="Closed"
          small={true}
          useSwitch={false}
        />
        <ActuationBox
          title="Ball Valve 1 (BV1)"
          buttons={[
            { label: "Close", stateLabel: "Closed", command: { bv1Open: false }, isOn: false },
          ]}
          initialStateLabel="Closed"
          small={true}
          useSwitch={false}
        />
        {/* Using mavOpen as a command place holder until i figure out what MV1 and MV2 is */}
        <ActuationBox
          title="MV1?"
          buttons={[
            { label: "Close", stateLabel: "Closed", command: { mavOpen: false }, isOn: false },
          ]}
          initialStateLabel="Closed"
          small={true}
          useSwitch={false}
        />
        <ActuationBox
          title="MV2?"
          buttons={[
            { label: "Close", stateLabel: "Closed", command: { mavOpen: false }, isOn: false },
          ]}
          initialStateLabel="Closed"
          small={true}
          useSwitch={false}
        />
        <ActuationBox
          title="MAV"
          buttons={[
            { label: "Close", stateLabel: "Closed", command: { mavOpen: false }, isOn: false },
          ]}
          initialStateLabel="Closed"
          small={true}
          useSwitch={false}
        />
        <ActuationBox
          title="Solenoid Valve 2"
          buttons={[
            { label: "Open", stateLabel: "Opened", command: { sv2Close: false }, isOn: true },
          ]}
          initialStateLabel="Open"
          small={true}
          useSwitch={false}
        />
        <ActuationBox
          title="Quick Disconnect"
          buttons={[
            { label: "Connect", stateLabel: "Connected", command: { qdRetract: false }, isOn: true },
          ]}
          initialStateLabel="Connected"
          small={true}
          useSwitch={false}
        />
      </div>

      {/* Full-Size MAV Actuation Box and PT1 Live Value */}
      <div className="flex items-center justify-between w-full max-w-7xl mt-8">
        {/* MAV Actuation Box */}
        <div className="flex-grow max-w-[600px]">
          <ActuationBox
            title="MAV Control"
            buttons={[
              { label: "Open", stateLabel: "Opened", command: { mavOpen: true }, isOn: true },
              { label: "Close", stateLabel: "Closed", command: { mavOpen: false }, isOn: false },
            ]}
            initialStateLabel="Closed"
            useSwitch={false}
          />
        </div>

        {/* PT1 Live Value Box */}
        <div className="flex-grow max-w-[300px]">
          <LiveValueBox label="PT1 Pressure" dbField="pt1" />
        </div>
      </div>

        {/* Previous Page Button */}
        <PreviousButton
        label="Previous Page"
        confirmMessage="Are you sure you want to move to the previous page?"
        href="/conops/page2" // Adjust to the correct previous page URL
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
              Are you sure the pre-fill process is complete?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page4" passHref>
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
