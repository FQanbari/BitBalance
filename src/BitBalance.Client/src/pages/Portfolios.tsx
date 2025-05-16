
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash } from 'lucide-react';
import { mockPortfolios, mockAssets } from '@/lib/mock-data';
import { Portfolio } from '@/types';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, this would be an API call
    const loadedPortfolios = [...mockPortfolios];
    loadedPortfolios.forEach(portfolio => {
      portfolio.assets = mockAssets[portfolio.id] || [];
    });
    
    setPortfolios(loadedPortfolios);
  }, []);

  const filteredPortfolios = portfolios.filter(portfolio => 
    portfolio.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePortfolio = (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      // In a real app, this would be an API call
      setPortfolios(prevPortfolios => 
        prevPortfolios.filter(portfolio => portfolio.id !== id)
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolios</h1>
          <p className="text-muted-foreground">Manage and track your crypto investments</p>
        </div>

        <Link
          to="/portfolios/new"
          className="inline-flex items-center gap-1 rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          <span>New Portfolio</span>
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search portfolios..."
          className="w-full rounded-md border border-input pl-10 pr-4 py-2 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Portfolio list */}
      {filteredPortfolios.length === 0 ? (
        <div className="text-center py-16 bg-accent/50 rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No portfolios match your search' : 'You don\'t have any portfolios yet'}
          </p>
          {!searchQuery && (
            <Link
              to="/portfolios/new"
              className="inline-flex items-center gap-1 rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>Create your first portfolio</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPortfolios.map((portfolio) => (
            <div key={portfolio.id} className="crypto-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/portfolios/${portfolio.id}`}
                      className="text-xl font-semibold hover:text-primary transition-colors"
                    >
                      {portfolio.name}
                    </Link>
                    
                    <div>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-1">
                    Created {formatDate(portfolio.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold mt-1">
                    {formatCurrency(portfolio.totalValue)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Profit/Loss</div>
                  <div className={cn(
                    "text-xl font-semibold mt-1",
                    portfolio.profitPercentage >= 0 ? "text-crypto-green" : "text-crypto-red"
                  )}>
                    {formatCurrency(portfolio.totalProfit)} 
                    <span className="ml-1">
                      ({formatPercentage(portfolio.profitPercentage)})
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Assets</div>
                  <div className="mt-1 flex items-center gap-2">
                    {portfolio.assets.length > 0 ? (
                      <>
                        <span className="text-xl font-semibold">
                          {portfolio.assets.length}
                        </span>
                        <div className="flex -space-x-2">
                          {portfolio.assets.slice(0, 3).map((asset) => (
                            <div 
                              key={asset.id}
                              className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-xs font-semibold border-2 border-background"
                            >
                              {asset.coinSymbol.substring(0, 2)}
                            </div>
                          ))}
                          {portfolio.assets.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold border-2 border-background">
                              +{portfolio.assets.length - 3}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No assets</span>
                    )}
                  </div>
                </div>
                
                <div className="ml-auto self-end">
                  <Link
                    to={`/portfolios/${portfolio.id}`}
                    className="inline-block rounded-md px-4 py-1.5 bg-secondary text-foreground hover:bg-secondary/80"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolios;
