import { auth } from "@/app/auth";
import ActuationBox from "@/components/conops/actuation-box";
import { CameraBox } from "@/components/conops/camera-box";
import PreviousButton from "@/components/conops/previous-button"; 

export default async function Page7() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Page 7: Launch</h1>

      {/* Row with Camera Box */}
      <div className="w-full max-w-7xl mb-8">
        <CameraBox text="Camera pointing at rocket" />
      </div>

      {/* Row with Actuation Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl">
        {/* Actuation Box for SV2 */}
        <div className="flex justify-center">
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
        </div>

        {/* Actuation Box for Launch */}
        <div className="flex justify-center">
          <ActuationBox
            title="Andromeda"
            buttons={[
              {
                label: "Launch",
                stateLabel: "Launched",
                command: { launch: true },
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
        href="/conops/page6" // Adjust to the correct previous page URL
        className="left-6 right-auto"
      />

    </div>
  );
}
