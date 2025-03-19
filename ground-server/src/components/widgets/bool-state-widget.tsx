import type { Widget, WidgetProps } from "@/lib/definitions";
import { useData } from "@/contexts/data-context";

export default function BoolStateWidget(
  onStateLabel: string,
  offStateLabel: string
): Widget {
  const BoolStateWidgetComponent = ({ measurement, channel }: WidgetProps) => {
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
    const latestValue = fieldData[fieldData.length - 1].value as boolean;
    const displayValue = latestValue ? onStateLabel : offStateLabel;

    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">{displayValue}</p>
      </div>
    );
  };

  return {
    mode: "State",
    component: BoolStateWidgetComponent,
  };
}
