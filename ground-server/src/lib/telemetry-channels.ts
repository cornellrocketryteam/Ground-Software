import TemperatureWidget from "@/components/widgets/temperature-widget";
import GraphWidget from "@/components/widgets/graph-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    label: "Temperature",
    unit: "°C",
    requiresAuth: false,
    dbField: "temp",
    modes: ["Value", "Chart", "15m Chart", "60m Chart"],
    data: [],
    component: TemperatureWidget,
  },
  {
    label: "Solenoid Valve 1 Continuity",
    requiresAuth: false,
    dbField: "sv1_cont",
    modes: ["Value", "Chart", "15m Chart", "60m Chart"],
    data: [],
    component: GraphWidget,
  },
];
