import TemperatureWidget from "@/components/widgets/temperature-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    label: "Temperature",
    requiresAuth: false,
    modes: ["Value", "Chart"],
    component: TemperatureWidget,
  },
];
