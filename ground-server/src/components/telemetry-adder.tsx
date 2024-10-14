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
import { type TelemetryChannel, type Widget } from "@/lib/definitions";
import { TELEMETRY_CHANNELS } from "@/lib/telemetry-channels";

export default function TelemetryAdder({
  setWidgets,
  widgetsRef,
}: {
  setWidgets: Dispatch<SetStateAction<Widget[]>>;
  widgetsRef: React.MutableRefObject<Widget[]>;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="px-4 py-2 md:py-3 md:px-5 lg:py-5 lg:text-lg">
            <PlusIcon className="h-4 w-4 xl:h-5 xl:w-5 mr-2" /> Add Channel
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <StatusList setOpen={setOpen} setWidgets={setWidgets} widgetsRef={widgetsRef} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="px-4 py-2 md:py-3 md:px-5 lg:py-5 lg:text-lg">
          <PlusIcon className="h-4 w-4 xl:h-5 xl:w-5 mr-2" /> Add Channel
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader hidden>
          <DrawerTitle hidden>Add telemetry</DrawerTitle>
          <DrawerDescription hidden>
            Select what telemetry channel to add to the dashboard
          </DrawerDescription>
        </DrawerHeader>
        <div className="border-t">
          <StatusList setOpen={setOpen} setWidgets={setWidgets} widgetsRef={widgetsRef} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setWidgets,
  widgetsRef,
}: {
  setOpen: (open: boolean) => void;
  setWidgets: Dispatch<SetStateAction<Widget[]>>;
  widgetsRef: React.MutableRefObject<Widget[]>;
}) {
  const addWidget = (channel: TelemetryChannel) => {
    const id = Date.now().toString()
    console.log(`Adding widget with id: ${id}`)
    const newWidget = {
      channel: channel,
      layout: {
        i: id,
        x: 0,
        y: 0,
        w: 3,
        h: 3,
        minW: 3,
        minH: 3,
      },
      id: id
    }
    widgetsRef.current.push(newWidget); // Add to ref first
    setWidgets(widgetsRef.current);

    setOpen(false);
  };

  return (
    <Command>
      <CommandInput placeholder="Filter channels..." />
      <CommandList>
        <CommandEmpty>No channels found.</CommandEmpty>
        <CommandGroup>
          {TELEMETRY_CHANNELS.map((channel) => (
            <CommandItem
              key={channel.label}
              value={channel.label}
              onSelect={() => addWidget(channel)}
            >
              {channel.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
