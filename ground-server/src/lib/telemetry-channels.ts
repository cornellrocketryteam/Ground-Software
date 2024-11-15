import FuelWidget from "@/components/widgets/fuel-widget";
import GraphWidget from "@/components/widgets/graph-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    id: "pt1_pressure",
    label: "Pressure Transducer 1",
    requiresAuth: false,
    dbField: "pt1",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
  {
    id: "pt2_pressure",
    label: "Pressure Transducer 2",
    requiresAuth: false,
    dbField: "pt2",
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
