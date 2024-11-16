import FuelWidget from "@/components/widgets/fuel-widget";
import GraphWidget from "@/components/widgets/graph-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";

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
  {
    id: "fuel",
    label: "Fuel",
    requiresAuth: false,
    dbField: "fuel",
    modes: ["3D Illustration"],
    component: FuelWidget,
  },
  {
    id: "blims",
    label: "BLiMS",
    requiresAuth: false,
    dbField: "blims",
    modes: ["3D Illustration"],
    component: MonkeyWidget,
  },
];
