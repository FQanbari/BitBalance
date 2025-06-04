
export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalProfit: number;
  profitPercentage: number;
  assets: Asset[];
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  portfolioId: string;
  coinSymbol: string;
  coinName: string;
  currency: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  profit: number;
  profitPercentage: number;
  allocation: number;
  purchaseDate: string;
}

export interface Alert {
  id: string;
  portfolioId: string;
  portfolioName?: string;
  coinSymbol: string;
  coinName: string;
  targetPrice: number;
  currentPrice: number;
  currency: string;
  type: "Above" | "Below";
  triggered: boolean;
  createdAt: string;
}

export interface Allocation {
  coinSymbol: string;
  coinName: string;
  value: number;
  percentage: number;
  color: string;
}

export type TimeRange = "1d" | "1w" | "1m" | "3m" | "1y" | "all";

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    defaultCurrency: string;
    notifications: {
      email: boolean;
      telegram: boolean;
    };
  };
}
export interface UserSettings {
    defaultCurrency: string;
    notificationMethod: 'Email' | 'Telegram' | 'None'; 
    theme: 'light' | 'dark' | 'system';
    language: string;
    notificationEmail?:string;
    telegramHandle?:string;
}
