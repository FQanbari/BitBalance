
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockPortfolios } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const CreateAlert = () => {
  const [searchParams] = useSearchParams();
  const defaultPortfolioId = searchParams.get('portfolioId') || '';
  
  const navigate = useNavigate();
  const [portfolioId, setPortfolioId] = useState(defaultPortfolioId);
  const [portfolios, setPortfolios] = useState(mockPortfolios);
  const [coinSymbol, setCoinSymbol] = useState('');
  const [coinName, setCoinName] = useState('');
  const [alertType, setAlertType] = useState<'Above' | 'Below'>('Above');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call to load all portfolios
    setPortfolios(mockPortfolios);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!portfolioId || !coinSymbol || !coinName || !targetPrice) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setIsCreating(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsCreating(false);
      
      if (defaultPortfolioId) {
        navigate(`/portfolios/${defaultPortfolioId}`);
      } else {
        navigate('/alerts');
      }
    }, 1000);
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to={defaultPortfolioId ? `/portfolios/${defaultPortfolioId}` : '/alerts'}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold">Create Price Alert</h1>
        <p className="text-muted-foreground">Get notified when a cryptocurrency reaches your target price</p>
      </div>

      <div className="crypto-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium mb-1">
              Portfolio *
            </label>
            <select
              id="portfolio"
              className="w-full rounded-md border border-input px-3 py-2 bg-background"
              value={portfolioId}
              onChange={(e) => setPortfolioId(e.target.value)}
              disabled={!!defaultPortfolioId}
            >
              <option value="">Select a portfolio</option>
              {portfolios.map(portfolio => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="coin-symbol" className="block text-sm font-medium mb-1">
                Coin Symbol *
              </label>
              <input
                type="text"
                id="coin-symbol"
                placeholder="BTC"
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-muted-foreground mt-1">
                E.g., BTC, ETH, SOL
              </p>
            </div>
            
            <div>
              <label htmlFor="coin-name" className="block text-sm font-medium mb-1">
                Coin Name *
              </label>
              <input
                type="text"
                id="coin-name"
                placeholder="Bitcoin"
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                E.g., Bitcoin, Ethereum, Solana
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Alert Type *
            </label>
            <div className="flex">
              <button
                type="button"
                className={cn(
                  "flex-1 px-4 py-2 text-center border rounded-l-md",
                  alertType === 'Above'
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-accent border-input"
                )}
                onClick={() => setAlertType('Above')}
              >
                Price Above
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 px-4 py-2 text-center border rounded-r-md",
                  alertType === 'Below'
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-accent border-input"
                )}
                onClick={() => setAlertType('Below')}
              >
                Price Below
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="target-price" className="block text-sm font-medium mb-1">
              Target Price (USD) *
            </label>
            <input
              type="number"
              id="target-price"
              step="any"
              min="0"
              placeholder="0.00"
              className="w-full rounded-md border border-input px-3 py-2 bg-background"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to={defaultPortfolioId ? `/portfolios/${defaultPortfolioId}` : '/alerts'}
              className="inline-block rounded-md px-4 py-2 border border-input bg-background hover:bg-accent"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isCreating}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground",
                isCreating ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
              )}
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                  Creating...
                </>
              ) : (
                'Create Alert'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlert;
