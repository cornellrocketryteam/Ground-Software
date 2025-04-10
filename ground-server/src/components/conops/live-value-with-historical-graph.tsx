"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useData } from "@/contexts/data-context";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// If you already have TelemetryChannel defined elsewhere, import it here:
interface TelemetryChannel {
  label: string;
  dbMeasurement: string;
  dbField: string;
  unit?: string;
}

/** Reusable helper to configure your chart’s label/color */
function getConfig(channel: TelemetryChannel) {
  const chartConfig = {
    config: {
      label: channel.label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return chartConfig;
}

/** Format timestamps on the X-axis (HH:MM) */
function tickFormatter(tick: number) {
  const date = new Date(tick);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

interface LiveValueWithHistoricalGraphProps {
  /** A TelemetryChannel object that has label, dbField, and unit */
  channel: TelemetryChannel;
  /** Number of minutes of historical data to show in the chart */
  duration: number;
}

export function LiveValueWithHistoricalGraph({
  channel,
  duration,
}: LiveValueWithHistoricalGraphProps) {
  const { data } = useData();

  // If there's no data, show "No data"
  if (
    !data[channel.dbMeasurement] ||
    !data[channel.dbMeasurement][channel.dbField] ||
    Object.keys(data[channel.dbMeasurement][channel.dbField]).length === 0
  ) {
    return (
      <div className="border p-4 rounded-lg shadow-md flex flex-col items-center">
        <h2 className="text-sm font-bold mb-2">{channel.label}</h2>
        <p>No data</p>
      </div>
    );
  }

  // Pull data from your websocket/db using channel.dbField


  const fieldData = data[channel.dbMeasurement][channel.dbField];

  // Filter data to the last 'duration' minutes
  const now = Date.now();
  const cutoff = now - duration * 60_000;
  const filteredDataKeys = Object.keys(fieldData).filter(
    (timestamp) => new Date(timestamp).getTime() >= cutoff,
  ).sort();

  // If no recent data, show a simple message
  if (filteredDataKeys.length === 0) {
    return (
      <div className="border p-4 rounded-lg shadow-md flex flex-col items-center">
        <h2 className="text-sm font-bold mb-2">{channel.label}</h2>
        <p>No recent data within the last {duration} minute(s).</p>
      </div>
    );
  }

  // Live value = latest data point

  const latestValueKey = filteredDataKeys[filteredDataKeys.length - 1];
  const latestValue = (fieldData[latestValueKey] as number).toFixed(3);

  const color = "hsl(var(--chart-1))";

  return (
    <div
      className="flex flex-col border p-4 rounded-lg shadow-md"
      style={{ width: "600px" }}
    >
      <h3 className="text-center mb-4 font-semibold">
        {duration}-Minute {channel.label} History
      </h3>

      <div className="flex flex-row space-x-4">
        {/* Left: Chart Container */}
        <ChartContainer
          config={getConfig(channel)}
          className="w-[400px] h-[300px]"
        >
          <LineChart
            data={filteredDataKeys.map((key) => ({
              // Recharts expects numeric timestamps
              timestamp: new Date(key).getTime(),
              value: fieldData[key],
            }))}
            margin={{ top: 0, right: 30, left: -10, bottom: 40 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              interval="preserveStartEnd"
              dataKey="timestamp"
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              type="number"
              domain={["dataMin", "dataMax"]}
              label={{
                value: "Time",
                style: { textAnchor: "middle" },
                position: "bottom",
                offset: 0,
              }}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              label={{
                // Use the channel's label and unit if present
                value: channel.unit
                  ? `${channel.label} (${channel.unit})`
                  : channel.label,
                style: { textAnchor: "middle" },
                angle: -90,
                position: "left",
                offset: -25,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="value"
              isAnimationActive={false}
              type="natural"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>

        {/* Right: Live Value */}
        <div className="flex flex-col items-center justify-center border rounded-lg p-4 w-[200px] h-[200px]">
          <h2 className="text-sm font-bold mb-2">Live Value</h2>
          <p className="text-3xl font-mono">
            {latestValue} {channel.unit ?? ""}
          </p>
        </div>
      </div>
    </div>
  );
}
