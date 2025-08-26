import {useEffect, useRef} from "react";
import type { IncomingWebSocketMessage, ScannerResult} from "../types/test-task-types";
import type { TokenData } from "../types/scanner";
import { convertScannerResultToTokenData } from "../types/scanner";
import { useWebSocket } from "./useWebSocket.ts";
import { updateTokenWithTick } from "../utils/tokenUtils";


export function useRealtimeUpdate({ 
  tokens, 
  setTokens, 
  filters
}: {
  tokens: TokenData[];
  setTokens: React.Dispatch<React.SetStateAction<TokenData[]>>;
  filters: any;
}) {
  const subscribedPairsRef = useRef<Set<string>>(new Set());

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: IncomingWebSocketMessage) => {
    switch (message.event) {
      case "scanner-pairs": {
        console.log("Received scanner pairs:", message.data.results.pairs);

        const newPairsMap = new Map(
          message.data.results.pairs.map((pair: ScannerResult) => [pair.pairAddress, pair])
        );
        
        // Update existing tokens with new data while preserving price/mcap data
        setTokens(prevTokens => {
          const updatedTokens = prevTokens
            .map(existingToken => {
              const newPairData = newPairsMap.get(existingToken.pairAddress);
              if (newPairData) {
                // Preserve existing price/mcap data if available
                const updatedToken = convertScannerResultToTokenData(newPairData, existingToken.rank || 0);
                
                // Preserve existing price data if the new data doesn't have it
                if (existingToken.priceUsd && (!updatedToken.priceUsd || updatedToken.priceUsd === 0)) {
                  updatedToken.priceUsd = existingToken.priceUsd;
                }
                
                // Preserve existing mcap data if the new data doesn't have it
                if (existingToken.mcap && (!updatedToken.mcap || updatedToken.mcap === 0)) {
                  updatedToken.mcap = existingToken.mcap;
                }
                
                return updatedToken;
              }

              return null; // Mark for removal
            })
            .filter((token): token is TokenData => token !== null);
          
          // Add any completely new pairs that weren't in the existing tokens
          const existingPairAddresses = new Set(prevTokens.map(token => token.pairAddress));
          const newPairs = message.data.results.pairs
            .filter((pair: ScannerResult) => !existingPairAddresses.has(pair.pairAddress))
            .map((pair: ScannerResult, index: number) => {
              const globalIndex = updatedTokens.length + index;
              return convertScannerResultToTokenData(pair, globalIndex);
            });
          
          return [...updatedTokens, ...newPairs];
        });
        break;
      }

      case "tick":
        setTokens(prevTokens => 
          prevTokens.map(token => {
            if (token.pairAddress === message.data.pair.pair) {
              return updateTokenWithTick(token, message.data);
            }
            return token;
          })
        );
        break;

      case "pair-stats":
        setTokens(prevTokens =>
          prevTokens.map(token => {
            if (token.pairAddress === message.data.pair.pairAddress) {
              return {
                ...token,
                audit: {
                  ...token.audit,
                  mintable: message.data.pair.mintAuthorityRenounced,
                  freezable: message.data.pair.freezeAuthorityRenounced,
                  honeypot: !message.data.pair.token1IsHoneypot,
                  contractVerified: message.data.pair.isVerified,
                },
                socialLinks: {
                  ...token.socialLinks,
                  discord: message.data.pair.linkDiscord,
                  telegram: message.data.pair.linkTelegram,
                  twitter: message.data.pair.linkTwitter,
                  website: message.data.pair.linkWebsite,
                },
                dexPaid: message.data.pair.dexPaid,
              };
            }
            return token;
          })
        );
        break;

      default:
        console.log("Unhandled WebSocket message:", message);
    }
  };

  const {
    isConnected: isWSConnected,
    connectionError: wsError,
    subscribeToScanner,
    unsubscribeFromScanner,
    subscribeToPair,
    subscribeToPairStats,
  } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      console.log("WebSocket connected, subscribing to scanner");
      subscribeToScanner(filters);
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  // Subscribe to individual pairs for real-time updates
  const subscribeToTokenPairs = (tokens: TokenData[]) => {
    tokens.forEach(token => {
      const pairKey = `${token.pairAddress}-${token.chain}`;

      if (!subscribedPairsRef.current.has(pairKey)) {
        subscribeToPair(token.pairAddress, token.tokenAddress, token.chain);
        subscribeToPairStats(token.pairAddress, token.tokenAddress, token.chain);

        subscribedPairsRef.current = subscribedPairsRef.current.add(pairKey);
      }
    });
  };

  useEffect(() => {
    if (isWSConnected) {
      unsubscribeFromScanner()
      subscribeToScanner(filters);
    }
  }, [filters, isWSConnected]);

  useEffect(() => {
    if (isWSConnected) {
      subscribeToTokenPairs(tokens);
    }
  }, [ tokens, isWSConnected ])

  return {
    isWSConnected,
    subscribeToTokenPairs,
    wsError,
  }
}
