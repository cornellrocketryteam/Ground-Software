import { type ReactNode } from "react";
import { type Layout } from "react-grid-layout";

export type Data = {
  temp: number;
};

export type TelemetryChannel = {
  label: string;
  requiresAuth: boolean;
  modes: string[];
  render: (mode: string, data: Data) => ReactNode;
};

export type Widget = {
  channel: TelemetryChannel;
  layout: Layout;
};
