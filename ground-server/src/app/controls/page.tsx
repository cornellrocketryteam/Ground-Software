import { auth } from "@/app/auth";

export default async function Controls() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Logged in - Controls</div>;
}
