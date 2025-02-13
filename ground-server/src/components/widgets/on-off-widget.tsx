import { type WidgetProps } from "@/lib/definitions";
import { useData } from "@/contexts/data-context";

export default function OnOffWidget(onStateLabel: string, offStateLabel: string) {
  const OnOffValueWidget = ({ channel }: WidgetProps) => {
    const { data } = useData();
    const fieldData = data[channel.dbField];

    if (!fieldData || fieldData.length === 0) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
          <p className="font-semibold text-lg">{channel.label}</p>
          <p className="font-normal text-lg">No data</p>
        </div>
      );
    }

    const latestValue = fieldData[fieldData.length - 1].value as boolean;
    const displayValue = latestValue ? onStateLabel : offStateLabel;

    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-2">
        <p className="font-semibold text-lg">{channel.label}</p>
        <p className="font-normal text-lg">{displayValue}</p>
      </div>
    );
  };

  // Return the component constructor (not an instance)
  return OnOffValueWidget;
}