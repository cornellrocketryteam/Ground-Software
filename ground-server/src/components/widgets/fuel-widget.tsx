import Image from "next/image";
import type { Widget } from "@/lib/definitions";
import rocket from "@/app/images/rocket.png";

export default function FuelWidget(): Widget {
  const FuelWidgetComponent = () => {
    const scalingFactor = 0.5;
    // Replace with actual fuel level from data when available
    const fuelLevel = Math.floor(Math.random() * 100 * scalingFactor);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative h-full flex">
          <Image
            src={rocket}
            alt="Rocket"
            className="h-full w-auto object-contain"
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-1/4 w-1/2 bg-green-500 opacity-75"
            style={{ height: `${fuelLevel}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return {
    mode: "3D Illustration",
    component: FuelWidgetComponent,
  };
}
