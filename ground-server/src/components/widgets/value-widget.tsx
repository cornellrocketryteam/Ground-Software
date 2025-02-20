import type { Widget, WidgetProps } from "@/lib/definitions";
import { useData } from "@/contexts/data-context";

export default function ValueWidget(): Widget {
  const ValueWidgetComponent = ({ channel }: WidgetProps) => {
    const { data } = useData();
    const fieldData = data[channel.dbField];

    if (fieldData === undefined || fieldData.length === 0) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
          <p className="font-semibold text-lg">{channel.label}</p>
          <p className="font-normal text-lg">No data</p>
        </div>
      );
    }

    const latestValue = (fieldData[fieldData.length - 1].value as object).toString();
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">{latestValue} {channel.unit || ""}</p>
      </div>
    );
  }

  return {
    mode: "Value",
    component: ValueWidgetComponent,
  }
}
