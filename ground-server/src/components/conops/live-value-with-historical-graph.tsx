"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { format } from "date-fns"; // Import date-fns
import { useData } from "@/contexts/data-context";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function GetConfig(label: string) {
  const chartConfig = {
    config: {
      label: label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return chartConfig;
}

interface LiveValueWithHistoricalGraphProps {
  label: string;
  dbField: string;
  duration: number;
}

export function LiveValueWithHistoricalGraph({
  label,
  dbField,
  duration,
}: LiveValueWithHistoricalGraphProps) {
  const { data } = useData();
  const fieldData = data[dbField];

  if (!fieldData) {
    return <p>No data</p>;
  } else {
    const color = "hsl(var(--chart-1))";

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-center mb-2 font-semibold">
        {duration}-Minute {label} History
      </h3>
      <ChartContainer config={GetConfig(label)} className="w-full h-full">
        <LineChart
          accessibilityLayer
          data={fieldData.map((d) => ({
            timestamp: d.timestamp.getTime(),
            value: d.value,
          }))}
          margin={{ top: 0, right: 30, left: -10, bottom: 40 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            interval="preserveStartEnd"
            dataKey="timestamp"
            tickFormatter={(tick) => format(new Date(tick), "HH:mm")}
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
              // value: `${label} (${channel.unit || ""})`, // Use unit if provided
              value: `${label}`, // TODO: Use unit if provided
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
}
