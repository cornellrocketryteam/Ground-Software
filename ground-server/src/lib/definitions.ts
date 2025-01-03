import { type ComponentType } from "react";

export type DataPoint = {
  timestamp: Date;
  value: number;
};

export type WidgetProps = {
  mode: string;
  channel: TelemetryChannel;
  data: DataPoint[];
};

export type TelemetryChannel = {
  id: string;
  label: string;
  unit?: string;
  requiresAuth: boolean;
  dbField: string;
  modes: string[];
  component: ComponentType<WidgetProps>;
};

export type Preset = {
  label: string;
};
