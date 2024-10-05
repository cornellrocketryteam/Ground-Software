import { type Layout } from 'react-grid-layout'

export type Telemetry = {
    id: string;
    label: string;
};

export type Widget = {
    value: number | null;
    layout: Layout;
    telemetryType: string;
};
