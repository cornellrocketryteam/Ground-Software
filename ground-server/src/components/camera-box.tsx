"use client";

interface CameraBoxProps {
  text: string;
}

export function CameraBox({ text }: CameraBoxProps) {
  return (
    <div className="p-6 border dark:border-white rounded-lg shadow-md w-full h-48 flex items-center justify-center">
      <p className="text-center text-lg font-bold">{text}</p>
    </div>
  );
}
