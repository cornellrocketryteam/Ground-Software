import GraphWidget from "@/components/widgets/graph-widget";
import ValueWidget from "@/components/widgets/value-widget";
import MonkeyWidget from "@/components/widgets/monkey-widget";
import BoolLightWidget from "@/components/widgets/bool-light-widget";
import BoolStateWidget from "@/components/widgets/bool-state-widget";
import EventCounterWidget from "@/components/widgets/event-counter-widget";
import MapWidget from "@/components/widgets/map-widget";

import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  // ----------------------------
  // Fill Station Telemetry
  // ----------------------------
  {
    label: "Pressure Transducer 1",
    unit: "psi",
    dbMeasurements: ["Fill Station"],
    dbFields: ["pt1"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 2",
    unit: "psi",
    dbMeasurements: ["Fill Station"],
    dbFields: ["pt2"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Load Cell 1",
    unit: "lbf",
    dbMeasurements: ["Fill Station"],
    dbFields: ["lc1"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Igniter 1 Continuity",
    dbMeasurements: ["Fill Station"],
    dbFields: ["ign1_cont"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Igniter 2 Continuity",
    dbMeasurements: ["Fill Station"],
    dbFields: ["ign2_cont"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },

  // ----------------------------
  // Umbilical Telemetry
  // ----------------------------
  {
    label: "MS since Boot",
    unit: "ms",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["ms_since_boot"],
    widgets: [ValueWidget()],
  },
  {
    label: "Battery Voltage",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["battery_voltage"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 3",
    unit: "psi",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["pt3"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Pressure Transducer 4",
    unit: "psi",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["pt4"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "RTD Temp",
    unit: "C",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["rtd_temp"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60), GraphWidget(2, -50, 75)],
  },
  {
    label: "Altimeter Armed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["alt_armed"],
    widgets: [
      BoolStateWidget("Armed", "Disarmed"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Altimeter Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["alt_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["gps_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "IMU Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["imu_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Accelerometer Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["acc_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Umbilical Connection Lock",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["umbilical_connection_lock"],
    widgets: [
      BoolStateWidget("Connection Lock", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "ADC Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["adc_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["fram_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SD Valid",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["sd_valid"],
    widgets: [
      BoolStateWidget("Valid", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Message Fresh",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["gps_msg_fresh"],
    widgets: [
      BoolStateWidget("Fresh", "Stale"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Rocket was Safed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["rocket_was_safed"],
    widgets: [
      BoolStateWidget("Safed", "Primed"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "MAV State",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["mav_state"],
    widgets: [
      BoolStateWidget("On", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SV2 State",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["sv2_state"],
    widgets: [
      BoolStateWidget("On", "Off"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Flight Mode",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["flight_mode"],
    widgets: [ValueWidget()],
  },

  // ----------------------------
  // Events
  // ----------------------------
  {
    label: "Altitude Armed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["altitude_armed"],
    widgets: [
      BoolStateWidget("Armed", "Disarmed"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Altimeter Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["altimeter_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Altimeter Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["altimeter_reading_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["gps_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "GPS Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["gps_reading_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "IMU Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["imu_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "IMU Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["imu_reading_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Accelerometer Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["accelerometer_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Accelerometer Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["accelerometer_reading_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "ADC Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["adc_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "ADC Reading Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["adc_reading_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["fram_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Read Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["fram_read_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "FRAM Write Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["fram_write_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SD Init Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["sd_init_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SD Write Failed",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["sd_write_failed"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "MAV Was Actuated",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["mav_was_actuated"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SV Was Actuated",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["sv_was_actuated"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Main Deploy Wait End",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["main_deploy_wait_end"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Main Log Shutoff",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["main_log_shutoff"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Cycle Overflow",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["cycle_overflow"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Unknown Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["unknown_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Launch Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["launch_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "MAV Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["mav_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "SV Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["sv_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Safe Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["safe_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Reset Card Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["reset_card_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Reset Fram Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["reset_fram_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "State Change Command Received",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["state_change_command_received"],
    widgets: [
      BoolStateWidget("True", "False"),
      BoolLightWidget(),
      EventCounterWidget(),
    ],
  },
  {
    label: "Umbilical Disconnected",
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["umbilical_disconnected"],
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
    dbMeasurements: ["Umbilical", "Fill Radio", "Ground Radio"],
    dbFields: ["altitude"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Temperature",
    unit: "C",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["altimeter_temperature"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Latitude",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["gps_latitude"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Longitude",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["gps_longitude"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "GPS Location",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["gps_latitude", "gps_longitude"],
    widgets: [MapWidget()],
  },
  {
    label: "Satellites in view",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["gps_satellites_in_view"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Unix time",
    unit: "seconds",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["gps_unix_time"],
    widgets: [ValueWidget(3)],
  },
  {
    label: "Horizontal accuracy",
    unit: "mm",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["gps_horizontal_accuracy"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "IMU Acceleration X",
    unit: "m/s^2",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_acceleration_x"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "IMU Acceleration Y",
    unit: "m/s^2",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_acceleration_y"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "IMU Acceleration Z",
    unit: "m/s^2",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_acceleration_z"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Gyro X",
    unit: "deg/s",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_gyro_x"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Gyro Y",
    unit: "deg/s",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_gyro_y"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Gyro Z",
    unit: "deg/s",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_gyro_z"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Orientation X",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_orientation_x"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Orientation Y",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_orientation_y"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Orientation Z",
    unit: "deg",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["imu_orientation_z"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Accelerometer Acceleration X",
    unit: "g",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["accelerometer_acceleration_x"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Accelerometer Acceleration Y",
    unit: "g",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["accelerometer_acceleration_y"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Accelerometer Acceleration Z",
    unit: "g",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["accelerometer_acceleration_z"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60)],
  },
  {
    label: "Motor state",
    unit: "inches",
    dbMeasurements: ["Fill Radio", "Ground Radio"],
    dbFields: ["blims_motor_state"],
    widgets: [ValueWidget(3), GraphWidget(1), GraphWidget(15), GraphWidget(60), MonkeyWidget()],
  },
];