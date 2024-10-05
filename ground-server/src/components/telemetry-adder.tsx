"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Telemetry, type Widget } from "@/lib/definitions";

const telemetry: Telemetry[] = [
  {
    id: "velocity",
    label: "Velocity",
  },
  {
    id: "altitude",
    label: "Altitude",
  },
  {
    id: "rssi",
    label: "RSSI",
  },
  {
    id: "longitude",
    label: "Longitude",
  },
  {
    id: "latitude",
    label: "Latitude",
  },
  {
    id: "temperature",
    label: "Temperature",
  },
  {
    id: "pressure",
    label: "Pressure",
  },
];

export function TelemetryAdder({
  setWidgets,
}: {
  setWidgets: Dispatch<SetStateAction<Widget[]>>;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="icon" className="px-2 py-2 h-15 w-15">
            <PlusIcon className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <StatusList setOpen={setOpen} setWidgets={setWidgets} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" className="px-2 py-2 h-15 w-15">
          <PlusIcon className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader hidden>
          <DrawerTitle hidden>Add telemetry</DrawerTitle>
          <DrawerDescription hidden>
            Select what telemetry datapoint to add to the dashboard
          </DrawerDescription>
        </DrawerHeader>
        <div className="border-t">
          <StatusList setOpen={setOpen} setWidgets={setWidgets} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setWidgets,
}: {
  setOpen: (open: boolean) => void;
  setWidgets: Dispatch<SetStateAction<Widget[]>>;
}) {
  const addWidget = (t: Telemetry) => {
    setWidgets((widgets) => [
      ...widgets,
      {
        value: null,
        layout: {
          i: Date.now().toString(),
          x: 0,
          y: 0,
          w: 3,
          h: 2,
          minW: 3,
          minH: 2,
        },
        telemetryType: t.label,
      },
    ]);

    setOpen(false);
  };

  return (
    <Command>
      <CommandInput placeholder="Filter datapoints..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {telemetry.map((t) => (
            <CommandItem
              key={t.id}
              id={t.id}
              onSelect={() => addWidget(t)}
            >
              {t.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
