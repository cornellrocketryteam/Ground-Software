"use client";

import { useData } from "@/contexts/data-context";

interface LiveValueBoxProps {
  label: string;
  dbField: string;
}

export function LiveValueBox({ label, dbField }: LiveValueBoxProps) {
  const { data } = useData();
  const dataPoints = data[dbField];

  return (
    <div className="p-4 border dark:border-white rounded-lg shadow-md w-full h-24 flex flex-col justify-center items-center">
      <h2 className="text-sm font-bold">{label}</h2>
      <p className="text-xl font-mono">
        {dataPoints ? dataPoints[dataPoints.length - 1].value : "--"}
      </p>
    </div>
  );
}
