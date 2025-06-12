"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Widget, WidgetProps } from "@/lib/definitions";
import "leaflet/dist/leaflet.css";

// Dynamically import all react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

export default function MapWidget(): Widget {
  const MapWidgetComponent = ({ fieldData, channel }: WidgetProps) => {
    const [isClient, setIsClient] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<[number, number] | null>([32.08085331120362, -102.08928651806336]);
    const [pathPositions, setPathPositions] = useState<[number, number][]>([]);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (channel.dbFields.length >= 2) {
        const latFieldData = fieldData[channel.dbFields[0]] || {};
        const lonFieldData = fieldData[channel.dbFields[1]] || {};
        
        const latKeys = Object.keys(latFieldData).sort();
        const lonKeys = Object.keys(lonFieldData).sort();
        
        // Get common timestamps that exist in both lat and lon data
        const commonTimestamps = latKeys.filter(timestamp => lonKeys.includes(timestamp));
        
        if (commonTimestamps.length === 0) return;
        
        // Group positions by 30-second intervals
        const intervalMap = new Map<number, { lats: number[], lons: number[], timestamp: string }>();
        
        commonTimestamps.forEach(timestamp => {
          const lat = latFieldData[timestamp] as number;
          const lon = lonFieldData[timestamp] as number;
          
          if (typeof lat === 'number' && typeof lon === 'number') {
            // Convert timestamp to Date and find 30-second interval
            const date = new Date(timestamp);
            const intervalStart = Math.floor(date.getTime() / 30000) * 30000; // 30 seconds in milliseconds
            
            if (!intervalMap.has(intervalStart)) {
              intervalMap.set(intervalStart, { lats: [], lons: [], timestamp });
            }
            
            const interval = intervalMap.get(intervalStart)!;
            interval.lats.push(lat);
            interval.lons.push(lon);
            interval.timestamp = timestamp; // Keep the latest timestamp in interval
          }
        });
        
        // Convert intervals to averaged positions
        const path: [number, number][] = [];
        const sortedIntervals = Array.from(intervalMap.entries()).sort((a, b) => a[0] - b[0]);
        
        sortedIntervals.forEach(([, data]) => {
          // Average the positions in each interval
          const avgLat = data.lats.reduce((sum, lat) => sum + lat, 0) / data.lats.length;
          const avgLon = data.lons.reduce((sum, lon) => sum + lon, 0) / data.lons.length;
          path.push([avgLat, avgLon]);
        });
        
        if (path.length > 0) {
          setPathPositions(path);
          
          // Set current position to the latest actual reading (not averaged)
          const lastTimestamp = commonTimestamps[commonTimestamps.length - 1];
          const lastLat = latFieldData[lastTimestamp] as number;
          const lastLon = lonFieldData[lastTimestamp] as number;
          setCurrentPosition([lastLat, lastLon]);
        }
      }
    }, [fieldData, channel.dbFields]);

    if (!isClient) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      );
    }

    if (!currentPosition) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p>No GPS data available</p>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative">
        <MapContainer
          center={currentPosition}
          dragging={false}
          zoom={12}
          className="absolute inset-0 w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Draw the path */}
          {pathPositions.length > 1 && (
            <Polyline
              positions={pathPositions}
              color="blue"
              weight={3}
              opacity={0.7}
            />
          )}
          
          {/* Mark current position with a red dot */}
          {currentPosition && (
            <CircleMarker
              center={currentPosition}
              radius={8}
              fillColor="red"
              color="darkred"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
            />
          )}
        </MapContainer>
      </div>
    );
  };

  return {
    mode: "Map",
    component: MapWidgetComponent,
  };
}