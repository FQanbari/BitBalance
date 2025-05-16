
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toFixed(decimals);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  const start = address.substring(0, chars);
  const end = address.substring(address.length - chars);
  return `${start}...${end}`;
}

export function getAssetChangeColor(change: number): string {
  return change >= 0 ? 'text-crypto-green' : 'text-crypto-red';
}

export function generateGradient(color: string, opacity = 0.2): string {
  return `linear-gradient(180deg, ${color} 0%, rgba(255, 255, 255, ${opacity}) 100%)`;
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000; // years
  if (interval > 1) return `${Math.floor(interval)}y ago`;
  
  interval = seconds / 2592000; // months
  if (interval > 1) return `${Math.floor(interval)}mo ago`;
  
  interval = seconds / 86400; // days
  if (interval > 1) return `${Math.floor(interval)}d ago`;
  
  interval = seconds / 3600; // hours
  if (interval > 1) return `${Math.floor(interval)}h ago`;
  
  interval = seconds / 60; // minutes
  if (interval > 1) return `${Math.floor(interval)}m ago`;
  
  return `${Math.floor(seconds)}s ago`;
}
