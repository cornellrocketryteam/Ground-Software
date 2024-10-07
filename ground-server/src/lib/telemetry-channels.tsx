import type { TelemetryChannel } from "@/lib/definitions";

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    label: "Temperature",
    requiresAuth: false,
    modes: ["Value", "Chart"],
    render: (mode, data) => {
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
    },
  },
];
