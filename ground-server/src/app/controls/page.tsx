import { auth } from "@/app/auth";
import ActuationBox from "@/components/actuation-box";

export default async function Controls() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-1 pt-2 text-center">Fill Station Commands</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
          <ActuationBox
            title="Quick Disconnect Motor"
            buttons={[
              {
                label: "Retract",
                stateLabel: "Retracted",
                command: { qdRetract: true },
                isOn: true
              },
            ]}
            initialStateLabel="No Data"
          />

          <ActuationBox
            title="Igniter"
            buttons={[
              {
                label: "Activate",
                stateLabel: "Activated",
                command: { ignite: true },
                isOn: true
              },
            ]}
            initialStateLabel="No Data"
          />

          <ActuationBox
            title="Solenoid Valve 1"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { sv1Open: true },
                isOn: true
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { sv1Open: false },
                isOn: false
              },
            ]}
            initialStateLabel="No Data"
          />

          <ActuationBox
            title="Ball Valve"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { bv1Open: true },
                isOn: true,
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { bv1Open: false },
                isOn: false,
              },
            ]}
            initialStateLabel="No Data"
            useSwitch={false}
            switchLabel="Ball Valve On/Off"
            switchOnCommand={{ bv1Off: false }}
            switchOffCommand={{ bv1Off: true }}
          />


        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-1 text-center">Rocket Commands</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
        <ActuationBox
            title="Andromeda"
            buttons={[
              {
                label: "Launch",
                stateLabel: "Launched",
                command: { fire: true },
                isOn: true
              },
            ]}
            initialStateLabel="No Data"
          />

          <ActuationBox
            title="Solenoid Valve 2"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { sv2Close: false },
                isOn: true
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { sv2Close: true },
                isOn: false
              },
            ]}
            initialStateLabel="No Data"
          />

          <ActuationBox
            title="MAV"
            buttons={[
              {
                label: "Open",
                stateLabel: "Opened",
                command: { mavOpen: true },
                isOn: true
              },
              {
                label: "Close",
                stateLabel: "Closed",
                command: { mavOpen: false },
                isOn: false
              }
            ]}
            initialStateLabel="No Data"
          />
        </div>
      </div>
    </div>
  );
}
