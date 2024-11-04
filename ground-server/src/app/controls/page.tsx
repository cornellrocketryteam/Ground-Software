import { auth } from "@/app/auth";
import ActuationBox from "@/components/actuation-box";

export default async function Controls() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 p-5">
        <ActuationBox
          title="Quick Disconnect Motor"
          onButtonLabel="Connect"
          onStateLabel="Connected"
          onCommand={{
            qdRetract: false,
          }}
          offButtonLabel="Disconnect"
          offStateLabel="Disconnected"
          offCommand={{
            qdRetract: true,
          }}
          initialStateLabel="No Data"
        />

        <ActuationBox
          title="Igniter"
          onButtonLabel="Activate"
          onStateLabel="Activated"
          onCommand={{
            ignite: true,
          }}
          offButtonLabel="Deactivate"
          offStateLabel="Deactivated"
          offCommand={{
            ignite: false,
          }}
          initialStateLabel="No Data"
        />

        <ActuationBox
          title="Ball Valve Open/Closed"
          onButtonLabel="Open"
          onStateLabel="Opened"
          onCommand={{
            bv1Open: true,
          }}
          offButtonLabel="Close"
          offStateLabel="Closed"
          offCommand={{
            bv1Open: false,
          }}
          initialStateLabel="No Data"
        />

        <ActuationBox
          title="Ball Valve On/Off"
          onButtonLabel="On"
          onStateLabel="On"
          onCommand={{
            bv1Off: false,
          }}
          offButtonLabel="Off"
          offStateLabel="Off"
          offCommand={{
            bv1Off: true,
          }}
          initialStateLabel="No Data"
        />

        <ActuationBox
          title="Solenoid Valve 1"
          onButtonLabel="Open"
          onStateLabel="Opened"
          onCommand={{
            sv1Open: true,
          }}
          offButtonLabel="Close"
          offStateLabel="Closed"
          offCommand={{
            sv1Open: false,
          }}
          initialStateLabel="No Data"
        />

        <ActuationBox
          title="Solenoid Valve 2"
          onButtonLabel="Open"
          onStateLabel="Opened"
          onCommand={{
            sv2Close: false,
          }}
          offButtonLabel="Close"
          offStateLabel="Closed"
          offCommand={{
            sv2Close: true,
          }}
          initialStateLabel="No Data"
        />
      </div>
    </div>
  );
}
