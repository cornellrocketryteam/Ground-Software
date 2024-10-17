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
        <ActuationBox title="Quick Disconnect Motor"/>
        <ActuationBox title="Ball Valve"/>
        <ActuationBox title="Solenoid Valve"/>
        <ActuationBox title="Igniter"/>
      </div>
    </div>
  );
}
