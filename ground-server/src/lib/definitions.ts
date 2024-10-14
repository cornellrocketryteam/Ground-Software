import { type ComponentType } from "react";
import { type Layout } from "react-grid-layout";

export type DataPoint = {
  timestamp: Date;
  value: number;
};

export type WidgetProps = {
  mode: string;
  channel: TelemetryChannel;
};

export type TelemetryChannel = {
  label: string;
  unit?: string;
  requiresAuth: boolean;
  dbField: string;
  jsonField: string;
  modes: string[];
  data: DataPoint[];
  component: ComponentType<WidgetProps>;
};

export type Widget = {
  channel: TelemetryChannel;
  layout: Layout;
  id: string;
};
