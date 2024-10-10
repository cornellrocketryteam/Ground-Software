import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Text,
} from "recharts";
import { format } from "date-fns"; // Import date-fns

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

  if (mode === "15m Chart") {
    const chartData = data.map((d) => ({ timestamp: d.timestamp.getTime(), temp: d.temp })); // Use timestamp

    return (
      <div className="flex flex-col h-full"> {/* Added wrapping div */}
        <h3 className="text-center mb-2 font-semibold"> {/* Title outside Recharts */}
          15-Minute Temperature History
        </h3>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 0, right: 30, left: -10, bottom: 40 }}
            title="15 Minute Historical Data"
            
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
            >
            </XAxis>

            <YAxis 
              label={{
                value: `Temperature (C)`,
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

            <Text x={15} y={10} fontSize={16} fontWeight="bold">
              15-Minute Temperature History
            </Text>{/* Chart Title */}

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
      </div>
    );
  }

  return <div>Unsupported mode</div>;
}
