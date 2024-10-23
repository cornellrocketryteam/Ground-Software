import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns"; // Import date-fns

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TelemetryChannel, type WidgetProps } from "@/lib/definitions";

function GetConfig(channel: TelemetryChannel) {
  const chartConfig = {
    config: {
      label: channel.label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return chartConfig
}

function GenericHistoricalChart(duration: string, channel: TelemetryChannel) {
  const color="hsl(var(--chart-1))"

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-center mb-2 font-semibold">
        {duration}-Minute {channel.label} History
      </h3>
      <ChartContainer config={GetConfig(channel)} className="w-full h-full">
        <LineChart
          accessibilityLayer
          data={channel.data.map((d) => ({ timestamp: d.timestamp.getTime(), value: d.value}))}
          margin={{ top: 0, right: 30, left: -10, bottom: 40 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            interval="preserveStartEnd"
            dataKey="timestamp"
            tickFormatter={(tick) => format(new Date(tick), 'HH:mm')}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            type="number"
            domain={['dataMin', 'dataMax']}
            label={{
              value: `Time`,
              style: { textAnchor: 'middle' },
              position: 'bottom',
              offset: 0,
            }}
          />
          <YAxis
            label={{
              value: `${channel.label} (${channel.unit || ''})`, // Use unit if provided
              style: { textAnchor: 'middle' },
              angle: -90,
              position: 'left',
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
            type="natural"
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
  if (!channel.data || channel.data.length === 0) {
    return <div>No data</div>;
  }

  if (mode === "Value") {
    const latestValue = channel.data[channel.data.length - 1].value;

    return (
      <p className="w-full h-full flex justify-center items-center font-semibold text-2xl">
        {latestValue} {channel.unit || ''}
      </p>
    );
  }

  if (mode === "15m Chart") {
    return GenericHistoricalChart("15", channel);
  }

  if (mode === "60m Chart") {
    return GenericHistoricalChart("60", channel);
  }

  return <div>Unsupported mode</div>;
}
