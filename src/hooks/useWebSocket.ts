import { useEffect, useRef, useState } from "react";
import type { 
  OutgoingWebSocketMessage,
  IncomingWebSocketMessage,
  GetScannerResultParams,
  SupportedChainName
} from "../types/test-task-types";

interface UseWebSocketProps {
  onMessage: (message: IncomingWebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket({ onMessage, onConnect, onDisconnect, onError }: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const connect = () => {
    try {
      ws.current = new WebSocket("wss://api-rs.dexcelerate.com/ws");

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionError(null);
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: IncomingWebSocketMessage = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        onDisconnect?.();
        
        // Attempt to reconnect after 3 seconds
        // reconnectTimeoutRef.current = setTimeout(() => {
        //   console.log("Attempting to reconnect...");
        //   connect();
        // }, 3000);
      };

      ws.current.onerror = (event) => {
        console.error("WebSocket error:", event);
        setConnectionError("WebSocket connection failed");
        onError?.(event);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionError("Failed to create WebSocket connection");
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const sendMessage = (message: OutgoingWebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected, cannot send message:", message);
    }
  };

  const subscribeToScanner = (filters: GetScannerResultParams) => {
    console.log("Subscribing to scanner with filters:", filters);

    sendMessage({
      event: "scanner-filter",
      data: filters,
    });
  };

  const unsubscribeFromScanner = () => {
    sendMessage({
      event: "unsubscribe-scanner-filter",
      data: {},
    });
  };

  const subscribeToPair = (pairAddress: string, tokenAddress: string, chain: SupportedChainName) => {
    sendMessage({
      event: "subscribe-pair",
      data: {
        pair: pairAddress,
        token: tokenAddress,
        chain,
      },
    });
  };

  const unsubscribeFromPair = (pairAddress: string, tokenAddress: string, chain: SupportedChainName) => {
    sendMessage({
      event: "unsubscribe-pair",
      data: {
        pair: pairAddress,
        token: tokenAddress,
        chain,
      },
    });
  };

  const subscribeToPairStats = (pairAddress: string, tokenAddress: string, chain: SupportedChainName) => {
    sendMessage({
      event: "subscribe-pair-stats",
      data: {
        pair: pairAddress,
        token: tokenAddress,
        chain,
      },
    });
  };

  const unsubscribeFromPairStats = (pairAddress: string, tokenAddress: string, chain: SupportedChainName) => {
    sendMessage({
      event: "unsubscribe-pair-stats",
      data: {
        pair: pairAddress,
        token: tokenAddress,
        chain,
      },
    });
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionError,
    sendMessage,
    subscribeToScanner,
    unsubscribeFromScanner,
    subscribeToPair,
    unsubscribeFromPair,
    subscribeToPairStats,
    unsubscribeFromPairStats,
    reconnect: connect,
  };
}
