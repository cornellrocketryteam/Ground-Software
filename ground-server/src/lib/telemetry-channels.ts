import GraphWidget from "@/components/widgets/graph-widget";
import ValueWidget from "@/components/widgets/value-widget";
import FuelWidget from "@/components/widgets/fuel-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";
import BoolLightWidget from "@/components/widgets/bool-light-widget";
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
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
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
    widgets: [
      BoolStateWidget("Armed", "Disarmed"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Altimeter Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "alt_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "IMU Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "imu_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Accelerometer Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "acc_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "ADC Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "adc_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SD Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sd_valid",
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Message Fresh",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_msg_fresh",
    widgets: [
      BoolStateWidget("Fresh", "Stale"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Rocket was Safed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "rocket_was_safed",
    widgets: [
      BoolStateWidget("Safed", "Primed"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "MAV State",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "mav_state",
    widgets: [
      BoolStateWidget("On", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SV2 State",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sv2_state",
    widgets: [
      BoolStateWidget("On", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Flight Mode",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "flight_mode",
    widgets: [ValueWidget()],
  },

  // ----------------------------
  // Events
  // ----------------------------
  {
    label: "Altitude Armed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "altitude_armed",
    widgets: [
      BoolStateWidget("Armed", "Disarmed"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Altimeter Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "altimeter_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Altimeter Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "altimeter_reading_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "gps_reading_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "IMU Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "imu_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "IMU Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "imu_reading_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Accelerometer Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "accelerometer_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Accelerometer Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "accelerometer_reading_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "ADC Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "adc_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "ADC Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "adc_reading_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Read Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_read_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Write Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "fram_write_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SD Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sd_init_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SD Write Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sd_write_failed",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "MAV Was Actuated",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "mav_was_actuated",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SV Was Actuated",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sv_was_actuated",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Main Deploy Wait End",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "main_deploy_wait_end",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Main Log Shutoff",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "main_log_shutoff",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Cycle Overflow",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "cycle_overflow",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Unknown Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "unknown_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Launch Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "launch_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "MAV Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "mav_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SV Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "sv_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Safe Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "safe_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Reset Card Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "reset_card_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Reset Fram Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "reset_fram_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "State Change Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "state_change_command_received",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Umbilical Disconnected",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbField: "umbilical_disconnected",
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },

  // ----------------------------
  // Radio Telemetry
  // ----------------------------
  {
    label: "Altitude",
    unit: "m",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "altimeter_altitude",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Temperature",
    unit: "C",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "altimeter_temperature",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Latitude",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "gps_latitude",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Longitude",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "gps_longitude",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Satellites in view",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "gps_satellites_in_view",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Unix time",
    unit: "seconds",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "gps_unix_time",
    widgets: [ValueWidget(3)],
  },
  {
    label: "Horizontal accuracy",
    unit: "mm",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "gps_horizontal_accuracy",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "IMU Acceleration X",
    unit: "m/s^2",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_acceleration_x",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "IMU Acceleration Y",
    unit: "m/s^2",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_acceleration_y",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "IMU Acceleration Z",
    unit: "m/s^2",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_acceleration_z",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Gyro X",
    unit: "deg/s",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_gyro_x",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Gyro Y",
    unit: "deg/s",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_gyro_y",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Gyro Z",
    unit: "deg/s",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_gyro_z",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Orientation X",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_orientation_x",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Orientation Y",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_orientation_y",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Orientation Z",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "imu_orientation_z",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Accelerometer Acceleration X",
    unit: "g",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "accelerometer_acceleration_x",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Accelerometer Acceleration Y",
    unit: "g",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "accelerometer_acceleration_y",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Accelerometer Acceleration Z",
    unit: "g",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "accelerometer_acceleration_z",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Motor state",
    unit: "inches",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbField: "blims_motor_state",
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },

  // ----------------------------
  // Fake widgets
  // ----------------------------
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
