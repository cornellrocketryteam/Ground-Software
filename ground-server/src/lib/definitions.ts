import { type ComponentType } from "react";
import { type Layout } from "react-grid-layout";

export type Data = {
  timestamp: Date;
  temp: number;
};

export type WidgetProps = {
  mode: string;
  data: Data[];
};

export type TelemetryChannel = {
  label: string;
  requiresAuth: boolean;
  modes: string[];
  component: ComponentType<WidgetProps>;
};

export type Widget = {
  channel: TelemetryChannel;
  layout: Layout;
};
