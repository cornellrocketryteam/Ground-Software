"use client"; // If you're in the Next.js App Router (app folder) and using client components

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type WebSocketContextType = {
  ws: WebSocket | null;
};

const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Create the WebSocket connection once on mount
  useEffect(() => {
    // Adjust your WebSocket URL as needed
    const url = "ws://10.48.59.182:8080/ws";

    // Create and store the WebSocket instance
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => {
      console.log("WebSocket connection opened:", url);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.reason, event.code);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws }}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Convenience hook to easily consume the WebSocket context anywhere
export function useWebSocket() {
  return useContext(WebSocketContext);
}
