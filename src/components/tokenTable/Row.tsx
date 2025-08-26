import type { TokenData } from "../../types/scanner.ts";
import {
  formatPrice,
  formatMarketCap,
  formatVolume,
  formatPercentage,
  getPercentageColor,
  getChainColor, formatTransactions,
} from "../../utils/tokenUtils.ts";

import AuditIndicators from "./AuditIndicators.tsx";
import SocialLinks from "./SocialLinks.tsx";

import { COLUMN_WIDTHS, ROW_HEIGHT } from "./utils.tsx";

const Row = ({ index, token }: { index: number; token: TokenData }) => {
  if (!token) return null;

  const rank = index + 1; // Assuming 50 items per page

  return (
    <tr className="hover:bg-dex-secondary/50 transition-colors" style={{ height: ROW_HEIGHT }}>
      <td className="px-6 py-4" style={{ 
        width: COLUMN_WIDTHS.token, 
        minWidth: COLUMN_WIDTHS.token,
        maxWidth: COLUMN_WIDTHS.token,
        overflow: 'hidden'
      }}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 min-w-0">
            <span 
              className={`bg-gray-600 text-white text-xs px-2 py-1 rounded font-bold flex-shrink-0`}
            >
              #{rank}
            </span>
            <div className="flex flex-col min-w-0">
              <span className={`text-white font-medium truncate`}>
                {token.tokenSymbol}
              </span>
              <span className="text-xs text-dex-text truncate">{token.tokenName}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${getChainColor(token.chain)} text-white flex-shrink-0`}>
              {token.chain}
            </span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4" style={{ 
        width: COLUMN_WIDTHS.exchange,
        minWidth: COLUMN_WIDTHS.exchange,
        maxWidth: COLUMN_WIDTHS.exchange,
        overflow: 'hidden'
      }}>
        <div className="text-xs text-dex-text truncate">
          {token.exchange}
        </div>
      </td>

      <td className="px-6 py-4" style={{ width: COLUMN_WIDTHS.price }}>
        <div className="text-white font-medium text-nowrap">
          {formatPrice(token.priceUsd)}
        </div>
      </td>

      <td className="px-6 py-4" style={{ width: COLUMN_WIDTHS.marketCap }}>
        <div className="text-white font-medium">
          {formatMarketCap(token.mcap)}
        </div>
      </td>

      <td className={`px-6 py-4 ${getPercentageColor(token.priceChangePcs["5m"])}`} style={{ width: COLUMN_WIDTHS.change5m }}>
        {formatPercentage(token.priceChangePcs["5m"])}
      </td>

      <td className={`px-6 py-4 ${getPercentageColor(token.priceChangePcs["1h"])}`} style={{ width: COLUMN_WIDTHS.change1h }}>
        {formatPercentage(token.priceChangePcs["1h"])}
      </td>

      <td className={`px-6 py-4 ${getPercentageColor(token.priceChangePcs["6h"])}`} style={{ width: COLUMN_WIDTHS.change6h }}>
        {formatPercentage(token.priceChangePcs["6h"])}
      </td>

      <td className={`px-6 py-4 ${getPercentageColor(token.priceChangePcs["24h"])}`} style={{ width: COLUMN_WIDTHS.change24h }}>
        {formatPercentage(token.priceChangePcs["24h"])}
      </td>

      <td className="px-6 py-4" style={{ width: COLUMN_WIDTHS.volume }}>
        <div className="text-white font-medium">
          {formatVolume(token.volumeUsd)}
        </div>
      </td>
      
      <td className="px-6 py-4 text-dex-text" style={{ width: COLUMN_WIDTHS.age }}>
        {token.age}
      </td>

      <td className="px-6 py-4" style={{ width: COLUMN_WIDTHS.buysSells }}>
        <div className="text-dex-text text-xs text-nowrap">
          {formatTransactions(token.transactions.buys)} / {formatTransactions(token.transactions.sells)}
        </div>
      </td>

      <td className="px-6 py-4" style={{ width: COLUMN_WIDTHS.liquidity }}>
        <div className="text-white font-medium">
          {formatMarketCap(token.liquidity.current)}
        </div>
        <div className={`text-xs ${getPercentageColor(token.liquidity.changePc)}`}>
          {formatPercentage(token.liquidity.changePc)}
        </div>
      </td>

      <td className="px-6 py-4" style={{ width: COLUMN_WIDTHS.audit }}>
        <AuditIndicators
          audit={token.audit}
        />
      </td>

      <td className="px-6 py-4" style={{ 
        width: COLUMN_WIDTHS.social,
        minWidth: COLUMN_WIDTHS.social,
        maxWidth: COLUMN_WIDTHS.social,
        overflow: 'hidden'
      }}>
        <div className="flex items-center justify-start space-x-2">
          <SocialLinks socialLinks={token.socialLinks} />
        </div>
      </td>
    </tr>
  );
}

export default Row;
