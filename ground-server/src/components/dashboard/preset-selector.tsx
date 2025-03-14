"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronUpIcon } from "@radix-ui/react-icons";

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
import { PRESETS } from "@/lib/dashboard-presets";

import type { TelemetryChannel, Preset } from "@/lib/definitions";
import { type Layout } from "react-grid-layout";

export function PresetSelector({
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
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ChevronUpIcon className="h-4 w-4 xl:h-5 xl:w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="end">
          <PresetList setOpen={setOpen} setChannels={setChannels} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <ChevronUpIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader hidden>
          <DrawerTitle hidden>Set preset</DrawerTitle>
          <DrawerDescription hidden>
            Select what telemetry preset to use for the dashboard
          </DrawerDescription>
        </DrawerHeader>
        <div className="border-t">
          <PresetList setOpen={setOpen} setChannels={setChannels} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function PresetList({
  setOpen,
  setChannels,
}: {
  setOpen: (open: boolean) => void;
  setChannels: Dispatch<
    SetStateAction<{ id: string; channel: TelemetryChannel; layout: Layout }[]>
  >;
}) {
  const selectPreset = (preset: Preset) => {
    console.log("Selected preset:", preset);
    setChannels([]);
    setOpen(false);
  };

  return (
    <Command>
      <CommandInput placeholder="Filter presets..." />
      <CommandList>
        <CommandEmpty>No presets found.</CommandEmpty>
        <CommandGroup>
          {PRESETS.map((preset) => (
            <CommandItem
              key={preset.label}
              value={preset.label}
              onSelect={() => selectPreset(preset)}
            >
              {preset.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
