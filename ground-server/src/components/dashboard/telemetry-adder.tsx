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
import { TELEMETRY_CHANNELS } from "@/lib/telemetry-channels";

import { type TelemetryChannel } from "@/lib/definitions";
import { type Layout } from "react-grid-layout";

export function TelemetryAdder({
  setChannels,
}: {
  setChannels: Dispatch<
    SetStateAction<{ id: string; channel: TelemetryChannel; layout: Layout }[]>
  >;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="h-10 lg:text-lg">
            <PlusIcon className="h-4 w-4 xl:h-5 xl:w-5 mr-2" /> Add Channel
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <TelemetryChannelList setOpen={setOpen} setChannels={setChannels} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="h-10 lg:text-lg">
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
          <TelemetryChannelList
            setOpen={setOpen}
            setChannels={setChannels}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function TelemetryChannelList({
  setOpen,
  setChannels,
}: {
  setOpen: (open: boolean) => void;
  setChannels: Dispatch<
    SetStateAction<{ id: string; channel: TelemetryChannel; layout: Layout }[]>
  >;
}) {
  const addWidget = (channel: TelemetryChannel) => {
    const id = Date.now().toString();
    console.log(`Adding widget with id: ${id}`);

    setChannels((prevChannels) => [
      ...prevChannels,
      {
        id,
        channel,
        layout: {
          i: id,
          x: 0,
          y: 0,
          w: 3,
          h: 3,
          minW: 3,
          minH: 3,
        },
      },
    ]);
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
