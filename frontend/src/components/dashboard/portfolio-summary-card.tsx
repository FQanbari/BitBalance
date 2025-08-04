
import React from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Portfolio } from '@/types';
import { formatCurrency, formatPercentage, getAssetChangeColor, cn } from '@/lib/utils';

interface PortfolioSummaryCardProps {
  portfolio: Portfolio;
}

const PortfolioSummaryCard: React.FC<PortfolioSummaryCardProps> = ({ portfolio }) => {
  const isPositive = portfolio.profitPercentage >= 0;
  
  return (
    <div className="crypto-card animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{portfolio.name}</h3>
        <Link 
          to={`/portfolios/${portfolio.id}`}
          className="text-sm text-primary flex items-center gap-1 hover:underline"
        >
          <span>View</span>
          <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="mt-4">
        <div className="text-2xl font-bold">
          {formatCurrency(portfolio.totalValue)}
        </div>
        
        <div className="flex items-center mt-2">
          <div className={cn(
            "flex items-center gap-1 text-sm",
            isPositive ? "text-crypto-green" : "text-crypto-red"
          )}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="font-medium">
              {formatPercentage(portfolio.profitPercentage)}
            </span>
          </div>
          
          <div className="ml-2 text-sm text-muted-foreground">
            {formatCurrency(portfolio.totalProfit)}
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          {portfolio.assets.slice(0, 3).map((asset) => (
            <div 
              key={asset.id} 
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-xs font-semibold"
            >
              {asset.coinSymbol.substring(0, 3)}
            </div>
          ))}
          
          {portfolio.assets.length > 3 && (
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
              +{portfolio.assets.length - 3}
            </div>
          )}
          
          {portfolio.assets.length === 0 && (
            <div className="text-sm text-muted-foreground">No assets yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
