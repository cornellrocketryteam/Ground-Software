import GraphWidget from "@/components/widgets/graph-widget";
import ValueWidget from "@/components/widgets/value-widget";
import FuelWidget from "@/components/widgets/fuel-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";
import BoolStateWidget from "@/components/widgets/bool-state-widget";
import EventCounterWidget from "@/components/widgets/event-counter-widget";

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
    widgets: [BoolStateWidget("Armed", "Disarmed"), EventCounterWidget()],
  },
  {
    label: "Altimeter Valid",
    dbField: "alt_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "GPS Valid",
    dbField: "gps_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "IMU Valid",
    dbField: "imu_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "Accelerometer Valid",
    dbField: "acc_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "ADC Valid",
    dbField: "adc_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "FRAM Valid",
    dbField: "fram_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "SD Valid",
    dbField: "sd_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "GPS Message Valid",
    dbField: "gps_msg_valid",
    widgets: [BoolStateWidget("Fresh", "Stale"), EventCounterWidget()],
  },
  {
    label: "MAV State",
    dbField: "mav_state",
    widgets: [BoolStateWidget("On", "Off"), EventCounterWidget()],
  },
  {
    label: "SV2 State",
    dbField: "sv2_state",
    widgets: [BoolStateWidget("On", "Off"), EventCounterWidget()],
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

  // Events
  {
    label: "Altitude Armed",
    dbField: "altitude_armed",
    widgets: [BoolStateWidget("Armed", "Disarmed"), EventCounterWidget()],
  },
  {
    label: "Altimeter Init Failed",
    dbField: "altimeter_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Altimeter Reading Failed",
    dbField: "altimeter_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "GPS Init Failed",
    dbField: "gps_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "GPS Reading Failed",
    dbField: "gps_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "IMU Init Failed",
    dbField: "imu_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "IMU Reading Failed",
    dbField: "imu_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Accelerometer Init Failed",
    dbField: "accelerometer_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Accelerometer Reading Failed",
    dbField: "accelerometer_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "ADC Init Failed",
    dbField: "adc_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "ADC Reading Failed",
    dbField: "adc_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "FRAM Init Failed",
    dbField: "fram_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "FRAM Read Failed",
    dbField: "fram_read_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "FRAM Write Failed",
    dbField: "fram_write_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SD Init Failed",
    dbField: "sd_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SD Write Failed",
    dbField: "sd_write_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "MAV Was Actuated",
    dbField: "mav_was_actuated",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SV Was Actuated",
    dbField: "sv_was_actuated",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Main Deploy Wait End",
    dbField: "main_deploy_wait_end",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Main Log Shutoff",
    dbField: "main_log_shutoff",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Cycle Overflow",
    dbField: "cycle_overflow",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Unknown Command Received",
    dbField: "unknown_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Launch Command Received",
    dbField: "launch_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "MAV Command Received",
    dbField: "mav_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SV Command Received",
    dbField: "sv_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Safe Command Received",
    dbField: "safe_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Reset Card Command Received",
    dbField: "reset_card_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Reset Fram Command Received",
    dbField: "reset_fram_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "State Change Command Received",
    dbField: "state_change_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Umbilical Disconnected",
    dbField: "umbilical_disconnected",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },  
];
