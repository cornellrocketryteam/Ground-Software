import { type ComponentType } from "react";

export type DataPoint = {
  timestamp: Date;
  value: unknown;
};

export type WidgetProps = {
  mode: string;
  channel: TelemetryChannel;
};

export type TelemetryChannel = {
  id: string;
  label: string;
  unit?: string;
  dbField: string;
  modes: string[];
  component: ComponentType<WidgetProps>;
};

export type Preset = {
  label: string;
};
