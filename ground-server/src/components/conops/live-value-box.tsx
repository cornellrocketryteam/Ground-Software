"use client";

import { useData } from "@/contexts/data-context";
import type { WidgetProps } from "@/lib/definitions";

type LiveValueBoxProps = Omit<WidgetProps, "fieldData">;

export function LiveValueBox({ measurement, channel }: LiveValueBoxProps) {
  const { data } = useData();

  if (
    !data[measurement] ||
    !data[measurement][channel.dbField] ||
    Object.keys(data[measurement][channel.dbField]).length === 0
  ) {
    return (
      <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
        <h2 className="text-sm font-bold">{channel.label}</h2>
        <p>No data</p>
      </div>
    );
  }

  const fieldData = data[measurement][channel.dbField];
  const readingTimes = Object.keys(fieldData).sort();
  const latestReadingTime = readingTimes[readingTimes.length - 1];
  const latestReading = fieldData[latestReadingTime];
  const formattedValue = typeof latestReading === "number" ? latestReading.toFixed(3) : "--";

  return (
    <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
      <h2 className="text-sm font-bold">{channel.label}</h2>
      <p className="text-xl font-mono">
        {formattedValue} {channel.unit ?? ""}
      </p>
    </div>
  );
}
