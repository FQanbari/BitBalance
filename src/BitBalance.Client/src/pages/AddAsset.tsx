
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockPortfolios } from '@/lib/mock-data';
import { cn, formatDate } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { portfolioApi } from '../lib/api';

const currentPrices = {
    BTC: 60000,
    ETH: 3000,
    ADA: 0.45,
    // ...
};

const AddAsset = () => {
  const { id: portfolioId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
  
  const [portfolioName, setPortfolioName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [coinName, setCoinName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const verifyPortfolio = async () => {
            if (!portfolioId) {
                setError('Portfolio not found');
                return;
            }

            try {
                const response = await portfolioApi.get(portfolioId);
                setPortfolioName(response.data.name);
            } catch (error) {
                console.error('Failed to load portfolio', error);
                setError('Portfolio not found');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load portfolio. Please try again.",
                });
            }
        };

        verifyPortfolio();
        
        setPurchaseDate(new Date().toISOString().split('T')[0]);
    }, [portfolioId, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!coinSymbol || !coinName || !quantity || !purchasePrice || !purchaseDate) {
            setError('Please fill in all fields');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please fill in all fields",
            });
            return;
        }

        const quantityNum = parseFloat(quantity);
        const purchasePriceNum = parseFloat(purchasePrice);

        if (quantityNum <= 0 || isNaN(quantityNum)) {
            setError('Quantity must be greater than 0');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Quantity must be greater than 0",
            });
            return;
        }

        if (purchasePriceNum <= 0 || isNaN(purchasePriceNum)) {
            setError('Purchase price must be greater than 0');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Purchase price must be greater than 0",
            });
            return;
        }

        if (coinSymbol.length > 10) {
            setError('Coin symbol must be 10 characters or less');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Coin symbol must be 10 characters or less",
            });
            return;
        }

        const purchaseDateObj = new Date(purchaseDate);
        if (purchaseDateObj > new Date()) {
            setError('Purchase date cannot be in the future');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Purchase date cannot be in the future",
            });
            return;
        }

        setError('');
        setIsAdding(true);

        try {
            await portfolioApi.addAsset(portfolioId!, {
                id: null,
                portfolioId: portfolioId,
                coinSymbol: coinSymbol,
                coinName, 
                quantity: quantityNum,
                purchasePrice: purchasePriceNum,
                currency: "USD",
                currentPrice: currentPrices[coinSymbol],
                value: 0,
                profit: 0,
                profitPercentage:0,
                allocation: 0,
                purchaseDate: purchaseDateObj.toISOString(),
            });

            toast({
                title: "Success",
                description: "Asset added successfully!",
            });
            setIsAdding(false);
            navigate(`/portfolios/${portfolioId}`);
        } catch (error) {
            setIsAdding(false);
            let errorMessage = "Failed to add asset. Please try again.";

            if (error.message.includes("CORS")) {
                errorMessage = "CORS error: Unable to connect to the server.";
            } else if (error.response?.status === 404) {
                errorMessage = "Portfolio not found.";
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.message || "Invalid asset data.";
            }

            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
            });
        }
    };

  if (error === 'Portfolio not found') {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground mb-4">Portfolio not found</p>
        <Link
          to="/portfolios"
          className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-primary/90"
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
          className="text-muted-foreground mb-2 inline-flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>
        <h1 className="text-3xl font-bold">Add Asset</h1>
        <p className="text-muted-foreground">
          Add a new cryptocurrency to <span className="font-medium">{portfolioName}</span>
        </p>
      </div>

      <div className="crypto-card mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && error !== 'Portfolio not found' && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border p-3 text-sm">
              {error}
            </div>
          )}
          
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
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="quantity" className="mb-1 block text-sm font-medium">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                step="any"
                min="0"
                placeholder="0.00"
                className="border-input bg-background w-full rounded-md border px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="purchase-price" className="mb-1 block text-sm font-medium">
                Purchase Price (USD) *
              </label>
              <input
                type="number"
                id="purchase-price"
                step="any"
                min="0"
                placeholder="0.00"
                className="border-input bg-background w-full rounded-md border px-3 py-2"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="purchase-date" className="mb-1 block text-sm font-medium">
              Purchase Date *
            </label>
            <input
              type="date"
              id="purchase-date"
              className="border-input bg-background w-full rounded-md border px-3 py-2"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              to={`/portfolios/${portfolioId}`}
              className="border-input bg-background inline-block rounded-md border px-4 py-2 hover:bg-accent"
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
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
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
