import TemperatureWidget from "@/components/widgets/temperature-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    label: "Temperature",
    requiresAuth: false,
    modes: ["Value", "Chart", "15m Chart", "60m Chart"],
    component: TemperatureWidget,
  },
];
