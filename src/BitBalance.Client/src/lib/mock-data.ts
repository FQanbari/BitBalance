
import { Asset, Portfolio, Alert, Allocation } from '@/types';

const colorPalette = [
  '#8B5CF6', // Purple (primary)
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
];

export const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Main Portfolio',
    totalValue: 15420.35,
    totalProfit: 2340.75,
    profitPercentage: 17.9,
    assets: [],
    createdAt: '2023-01-15T12:30:00Z',
    updatedAt: '2023-05-16T09:45:00Z',
  },
  {
    id: '2',
    name: 'Long Term Hodl',
    totalValue: 8730.22,
    totalProfit: -345.12,
    profitPercentage: -3.8,
    assets: [],
    createdAt: '2023-02-10T14:20:00Z',
    updatedAt: '2023-05-15T16:30:00Z',
  },
  {
    id: '3',
    name: 'Altcoin Experiments',
    totalValue: 2150.87,
    totalProfit: 780.44,
    profitPercentage: 56.9,
    assets: [],
    createdAt: '2023-03-05T09:15:00Z',
    updatedAt: '2023-05-16T11:20:00Z',
  },
];

export const mockAssets: { [key: string]: Asset[] } = {
  '1': [
    {
      id: '101',
      portfolioId: '1',
      coinSymbol: 'BTC',
      coinName: 'Bitcoin',
      quantity: 0.25,
      purchasePrice: 35000,
      currentPrice: 40000,
      value: 10000,
      profit: 1250,
      profitPercentage: 14.28,
      allocation: 64.85,
      purchaseDate: '2023-01-20T10:30:00Z',
    },
    {
      id: '102',
      portfolioId: '1',
      coinSymbol: 'ETH',
      coinName: 'Ethereum',
      quantity: 2.5,
      purchasePrice: 1800,
      currentPrice: 2100,
      value: 5250,
      profit: 750,
      profitPercentage: 16.67,
      allocation: 34.05,
      purchaseDate: '2023-01-25T14:45:00Z',
    },
    {
      id: '103',
      portfolioId: '1',
      coinSymbol: 'SOL',
      coinName: 'Solana',
      quantity: 5,
      currentPrice: 34.07,
      purchasePrice: 30.50,
      value: 170.35,
      profit: 17.85,
      profitPercentage: 11.7,
      allocation: 1.1,
      purchaseDate: '2023-02-15T11:20:00Z',
    },
  ],
  '2': [
    {
      id: '201',
      portfolioId: '2',
      coinSymbol: 'BTC',
      coinName: 'Bitcoin',
      quantity: 0.15,
      purchasePrice: 42000,
      currentPrice: 40000,
      value: 6000,
      profit: -300,
      profitPercentage: -4.76,
      allocation: 68.73,
      purchaseDate: '2023-02-12T09:15:00Z',
    },
    {
      id: '202',
      portfolioId: '2',
      coinSymbol: 'ETH',
      coinName: 'Ethereum',
      quantity: 1.3,
      purchasePrice: 2200,
      currentPrice: 2100,
      value: 2730,
      profit: -130,
      profitPercentage: -4.55,
      allocation: 31.27,
      purchaseDate: '2023-02-18T13:40:00Z',
    },
  ],
  '3': [
    {
      id: '301',
      portfolioId: '3',
      coinSymbol: 'AVAX',
      coinName: 'Avalanche',
      quantity: 20,
      purchasePrice: 15.5,
      currentPrice: 23.75,
      value: 475,
      profit: 165,
      profitPercentage: 53.23,
      allocation: 22.08,
      purchaseDate: '2023-03-10T10:00:00Z',
    },
    {
      id: '302',
      portfolioId: '3',
      coinSymbol: 'DOT',
      coinName: 'Polkadot',
      quantity: 50,
      purchasePrice: 7.2,
      currentPrice: 10.3,
      value: 515,
      profit: 155,
      profitPercentage: 43.06,
      allocation: 23.94,
      purchaseDate: '2023-03-15T16:20:00Z',
    },
    {
      id: '303',
      portfolioId: '3',
      coinSymbol: 'ATOM',
      coinName: 'Cosmos',
      quantity: 60,
      purchasePrice: 8.5,
      currentPrice: 11.4,
      value: 684,
      profit: 174,
      profitPercentage: 34.12,
      allocation: 31.80,
      purchaseDate: '2023-03-20T11:30:00Z',
    },
    {
      id: '304',
      portfolioId: '3',
      coinSymbol: 'MATIC',
      coinName: 'Polygon',
      quantity: 300,
      purchasePrice: 0.85,
      currentPrice: 1.59,
      value: 477,
      profit: 222,
      profitPercentage: 87.06,
      allocation: 22.18,
      purchaseDate: '2023-03-25T14:15:00Z',
    },
  ],
};

export const mockAlerts: Alert[] = [
  {
    id: '1001',
    portfolioId: '1',
    coinSymbol: 'BTC',
    coinName: 'Bitcoin',
    targetPrice: 45000,
    currentPrice: 40000,
    type: 'Above',
    triggered: false,
    createdAt: '2023-04-10T09:30:00Z',
  },
  {
    id: '1002',
    portfolioId: '1',
    coinSymbol: 'ETH',
    coinName: 'Ethereum',
    targetPrice: 1800,
    currentPrice: 2100,
    type: 'Below',
    triggered: false,
    createdAt: '2023-04-12T14:45:00Z',
  },
  {
    id: '1003',
    portfolioId: '2',
    coinSymbol: 'BTC',
    coinName: 'Bitcoin',
    targetPrice: 38000,
    currentPrice: 40000,
    type: 'Below',
    triggered: false,
    createdAt: '2023-04-15T11:20:00Z',
  },
];

// Generate allocation data from assets
export const generateAllocationData = (assets: Asset[]): Allocation[] => {
  return assets.map((asset, index) => ({
    coinSymbol: asset.coinSymbol,
    coinName: asset.coinName,
    value: asset.value,
    percentage: asset.allocation,
    color: colorPalette[index % colorPalette.length],
  }));
};

// Complete the portfolios with assets
mockPortfolios.forEach(portfolio => {
  portfolio.assets = mockAssets[portfolio.id] || [];
});
