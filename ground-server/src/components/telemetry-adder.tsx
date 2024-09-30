"use client"

import { useState, type Dispatch, type SetStateAction } from "react"
import { PlusIcon } from "@radix-ui/react-icons"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Widget } from "@/lib/definitions";

type Status = {
  value: string
  label: string
}

const statuses: Status[] = [
  {
    value: "velocity",
    label: "Velocity",
  },
  {
    value: "altitude",
    label: "Altitude",
  },
  {
    value: "rssi",
    label: "RSSI",
  },
  {
    value: "longitude",
    label: "Longitude",
  },
  {
    value: "latitude",
    label: "Latitude",
  },
  {
    value: "temperature",
    label: "Temperature",
  },
  {
    value: "pressure",
    label: "Pressure",
  },
]

export function TelemetryAdder({
  setWidgets,
}: {
  setWidgets: Dispatch<SetStateAction<Widget[]>>
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="px-2 py-2 h-9 w-9">
            <PlusIcon className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setWidgets={setWidgets} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="px-2 py-2 h-9 w-9">
          <PlusIcon className="h-[1.2rem] w-[1.2rem]"/>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setWidgets={setWidgets} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setWidgets,
}: {
  setOpen: (open: boolean) => void
  setWidgets: Dispatch<SetStateAction<Widget[]>>
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter datapoints..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={() => {
                setWidgets((widgets) => [...widgets, {
                  children: <div>{status.label}</div>,
                  layout: {
                    i: widgets.length.toString(),
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                  }
                }])

                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
