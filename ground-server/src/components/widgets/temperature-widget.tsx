import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { type WidgetProps } from "@/lib/definitions";

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TemperatureWidget({ mode, data }: WidgetProps) {
  if (data.length === 0) {
    return <div>No data</div>;
  }

  if (mode === "Value") {
    return (
      <p className="w-full h-full flex justify-center items-center font-semibold text-2xl">
        {data[data.length - 1].temp} &deg;C
      </p>
    );
  }

  if (mode === "Chart") {
    const chartData = data.map((d, i) => ({ id: i, temp: d.temp }));
    return (
      <ChartContainer config={chartConfig} className="w-full h-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            interval="preserveStartEnd"
            dataKey="id"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="temp"
            isAnimationActive={false}
            type="natural"
            stroke="var(--color-temperature)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-temperature)",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    );
  }

  return <div>Unsupported mode</div>;
}
