import { auth } from "@/app/auth";
import ActuationBox from '@/components/actuation-box';

export default async function Controls() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-5 p-5">
        <ActuationBox 
          title="Quick Disconnect Motor" 
          onButtonLabel="Connect" 
          offButtonLabel="Disconnect"
          onStateLabel="Connected"
          offStateLabel="Disconnected" 
          initialStateLabel="No Data" 
        />
        <ActuationBox 
          title="Ball Valve" 
          onButtonLabel="Open" 
          offButtonLabel="Close" 
          onStateLabel="Opened"
          offStateLabel="Closed"
          initialStateLabel="No Data" 
        />
        <ActuationBox 
          title="Solenoid Valve" 
          onButtonLabel="Open" 
          offButtonLabel="Close" 
          onStateLabel="Opened"
          offStateLabel="Closed"
          initialStateLabel="No Data" 
        />
        <ActuationBox 
          title="Igniter" 
          onButtonLabel="Activate" 
          offButtonLabel="Deactivate" 
          onStateLabel="Activated"
          offStateLabel="Deactivated"
          initialStateLabel="No Data" 
        />
      </div>
    </div>
  );
}
