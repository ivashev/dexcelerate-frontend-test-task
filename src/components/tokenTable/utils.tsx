import type {TokenData} from "../../types/scanner.ts";

export const ROW_HEIGHT = 80;

// Fixed column widths to prevent jumping
export const COLUMN_WIDTHS = {
  token: 300,
  exchange: 120,
  price: 120,
  marketCap: 140,
  change5m: 100,
  change1h: 100,
  change6h: 100,
  change24h: 100,
  volume: 140,
  age: 100,
  buysSells: 140,
  liquidity: 140,
  audit: 160,
  social: 120,
};

export const TOTAL_TABLE_WIDTH = Object.values(COLUMN_WIDTHS).reduce((sum, width) => sum + width, 0);

export const sortableHeaders = [
  {
    label: 'Token',
    sortKey: null, // TODO
    width: COLUMN_WIDTHS.token,
  },
  {
    label: 'Exchange',
    sortKey: null, // TODO
    width: COLUMN_WIDTHS.exchange,
  },
  {
    label: 'Price',
    sortKey: null, // TODO
    width: COLUMN_WIDTHS.price,
  },
  {
    label: 'Market Cap',
    sortKey: 'mcap',
    width: COLUMN_WIDTHS.marketCap,
  },
  {
    label: '5M',
    sortKey: 'price5M',
    width: COLUMN_WIDTHS.change5m,
  },
  {
    label: '1H',
    sortKey: 'price1H',
    width: COLUMN_WIDTHS.change1h,
  },
  {
    label: '6H',
    sortKey: 'price6H',
    width: COLUMN_WIDTHS.change6h,
  },
  {
    label: '24H',
    sortKey: 'price24H',
    width: COLUMN_WIDTHS.change24h,
  },
  {
    label: 'Volume',
    sortKey: 'volume',
    width: COLUMN_WIDTHS.volume,
  },
  {
    label: 'Age',
    sortKey: 'age',
    width: COLUMN_WIDTHS.age,
  },
  {
    label: 'Buys/Sells',
    sortKey: 'txns',
    width: COLUMN_WIDTHS.buysSells,
  },
  {
    label: 'Liquidity',
    sortKey: 'liquidity',
    width: COLUMN_WIDTHS.liquidity,
  },
];

export interface SortConfig {
  key: keyof TokenData | string | null;
  direction: 'asc' | 'desc';
}
