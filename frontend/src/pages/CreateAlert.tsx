
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockPortfolios } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { alertApi, portfolioApi } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Alert } from '../types';

const currentPrices = {
    BTC: 60000,
    ETH: 3000,
    ADA: 0.45,
    // ...
};
const CreateAlert = () => {
  const { toast } = useToast();
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
        const fetchPortfolios = async () => {
            try {
                const response = await portfolioApi.getAll();
                const portfolios = response.data;
                setPortfolios(portfolios);
                if (portfolios.length > 0) {
                    setPortfolioId(portfolios[0].id);
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load portfolios. Please try again.",
                });
            }
        };

        fetchPortfolios();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!portfolioId || !coinSymbol || !coinName || !targetPrice) {
            setError('Please fill in all required fields');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all required fields",
            });
            return;
        }

        setError('');
        setIsCreating(true);

        try {
            await alertApi.create({
                id: '', 
                portfolioId,
                coinSymbol,
                coinName,
                targetPrice: parseFloat(targetPrice),
                currentPrice: currentPrices[coinSymbol],
                currency: "USD",
                type: alertType,
                triggered: false,
                createdAt: new Date().toISOString(), 
            } as Alert);
            toast({
                title: "Success",
                description: "Alert added successfully!",
            });
            if (defaultPortfolioId) {
                navigate(`/portfolios/${defaultPortfolioId}`);
            } else {
                navigate('/alerts');
            }
        } catch (err) {
            setError('Failed to create alert. Please try again.');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create alert. Please try again.",
            });
        } finally {
            setIsCreating(false);
        }
    };

  return (
    <div>
      <div className="mb-6">
        <Link
          to={defaultPortfolioId ? `/portfolios/${defaultPortfolioId}` : '/alerts'}
          className="text-muted-foreground mb-2 inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </Link>
        <h1 className="text-3xl font-bold">Create Price Alert</h1>
        <p className="text-muted-foreground">Get notified when a cryptocurrency reaches your target price</p>
      </div>

      <div className="crypto-card mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="portfolio" className="mb-1 block text-sm font-medium">
              Portfolio *
            </label>
            <select
              id="portfolio"
              className="border-input bg-background w-full rounded-md border px-3 py-2"
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
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="coin-symbol" className="mb-1 block text-sm font-medium">
                Coin Symbol *
              </label>
              <input
                type="text"
                id="coin-symbol"
                placeholder="BTC"
                className="border-input bg-background w-full rounded-md border px-3 py-2"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                E.g., BTC, ETH, SOL
              </p>
            </div>
            
            <div>
              <label htmlFor="coin-name" className="mb-1 block text-sm font-medium">
                Coin Name *
              </label>
              <input
                type="text"
                id="coin-name"
                placeholder="Bitcoin"
                className="border-input bg-background w-full rounded-md border px-3 py-2"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                E.g., Bitcoin, Ethereum, Solana
              </p>
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium">
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
            <label htmlFor="target-price" className="mb-1 block text-sm font-medium">
              Target Price (USD) *
            </label>
            <input
              type="number"
              id="target-price"
              step="any"
              min="0"
              placeholder="0.00"
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to={defaultPortfolioId ? `/portfolios/${defaultPortfolioId}` : '/alerts'}
              className="border-input bg-background inline-block rounded-md border px-4 py-2 hover:bg-accent"
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
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
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
