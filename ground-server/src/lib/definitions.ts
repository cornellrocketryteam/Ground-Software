import { type ComponentType } from "react";
import { type Layout } from "react-grid-layout";
import { ChartConfig } from "@/components/ui/chart"

export type DataPoint = {
  timestamp: Date;
  [key: string]: any;
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
  modes: string[];
  data: DataPoint[];
  component: ComponentType<WidgetProps>;
};

export type Widget = {
  channel: TelemetryChannel;
  layout: Layout;
  id: string;
};
