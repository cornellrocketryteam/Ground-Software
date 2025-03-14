"use client"

import { useData } from "@/contexts/data-context";

interface LiveValueBoxProps {
  channel: { label: string; dbField: string; unit?: string };
}

export function LiveValueBox({ channel }: LiveValueBoxProps) {
  const { data } = useData();
  const fieldData = data[channel.dbField];

  if (!fieldData || fieldData.length === 0) {
    return (
      <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
        <h2 className="text-sm font-bold">{channel.label}</h2>
        <p>No data</p>
      </div>
    );
  }

  const latestReading = fieldData[fieldData.length - 1].value;
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
