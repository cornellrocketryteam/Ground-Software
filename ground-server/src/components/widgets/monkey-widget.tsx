import Image from "next/image";
import { type WidgetProps } from "@/lib/definitions";
import monkey from "@/app/images/monkey-parachuting.png";

export default function MonkeyWidget({ mode }: WidgetProps) {
  if (mode === "3D Illustration") {
    // Replace with actual fuel level from data when available
    const degrees = Math.floor(Math.random() * 60) - 20;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={monkey}
          alt="Monkey Parachuting"
          className="h-full w-auto object-contain"
          style={{ "rotate": `${degrees}deg` }}
        />
      </div>
    );
  }

  return <div>Unsupported mode</div>;
}
