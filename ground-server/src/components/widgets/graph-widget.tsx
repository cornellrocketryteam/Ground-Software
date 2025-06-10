"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import type { TelemetryChannel, Widget, WidgetProps } from "@/lib/definitions";
import { useData } from "@/contexts/data-context";
import { useEffect } from "react";

function getConfig(channel: TelemetryChannel) {
  const chartConfig = {
    config: {
      label: channel.label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return chartConfig;
}

function tickFormatter(tick: number) {
  const date = new Date(tick);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

export default function GraphWidget(minuteDuration: number, min?: number, max?: number): Widget {
  const GraphWidgetComponent = ({ fieldData, measurement, channel, }: WidgetProps) => {
    const { sendHistoricalDataReq } = useData();

    useEffect(() => {
      console.log(`Sending historical data request with values:\nminuteDuration:${minuteDuration}\nmeasurement:${measurement}\ndbField:${channel.dbField}`)
      sendHistoricalDataReq(-minuteDuration, 0, measurement, channel.dbField);
    }, [channel.dbField, sendHistoricalDataReq]);

    const sortedKeys = Object.keys(fieldData).sort();
    const latestKey = sortedKeys[sortedKeys.length - 1];
    const latestValue = fieldData[latestKey];
    if (typeof latestValue !== "number") {
      return (
        <div>
          Data is not numbers and so cannot be displayed using the graph widget.
        </div>
      );
    }

    const color = "hsl(var(--chart-1))";
    const now = Date.now();

    const chartData = Object.keys(fieldData)
      .filter((key) => new Date(key).getTime() >= now - minuteDuration * 60000)
      .map((key) => ({
        timestamp: new Date(key).getTime(),
        value: fieldData[key],
      }));

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-center mb-2 font-semibold">
          {minuteDuration}-Minute {channel.label} History
        </h3>
        <ChartContainer config={getConfig(channel)} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={chartData}
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
                value: `Time`,
                style: { textAnchor: "middle" },
                position: "bottom",
                offset: 0,
              }}
            />
            <YAxis
              domain={[min ?? "dataMin", max ?? "dataMax"]}
              tickFormatter={(tick) => tick.toFixed(2)}
              allowDataOverflow={true}
              label={{
                value: `${channel.label} (${channel.unit || ""})`, // Use unit if provided
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
              dataKey={"value"} // Use the provided dataKey
              isAnimationActive={false}
              type="linear"
              stroke={color} // Use color from config
              strokeWidth={2}
              dot={{ fill: color }}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    );
  };

  return {
    mode: `${minuteDuration}m Chart`,
    component: GraphWidgetComponent,
  };
}
