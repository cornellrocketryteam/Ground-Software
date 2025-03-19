import type { Widget, WidgetProps } from "@/lib/definitions";
import { useData } from "@/contexts/data-context";

export default function EventCounterWidget(): Widget {
  const EventCounterWidgetComponent = ({
    measurement,
    channel,
  }: WidgetProps) => {
    const { data } = useData();

    if (
      !data[measurement] ||
      !data[measurement][channel.dbField] ||
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
    const count = fieldData.filter((dp) => dp.value as boolean).length;
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">{count}</p>
      </div>
    );
  };

  return {
    mode: "Count",
    component: EventCounterWidgetComponent,
  };
}
