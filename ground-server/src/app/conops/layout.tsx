// app/conops/layout.tsx
import { auth } from "@/app/auth";

export default async function ConopsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <>{children}</>;
}
