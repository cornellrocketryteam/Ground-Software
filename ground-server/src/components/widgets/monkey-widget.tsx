import Image from "next/image";
import type { Widget, WidgetProps } from "@/lib/definitions";
import monkey from "@/app/images/monkey-parachuting.png";

export default function MonkeyWidget(): Widget {
  const MonkeyWidgetComponent = ({ fieldData }: WidgetProps) => {
    const sortedKeys = Object.keys(fieldData).sort();
    const latestKey = sortedKeys[sortedKeys.length - 1];
    const latestValue = fieldData[latestKey] as number;

    // Given that the value is between 0 and 1, we can convert it to a degree rotation
    // where 0 corresponds to -45 degrees and 1 corresponds to 45 degrees.
    // This will rotate the image from -45 degrees to 45 degrees based on the value.
    const degrees = latestValue * 90 - 45;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={monkey}
          alt="Monkey Parachuting"
          className="h-full w-auto object-contain"
          style={{ rotate: `${degrees}deg` }}
        />
      </div>
    );
  };

  return {
    mode: "Monkey",
    component: MonkeyWidgetComponent,
  };
}
