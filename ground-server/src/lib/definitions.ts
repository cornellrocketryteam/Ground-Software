import type { ComponentType } from "react";

export type DataPoint = {
  timestamp: Date;
  value: unknown;
};

export type WidgetProps = {
  channel: TelemetryChannel;
};

export type Widget = {
  mode: string;
  component: ComponentType<WidgetProps>;
}

export type TelemetryChannel = {
  id: string;
  label: string;
  unit?: string;
  dbField: string;
  widgets: Widget[];
};

export type Preset = {
  label: string;
};
