"use client"

import { useState } from 'react';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { TelemetryAdder } from "@/components/telemetry-adder";
import { Dashboard } from "@/components/dashboard/dashboard";

import { type Widget } from '@/lib/definitions';


export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([])

  return (
    <>
      <nav className="flex p-4 border-b-2 items-center justify-between">
        <div>
          Cornell Rocketry (Logo)
        </div>
        <div className="flex gap-4">
          <TelemetryAdder setWidgets={setWidgets} />
          <ModeToggle />
          <Avatar>
            <AvatarImage src="https://github.com/maxslarsson.png" alt="@maxslarsson" />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
        </div>
      </nav>
      <main>
        <Dashboard widgets={widgets} setWidgets={setWidgets} />
      </main>
    </>
  );
}
