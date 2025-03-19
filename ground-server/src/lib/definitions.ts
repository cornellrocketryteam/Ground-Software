import type { ComponentType } from "react";

export type DataPoint = {
  timestamp: Date;
  value: unknown;
};

export type WidgetProps = {
  measurement: string;
  channel: TelemetryChannel;
};

export type Widget = {
  mode: string;
  component: ComponentType<WidgetProps>;
}

export type TelemetryChannel = {
  label: string;
  unit?: string;
  dbMeasurements: string[];
  dbField: string;
  widgets: Widget[];
};

export type Preset = {
  label: string;
};
