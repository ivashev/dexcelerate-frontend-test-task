import BigNumber from 'bignumber.js';
import type { TokenData } from "../types/scanner";

// Configure BigNumber for high precision
BigNumber.config({ DECIMAL_PLACES: 50, ROUNDING_MODE: BigNumber.ROUND_DOWN });

// Map for converting digits to subscript characters
const subscriptMap: { [key: string]: string } = {
  "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
  "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉"
};

function toSubscript(num: number): string {
  return num.toString().split('').map(digit => subscriptMap[digit] || digit).join('');
}

export function formatPrice(price: number | string): string {
  const bn = new BigNumber(price);
  
  if (bn.isZero() || bn.isNaN()) {
    return '$0.00';
  }

  if (bn.isLessThan(0.001)) {
    const priceStr = bn.toFixed();

    if (priceStr.startsWith('0.')) {
      const afterDecimal = priceStr.slice(2); // Remove "0."
      const leadingZeros = afterDecimal.match(/^0+/)?.[0] || '';
      
      if (leadingZeros.length >= 3) {
        const significantPart = afterDecimal.slice(leadingZeros.length);
        const displayDigits = significantPart.slice(0, 3);
        const subscriptZeroCount = toSubscript(leadingZeros.length);

        return `$0.0${subscriptZeroCount}${displayDigits}`;
      }
    }
    
    // Fallback to exponential notation for extremely small numbers
    return `$${bn.toExponential(2)}`;
  }
  else if (bn.isLessThan(1)) {
    const priceStr = bn.toFixed(8); // Higher precision for small decimals
    const afterDecimal = priceStr.slice(2); // Remove "0."
    const leadingZeros = afterDecimal.match(/^0+/)?.[0] || '';
    
    if (leadingZeros.length >= 3) {
      const significantPart = afterDecimal.slice(leadingZeros.length);
      const displayDigits = significantPart.slice(0, 3);
      const subscriptZeroCount = toSubscript(leadingZeros.length);
      return `$0.0${subscriptZeroCount}${displayDigits}`;
    } else {
      // Regular formatting for numbers with fewer leading zeros
      return `$${bn.toFixed(6).replace(/\.?0+$/, '')}`;
    }
  }
  // For numbers >= 1
  else {
    return `$${bn.toFixed(2)}`;
  }
}

export function formatMarketCap(mcap: number): string {
  if (mcap >= 1e9) {
    return `$${(mcap / 1e9).toFixed(2)}B`;
  } else if (mcap >= 1e6) {
    return `$${(mcap / 1e6).toFixed(2)}M`;
  } else if (mcap >= 1e3) {
    return `$${(mcap / 1e3).toFixed(2)}K`;
  } else {
    return `$${mcap.toFixed(2)}`;
  }
}

export function formatVolume(volume: number): string {
  if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`;
  } else {
    return `$${volume.toFixed(2)}`;
  }
}

export function formatPercentage(percentage: number): string {
  const formatted = percentage > 0 ? `+${percentage.toFixed(2)}%` : `${percentage.toFixed(2)}%`;
  return formatted;
}

export function getPercentageColor(percentage: number): string {
  if (percentage > 0) {
    return "text-dex-success";
  } else if (percentage < 0) {
    return "text-dex-danger";
  } else {
    return "text-dex-text";
  }
}

export function getChainColor(chain: string): string {
  switch (chain) {
    case "ETH":
      return "bg-blue-500";
    case "SOL":
      return "bg-purple-500";
    case "BASE":
      return "bg-blue-600";
    case "BSC":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}

export function formatTransactions(count: number): string {
  if (count >= 1e3) {
    return `${(count / 1e3).toFixed(1)}K`;
  }

  return count.toString();
}

export function updateTokenWithTick(token: TokenData, tickData: any): TokenData {
  // Extract the latest valid swap from the tick data
  const latestSwap = tickData.swaps?.filter((swap: any) => !swap.isOutlier).pop();
  
  if (!latestSwap) {
    return token;
  }

  const newPrice = new BigNumber(latestSwap.priceToken1Usd).toString();

  const totalSupply = new BigNumber(token.rawData.token1TotalSupplyFormatted);
  const newMarketCap = totalSupply.multipliedBy(newPrice).toNumber();

  const isBuy = latestSwap.tokenInAddress === token.tokenAddress;
  const isSell = latestSwap.tokenInAddress !== token.tokenAddress;

  return {
    ...token,
    priceUsd: parseFloat(newPrice),
    mcap: newMarketCap,
    // Update transaction counts
    transactions: {
      buys: token.transactions.buys + (isBuy ? 1 : 0),
      sells: token.transactions.sells + (isSell ? 1 : 0),
    },
    // Update volume (this would need to be accumulated from multiple ticks)
    volumeUsd: token.volumeUsd + (parseFloat(latestSwap.amountToken1Usd) || 0),
  };
}