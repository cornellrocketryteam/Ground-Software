import type { Widget, WidgetProps } from "@/lib/definitions";

export default function ValueWidget(decimalDigits?: number): Widget {
  const ValueWidgetComponent = ({ fieldData, channel }: WidgetProps) => {
    // Use the first field's data
    const firstFieldData = fieldData[channel.dbFields[0]] || {};
    const sortedKeys = Object.keys(firstFieldData).sort();
    const latestKey = sortedKeys[sortedKeys.length - 1];
    let latestValue = firstFieldData[latestKey] as any;
    if (decimalDigits && typeof latestValue === "number") {
      latestValue = latestValue.toFixed(decimalDigits);
    } else {
      latestValue = latestValue.toString();
    }

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
        <p className="font-normal text-lg">
          {latestValue} {channel.unit || ""}
        </p>
        <p className="font-ligh text-base text-gray-500">{formattedDate}</p>
      </div>
    );
  };

  return {
    mode: "Value",
    component: ValueWidgetComponent,
  };
}
