import type { Widget, WidgetProps } from "@/lib/definitions";

export default function EventCounterWidget(): Widget {
  const EventCounterWidgetComponent = ({ fieldData, channel }: WidgetProps) => {
    const count = Object.values(fieldData).filter(
      (value) => value as boolean
    ).length;
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
