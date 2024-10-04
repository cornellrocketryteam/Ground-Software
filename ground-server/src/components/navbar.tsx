import Image from "next/image";
import Link from "next/link";
import { auth } from "@/app/auth";

import UserAvatar from "@/components/user-avatar/user-avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

import crt from "@/app/images/crt.png";

export default async function Navbar() {
  const session = await auth();

  let pageTabs;
  if (session) {
    pageTabs = (
      <div className="flex gap-4 items-center">
        <Button variant="ghost" className="font-bold" asChild>
          <Link href="/">Telemetry</Link>
        </Button>
        <Button variant="ghost" className="font-bold" asChild>
          <Link href="/controls">Controls</Link>
        </Button>
      </div>
    );
  }

  return (
    <nav className="flex p-4 border-b-2 items-center justify-between">
      <div className="flex gap-8 items-center">
        <Image
          className="h-10 w-10"
          width={100}
          height={100}
          src={crt}
          alt="Cornell Rocketry Team Logo"
          priority={true}
        ></Image>
        {pageTabs}
      </div>
      <div className="flex gap-4 items-center">
        {/* <TelemetryAdder setWidgets={setWidgets} /> */}
        <ModeToggle />
        <UserAvatar />
      </div>
    </nav>
  );
}
