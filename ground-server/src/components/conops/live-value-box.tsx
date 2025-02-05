"use client";

import { useData } from "@/contexts/data-context";
// Import the type if you have it in a definitions file, e.g. TelemetryChannel
// import { TelemetryChannel } from "@/lib/definitions";

interface TelemetryChannel {
  label: string;
  dbField: string;
  unit?: string; // optional
}

interface LiveValueBoxProps {
  channel: TelemetryChannel;
}

export function LiveValueBox({ channel }: LiveValueBoxProps) {
  const { data } = useData();
  const fieldData = data[channel.dbField];

  // If there's no data at all, show a small "No data" box
  if (!fieldData || fieldData.length === 0) {
    return (
      <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
        <h2 className="text-sm font-bold">{channel.label}</h2>
        <p>No data</p>
      </div>
    );
  }

  // The latest numeric value from the data array
  const latestReading = fieldData[fieldData.length - 1].value;
  // Format to 3 decimals if it's a number; otherwise show "--"
  const formattedValue =
    typeof latestReading === "number" ? latestReading.toFixed(3) : "--";

  return (
    <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
      <h2 className="text-sm font-bold">{channel.label}</h2>
      <p className="text-xl font-mono">
        {formattedValue} {channel.unit ?? ""}
      </p>
    </div>
  );
}
