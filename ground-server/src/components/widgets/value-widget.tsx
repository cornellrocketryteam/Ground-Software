import type { Widget, WidgetProps } from "@/lib/definitions";
import { useData } from "@/contexts/data-context";

export default function ValueWidget(decimalDigits?: number): Widget {
  const ValueWidgetComponent = ({ measurement, channel }: WidgetProps) => {
    const { data } = useData();

    if (
      data[measurement] === undefined ||
      data[measurement][channel.dbField] === undefined ||
      data[measurement][channel.dbField].length === 0
    ) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
          <p className="font-semibold text-lg">{channel.label}</p>
          <p className="font-normal text-lg">No data</p>
        </div>
      );
    }

    const fieldData = data[measurement][channel.dbField];
    let latestValue = fieldData[fieldData.length - 1].value as any;
    if (decimalDigits && typeof latestValue === "number") {
      latestValue = latestValue.toFixed(decimalDigits);
    } else {
      latestValue = latestValue.toString();
    }

    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">
          {latestValue} {channel.unit || ""}
        </p>
      </div>
    );
  };

  return {
    mode: "Value",
    component: ValueWidgetComponent,
  };
}
