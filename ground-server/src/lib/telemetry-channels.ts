import GraphWidget from "@/components/widgets/graph-widget";
import ValueWidget from "@/components/widgets/value-widget";
import FuelWidget from "@/components/widgets/fuel-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";
import BoolStateWidget from "@/components/widgets/bool-state-widget";
import EventCounterWidget from "@/components/widgets/event-counter-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  // ----------------------------
  // Fill Station Telemetry
  // ----------------------------
  {
    label: "Pressure Transducer 1",
    unit: "psi",
    dbMeasurements: ["Fill Station"],
    dbField: "pt1",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 2",
    unit: "psi",
    dbMeasurements: ["Fill Station"],
    dbField: "pt2",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Load Cell 1",
    unit: "lbf",
    dbMeasurements: ["Fill Station"],
    dbField: "lc1",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Igniter 1 Continuity",
    dbMeasurements: ["Fill Station"],
    dbField: "ign1_cont",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Igniter 2 Continuity",
    dbMeasurements: ["Fill Station"],
    dbField: "ign2_cont",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },



  // ----------------------------
  // Umbilical Telemetry
  // ----------------------------
  {
    label: "MS since Boot",
    unit: "ms",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "ms_since_boot",
    widgets: [ValueWidget()],
  },
  {
    label: "Battery Voltage",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "battery_voltage",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)]
  },
  {
    label: "Pressure Transducer 3",
    unit: "psi",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "pt3",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 4",
    unit: "psi",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "pt4",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "RTD Temp",
    unit: "C",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "rtd_temp",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Altimeter Armed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "alt_armed",
    widgets: [BoolStateWidget("Armed", "Disarmed"), EventCounterWidget()],
  },
  {
    label: "Altimeter Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "alt_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "GPS Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "IMU Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "imu_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "Accelerometer Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "acc_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "ADC Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "adc_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "FRAM Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "SD Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sd_valid",
    widgets: [BoolStateWidget("Valid", "Off"), EventCounterWidget()],
  },
  {
    label: "GPS Message Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_msg_valid",
    widgets: [BoolStateWidget("Fresh", "Stale"), EventCounterWidget()],
  },
  {
    label: "MAV State",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "mav_state",
    widgets: [BoolStateWidget("On", "Off"), EventCounterWidget()],
  },
  {
    label: "SV2 State",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sv2_state",
    widgets: [BoolStateWidget("On", "Off"), EventCounterWidget()],
  },
  {
    label: "Flight Mode",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "flight_mode",
    widgets: [ValueWidget()],
  },

  // Events
  {
    label: "Altitude Armed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "altitude_armed",
    widgets: [BoolStateWidget("Armed", "Disarmed"), EventCounterWidget()],
  },
  {
    label: "Altimeter Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "altimeter_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Altimeter Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "altimeter_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "GPS Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "GPS Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "IMU Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "imu_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "IMU Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "imu_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Accelerometer Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "accelerometer_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Accelerometer Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "accelerometer_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "ADC Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "adc_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "ADC Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "adc_reading_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "FRAM Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "FRAM Read Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_read_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "FRAM Write Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_write_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SD Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sd_init_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SD Write Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sd_write_failed",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "MAV Was Actuated",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "mav_was_actuated",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SV Was Actuated",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sv_was_actuated",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Main Deploy Wait End",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "main_deploy_wait_end",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Main Log Shutoff",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "main_log_shutoff",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Cycle Overflow",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "cycle_overflow",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Unknown Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "unknown_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Launch Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "launch_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "MAV Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "mav_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "SV Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sv_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Safe Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "safe_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Reset Card Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "reset_card_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Reset Fram Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "reset_fram_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "State Change Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "state_change_command_received",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },
  {
    label: "Umbilical Disconnected",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "umbilical_disconnected",
    widgets: [BoolStateWidget("True", "False"), EventCounterWidget()],
  },  


  // Fake widgets
  {
    label: "Fuel",
    dbMeasurements: ["FAKE"],
    dbField: "fuel",
    widgets: [FuelWidget()],
  },
  {
    label: "BLiMS",
    dbMeasurements: ["FAKE"],
    dbField: "blims",
    widgets: [MonkeyWidget()],
  },
];
