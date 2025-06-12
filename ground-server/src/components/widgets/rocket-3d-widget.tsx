"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Widget, WidgetProps } from "@/lib/definitions";
import * as THREE from "three";

// Rocket component that renders and rotates the 3D model
function Rocket({ orientation }: { orientation: { x: number; y: number; z: number } }) {
  const { scene } = useGLTF("/rocket.glb");
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Convert orientation angles from degrees to radians
      meshRef.current.rotation.x = (orientation.x * Math.PI) / 180;
      meshRef.current.rotation.y = (orientation.y * Math.PI) / 180;
      meshRef.current.rotation.z = (orientation.z * Math.PI) / 180;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={[2, 2, 2]} position={[0, -5, 0]} />
    </group>
  );
}

// Loading fallback component
function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function Rocket3DWidget(): Widget {
  const Rocket3DWidgetComponent = ({ fieldData, channel }: WidgetProps) => {
    const [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      // Expect the channel to have 3 dbFields: orientation_x, orientation_y, orientation_z
      if (channel.dbFields.length >= 3) {
        const xFieldData = fieldData[channel.dbFields[0]] || {};
        const yFieldData = fieldData[channel.dbFields[1]] || {};
        const zFieldData = fieldData[channel.dbFields[2]] || {};

        const xKeys = Object.keys(xFieldData).sort();
        const yKeys = Object.keys(yFieldData).sort();
        const zKeys = Object.keys(zFieldData).sort();

        if (xKeys.length > 0 && yKeys.length > 0 && zKeys.length > 0) {
          const latestXKey = xKeys[xKeys.length - 1];
          const latestYKey = yKeys[yKeys.length - 1];
          const latestZKey = zKeys[zKeys.length - 1];

          const x = xFieldData[latestXKey] as number;
          const y = yFieldData[latestYKey] as number;
          const z = zFieldData[latestZKey] as number;

          if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
            setOrientation({ x, y, z });
          }
        }
      }
    }, [fieldData, channel.dbFields]);

    if (!isClient) {
      return <LoadingSpinner />;
    }

    return (
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={7} />
        <directionalLight position={[0, 0, 15]} intensity={7} />
        
        <Rocket orientation={orientation} />
      </Canvas>
    );
  };

  return {
    mode: "3D Rocket",
    component: Rocket3DWidgetComponent,
  };
}