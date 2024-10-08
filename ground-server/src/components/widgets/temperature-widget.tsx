import { WidgetProps } from "@/lib/definitions";

export default function TemperatureWidget({ mode, data }: WidgetProps) {
  if (mode === "Value") {
    return (
      <p className="w-full h-full flex justify-center items-center font-semibold text-2xl">
        {data.temp} &deg;C
      </p>
    );
  } else if (mode === "Chart") {
    return <div>Chart - {data.temp}</div>;
  }

  return <div>Unsupported mode</div>;
}
