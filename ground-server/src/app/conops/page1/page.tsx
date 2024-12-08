import { auth } from "@/app/auth";
import { LiveValueBox } from "@/components/live-value-box";
import { Button } from "@/components/ui/button";
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

export default async function Conops() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-white dark:bg-black relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Page 1: Sensor Checks</h1>
      <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
        <LiveValueBox label="Pressure Transducer 1 (PT1)" dbField="pt1" />
        <LiveValueBox label="Pressure Transducer 2 (PT2)" dbField="pt2" />
        <LiveValueBox label="Load Cell 1 (LC1)" dbField="lc1" />
        <LiveValueBox label="RTD Temperature (RTD)" dbField="rtdTemp" />
        <LiveValueBox label="Pressure Transducer 3 (PT3)" dbField="pt3" />
        <LiveValueBox label="Pressure Transducer 4 (PT4)" dbField="pt4" />
      </div>
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
              Are you sure all sensors are displaying correct values?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <Link href="/conops/page2" passHref>
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
