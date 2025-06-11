import type { Widget, WidgetProps } from "@/lib/definitions";

export default function BoolLightWidget(): Widget {
  const BoolLightWidgetComponent = ({ fieldData, channel }: WidgetProps) => {
    const firstFieldData = fieldData[channel.dbFields[0]] || {};
    const sortedKeys = Object.keys(firstFieldData).sort();
    const latestKey = sortedKeys[sortedKeys.length - 1];
    const latestValue = firstFieldData[latestKey] as boolean;
    const bgColor = latestValue ? "bg-green-500" : "bg-red-500";

    // Convert the ISO date string to a Date object
    const dateObject = new Date(latestKey);

    // Format the date as "month/day"
    const datePart = dateObject.toLocaleDateString(undefined, {
      month: 'numeric',
      day: 'numeric',
    });

    // Format the time as "hour:minute:second" in 12-hour format with AM/PM
    const timePart = dateObject.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    // Combine date and time parts
    const formattedDate = `${datePart} ${timePart}`;

    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <div
          className={`flex-1 max-h-full max-w-full aspect-square rounded-full ${bgColor}`}
        ></div>
        <p className="font-light text-base text-gray-500">{formattedDate}</p>
      </div>
    );
  };

  return {
    mode: "Light",
    component: BoolLightWidgetComponent,
  };
}
