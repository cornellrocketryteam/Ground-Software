import GraphWidget from "@/components/widgets/graph-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    id: "sv1_cont",
    label: "Solenoid Valve 1 Continuity",
    requiresAuth: false,
    dbField: "sv1_cont",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
];
