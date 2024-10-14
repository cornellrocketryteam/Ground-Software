import GraphWidget from "@/components/widgets/graph-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    label: "Temperature",
    unit: "°C",
    requiresAuth: false,
    dbField: "temp",
    jsonField: "temp",
    modes: ["Value", "15m Chart", "60m Chart"],
    data: [],
    component: GraphWidget,
  },
  {
    label: "Solenoid Valve 1 Continuity",
    requiresAuth: false,
    dbField: "sv1_cont",
    jsonField: "sv1Cont",
    modes: ["Value", "15m Chart", "60m Chart"],
    data: [],
    component: GraphWidget,
  },
];
