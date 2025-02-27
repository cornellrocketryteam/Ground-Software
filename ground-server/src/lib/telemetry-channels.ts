import GraphWidget from "@/components/widgets/graph-widget";
import ValueWidget from "@/components/widgets/value-widget";
import FuelWidget from "@/components/widgets/fuel-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";
import BoolStateWidget from "@/components/widgets/bool-state-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    label: "Pressure Transducer 1",
    unit: "psi",
    dbField: "pt1",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 2",
    unit: "psi",
    dbField: "pt2",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Load Cell 1",
    unit: "lbf",
    dbField: "lc1",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Igniter 1 Continuity",
    dbField: "ign1_cont",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Igniter 2 Continuity",
    dbField: "ign2_cont",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Battery Voltage",
    dbField: "battery_voltage",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)]
  },
  {
    label: "Pressure Transducer 3",
    unit: "psi",
    dbField: "pt3",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 4",
    unit: "psi",
    dbField: "pt4",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "RTD Temp",
    unit: "C",
    dbField: "rtd_temp",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Fuel",
    dbField: "fuel",
    widgets: [FuelWidget()],
  },
  {
    label: "BLiMS",
    dbField: "blims",
    widgets: [MonkeyWidget()],
  },
  {
    label: "Altimeter Armed",
    dbField: "alt_armed",
    widgets: [BoolStateWidget("Armed", "Disarmed")],
  },
  {
    label: "Altimeter Valid",
    dbField: "alt_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "GPS Valid",
    dbField: "gps_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "IMU Valid",
    dbField: "imu_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "Accelerometer Valid",
    dbField: "acc_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "ADC Valid",
    dbField: "adc_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "FRAM Valid",
    dbField: "fram_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "SD Valid",
    dbField: "sd_valid",
    widgets: [BoolStateWidget("Valid", "Off")],
  },
  {
    label: "GPS Message Valid",
    dbField: "gps_msg_valid",
    widgets: [BoolStateWidget("Fresh", "Stale")],
  },
  {
    label: "MAV State",
    dbField: "mav_state",
    widgets: [BoolStateWidget("On", "Off")],
  },
  {
    label: "SV2 State",
    dbField: "sv2_state",
    widgets: [BoolStateWidget("On", "Off")],
  },
  {
    label: "Flight Mode",
    dbField: "flight_mode",
    widgets: [ValueWidget()],
  },
  {
    label: "MS since Boot",
    unit: "ms",
    dbField: "ms_since_boot",
    widgets: [ValueWidget()],
  },
];
