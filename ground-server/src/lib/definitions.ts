import type { ComponentType } from "react";

export type WidgetProps = {
  fieldData: Record<string, Record<string, unknown>>;
  measurement: string;
  channel: TelemetryChannel;
};

export type Widget = {
  mode: string;
  component: ComponentType<WidgetProps>;
};

export type TelemetryChannel = {
  label: string;
  unit?: string;
  dbMeasurements: string[];
  dbFields: string[];
  widgets: Widget[];
};

export type Preset = {
  label: string;
};
