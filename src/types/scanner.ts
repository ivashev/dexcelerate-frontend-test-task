import type { ScannerResult, SupportedChainName } from "./test-task-types.ts";

export interface TokenData {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  pairAddress: string;
  chain: SupportedChainName;
  exchange: string;
  priceUsd: string | number;
  volumeUsd: number;
  mcap: number;
  priceChangePcs: {
    "5m": number;
    "1h": number;
    "6h": number;
    "24h": number;
  };
  transactions: {
    buys: number;
    sells: number;
  };
  audit: {
    mintable: boolean;
    freezable: boolean;
    honeypot: boolean;
    contractVerified: boolean;
  };
  tokenCreatedTimestamp: Date;
  liquidity: {
    current: number;
    changePc: number;
  };
  rank?: number;
  age: string;
  socialLinks?: {
    discord?: string | null;
    telegram?: string | null;
    twitter?: string | null;
    website?: string | null;
  };
  rawData: ScannerResult
}



// Updated filters interface
export interface ScannerFilters {
  chain: SupportedChainName | null;
  rankBy: string;
  orderBy: "asc" | "desc" | undefined;
  timeFrame?: string;
  isNotHP: boolean | null;
  minVol24H: number | null;
  maxAge: number | null;
  page?: number;
}

const _parseFloat = (number: string) => {
  const result = parseFloat(number);

  return isNaN(result) ? 0 : result;
}

export function convertScannerResultToTokenData(result: ScannerResult, index: number): TokenData {
  const chain = chainIdToName(result.chainId);
  
  // Calculate market cap using priority order from API response
  // const token1TotalSupplyFormatted = _parseFloat(result.token1TotalSupplyFormatted);
  // const price = _parseFloat(result.price);


  let mcap = 0;

  // if (token1TotalSupplyFormatted > 0 && price > 0) {
  //   mcap = token1TotalSupplyFormatted * price
  // } else
  if (_parseFloat(result.currentMcap) > 0) {
    mcap = _parseFloat(result.currentMcap);
  } else if (_parseFloat(result.initialMcap) > 0) {
    mcap = _parseFloat(result.initialMcap);
  } else if (_parseFloat(result.pairMcapUsd) > 0) {
    mcap = _parseFloat(result.pairMcapUsd);
  } else if (_parseFloat(result.pairMcapUsdInitial) > 0) {
    mcap = _parseFloat(result.pairMcapUsdInitial);
  }

  // Use router address or virtual router type as exchange
  const exchange = result.virtualRouterType || result.routerAddress || "Unknown";

  return {
    id: result.pairAddress,
    tokenName: result.token1Name,
    tokenSymbol: result.token1Symbol,
    tokenAddress: result.token1Address,
    pairAddress: result.pairAddress,
    chain,
    exchange,
    priceUsd: result.price,
    volumeUsd: _parseFloat(result.volume),
    mcap,
    priceChangePcs: {
      "5m": _parseFloat(result.diff5M),
      "1h": _parseFloat(result.diff1H),
      "6h": _parseFloat(result.diff6H),
      "24h": _parseFloat(result.diff24H),
    },
    transactions: {
      buys: result.buys || 0,
      sells: result.sells || 0,
    },
    audit: {
      mintable: result.isMintAuthDisabled,
      freezable: result.isFreezeAuthDisabled,
      honeypot: !result.honeyPot,
      contractVerified: result.contractVerified,
    },
    tokenCreatedTimestamp: new Date(result.age),
    liquidity: {
      current: _parseFloat(result.liquidity),
      changePc: _parseFloat(result.percentChangeInLiquidity),
    },
    rank: index + 1,
    age: formatAge(result.age),
    socialLinks: {
      discord: result.discordLink,
      telegram: result.telegramLink,
      twitter: result.twitterLink,
      website: result.webLink,
    },
    rawData: result,
  };
}

function chainIdToName(chainId: number): SupportedChainName {
  switch (chainId.toString()) {
    case "1":
      return "ETH";
    case "56":
      return "BSC";
    case "8453":
      return "BASE";
    case "900":
      return "SOL";
    default:
      return "ETH";
  }
}

function formatAge(dateString: string): string {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "< 1m";
  }
}
