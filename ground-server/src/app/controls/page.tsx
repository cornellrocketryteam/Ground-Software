import { auth } from "@/app/auth";
import ControlsPage from "./ControlsPage";


export default async function Controls() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <ControlsPage />
}
