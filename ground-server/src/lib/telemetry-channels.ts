import GraphWidget from "@/components/widgets/graph-widget";
import ValueWidget from "@/components/widgets/value-widget";
import FuelWidget from "@/components/widgets/fuel-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";
import BoolStateWidget from "@/components/widgets/bool-state-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    id: "pt1_pressure",
    label: "Pressure Transducer 1",
    unit: "psi",
    dbField: "pt1",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "pt2_pressure",
    label: "Pressure Transducer 2",
    unit: "psi",
    dbField: "pt2",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "lc1",
    label: "Load Cell 1",
    unit: "lbf",
    dbField: "lc1",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "ign1_cont",
    label: "Igniter 1 Continuity",
    dbField: "ign1_cont",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "ign2_cont",
    label: "Igniter 2 Continuity",
    dbField: "ign2_cont",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "pt3_pressure",
    label: "Pressure Transducer 3",
    unit: "psi",
    dbField: "pt3",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "pt4_pressure",
    label: "Pressure Transducer 4",
    unit: "psi",
    dbField: "pt4",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "rtd_temp",
    label: "RTD Temp",
    unit: "C",
    dbField: "rtd_temp",
    widgets: [ValueWidget(), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    id: "fuel",
    label: "Fuel",
    dbField: "fuel",
    widgets: [FuelWidget()],
  },
  {
    id: "blims",
    label: "BLiMS",
    dbField: "blims",
    widgets: [MonkeyWidget()],
  },
  {
    id: "alt_armed",
    label: "Altimeter Armed",
    dbField: "alt_armed",
    widgets: [BoolStateWidget("Armed", "Disarmed")],
  },
  {
    id: "alt_valid",
    label: "Altimeter Valid",
    dbField: "alt_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "gps_valid",
    label: "GPS Valid",
    dbField: "gps_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "imu_valid",
    label: "IMU Valid",
    dbField: "imu_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "acc_valid",
    label: "Accelerometer Valid",
    dbField: "acc_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "adc_valid",
    label: "ADC Valid",
    dbField: "adc_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "fram_valid",
    label: "FRAM Valid",
    dbField: "fram_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "sd_valid",
    label: "SD Valid",
    dbField: "sd_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    id: "gps_msg_valid",
    label: "GPS Message Valid",
    dbField: "gps_msg_valid",
    widgets: [BoolStateWidget("Fresh", "Stale")],
  },
  {
    id: "mav_state",
    label: "MAV State",
    dbField: "mav_state",
    widgets: [BoolStateWidget("On", "Off")],
  },
  {
    id: "sv2_state",
    label: "SV2 State",
    dbField: "sv2_state",
    widgets: [BoolStateWidget("On", "Off")],
  },
  {
    id: "flight_mode",
    label: "Flight Mode",
    dbField: "flight_mode",
    widgets: [ValueWidget()],
  },
  {
    id: "ms_since_boot",
    label: "MS since Boot",
    unit: "ms",
    dbField: "ms_since_boot",
    widgets: [ValueWidget()],
  },
];
