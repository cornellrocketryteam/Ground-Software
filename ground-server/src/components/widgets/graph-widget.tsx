import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  TelemetryChannel,
  type WidgetProps,
  type DataPoint,
} from "@/lib/definitions";
import { useData } from "@/contexts/data-context";

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
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

function GenericHistoricalChart(
  duration: number,
  data: DataPoint[],
  channel: TelemetryChannel
) {
  const color = "hsl(var(--chart-1))";

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-center mb-2 font-semibold">
        {duration}-Minute {channel.label} History
      </h3>
      <ChartContainer config={getConfig(channel)} className="w-full h-full">
        <LineChart
          accessibilityLayer
          data={data.map((d) => ({
            timestamp: d.timestamp.getTime(),
            value: d.value,
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
              value: `Time`,
              style: { textAnchor: "middle" },
              position: "bottom",
              offset: 0,
            }}
          />
          <YAxis
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
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default function GraphWidget({ mode, channel }: WidgetProps) {
  const { data } = useData();
  const fieldData = data[channel.dbField];

  if (fieldData === undefined || fieldData.length === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">No data</p>
      </div>
    );
  }

  if (mode === "Value") {
    const latestValue = fieldData[fieldData.length - 1].value.toFixed(3);

    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">{latestValue} {channel.unit || ""}</p>
      </div>
    );
  }

  if (mode === "1m Chart") {
    return GenericHistoricalChart(1, fieldData, channel);
  }

  if (mode === "15m Chart") {
    return GenericHistoricalChart(15, fieldData, channel);
  }

  if (mode === "60m Chart") {
    return GenericHistoricalChart(60, fieldData, channel);
  }

  return <div>Unsupported mode</div>;
}
