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
    id: "lc1",
    label: "Load Cell 1",
    requiresAuth: false,
    dbField: "lc1",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
  {
    id: "ign1Cont",
    label: "Igniter 1 Continuity",
    requiresAuth: false,
    dbField: "ign1Cont",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
  {
    id: "ign2Cont",
    label: "Igniter 2 Continuity",
    requiresAuth: false,
    dbField: "ign2Cont",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
  {
    id: "pt3_pressure",
    label: "Pressure Transducer 3",
    requiresAuth: false,
    dbField: "pt3",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
  {
    id: "pt4_pressure",
    label: "Pressure Transducer 4",
    requiresAuth: false,
    dbField: "pt4",
    modes: ["Value", "15m Chart", "60m Chart"],
    component: GraphWidget,
  },
  {
    id: "rtd_temp",
    label: "RTD Temp",
    requiresAuth: false,
    dbField: "rtdTemp",
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
