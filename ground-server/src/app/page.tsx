"use client";

import { useState } from "react";
import Image from "next/image";
import { SessionProvider } from "next-auth/react";

import { UserAvatar } from "@/components/user-avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { TelemetryAdder } from "@/components/telemetry-adder";
import { Dashboard } from "@/components/dashboard/dashboard";
import crt from "./images/crt.png";

import { type Widget } from "@/lib/definitions";

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  return (
    <SessionProvider>
      <nav className="flex p-4 border-b-2 items-center justify-between">
        <Image
          className="h-10 w-10"
          width={100}
          height={100}
          src={crt}
          alt="Cornell Rocketry Team"
          priority={true}
        ></Image>
        <div className="flex gap-4">
          <TelemetryAdder setWidgets={setWidgets} />
          <ModeToggle />
          <UserAvatar />
        </div>
      </nav>
      <main>
        <Dashboard widgets={widgets} setWidgets={setWidgets} />
      </main>
    </SessionProvider>
  );
}
