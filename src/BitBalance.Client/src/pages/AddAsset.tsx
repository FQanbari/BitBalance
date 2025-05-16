
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockPortfolios } from '@/lib/mock-data';
import { cn, formatDate } from '@/lib/utils';

const AddAsset = () => {
  const { id: portfolioId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [portfolioName, setPortfolioName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [coinName, setCoinName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call to verify the portfolio exists
    const portfolio = mockPortfolios.find(p => p.id === portfolioId);
    if (portfolio) {
      setPortfolioName(portfolio.name);
    } else {
      setError('Portfolio not found');
    }
    
    // Set default purchase date to today
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  }, [portfolioId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coinSymbol || !coinName || !quantity || !purchasePrice || !purchaseDate) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setIsAdding(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      setIsAdding(false);
      navigate(`/portfolios/${portfolioId}`);
    }, 1000);
  };

  if (error === 'Portfolio not found') {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Portfolio not found</p>
        <Link
          to="/portfolios"
          className="inline-flex items-center gap-1 rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolios</span>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/portfolios/${portfolioId}`}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>
        <h1 className="text-3xl font-bold">Add Asset</h1>
        <p className="text-muted-foreground">
          Add a new cryptocurrency to <span className="font-medium">{portfolioName}</span>
        </p>
      </div>

      <div className="crypto-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && error !== 'Portfolio not found' && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                step="any"
                min="0"
                placeholder="0.00"
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="purchase-price" className="block text-sm font-medium mb-1">
                Purchase Price (USD) *
              </label>
              <input
                type="number"
                id="purchase-price"
                step="any"
                min="0"
                placeholder="0.00"
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="purchase-date" className="block text-sm font-medium mb-1">
              Purchase Date *
            </label>
            <input
              type="date"
              id="purchase-date"
              className="w-full rounded-md border border-input px-3 py-2 bg-background"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to={`/portfolios/${portfolioId}`}
              className="inline-block rounded-md px-4 py-2 border border-input bg-background hover:bg-accent"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isAdding}
              className={cn(
                "inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground",
                isAdding ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
              )}
            >
              {isAdding ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                  Adding...
                </>
              ) : (
                'Add Asset'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
