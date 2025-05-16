
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash, Bell, PieChart } from 'lucide-react';
import { mockPortfolios, mockAssets, mockAlerts, generateAllocationData } from '@/lib/mock-data';
import { Portfolio, Asset, Alert, Allocation } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import AssetList from '@/components/portfolio/asset-list';
import AllocationChart from '@/components/charts/allocation-chart';

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [allocationData, setAllocationData] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assets' | 'alerts' | 'analysis'>('assets');

  useEffect(() => {
    // In a real app, these would be API calls
    const loadPortfolio = async () => {
      setLoading(true);
      
      try {
        // Find portfolio
        const foundPortfolio = mockPortfolios.find(p => p.id === id);
        
        if (!foundPortfolio) {
          navigate('/portfolios');
          return;
        }
        
        // Load assets
        const portfolioAssets = mockAssets[foundPortfolio.id] || [];
        foundPortfolio.assets = portfolioAssets;
        
        // Load alerts
        const portfolioAlerts = mockAlerts.filter(alert => alert.portfolioId === foundPortfolio.id);
        
        // Generate allocation data
        const allocation = generateAllocationData(portfolioAssets);
        
        setPortfolio(foundPortfolio);
        setAssets(portfolioAssets);
        setAlerts(portfolioAlerts);
        setAllocationData(allocation);
      } catch (error) {
        console.error('Failed to load portfolio', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPortfolio();
  }, [id, navigate]);

  const handleRemoveAsset = (assetId: string) => {
    if (window.confirm('Are you sure you want to remove this asset?')) {
      // In a real app, this would be an API call
      const updatedAssets = assets.filter(asset => asset.id !== assetId);
      setAssets(updatedAssets);
      
      // Update portfolio
      if (portfolio) {
        const updatedPortfolio = { ...portfolio, assets: updatedAssets };
        setPortfolio(updatedPortfolio);
        
        // Recalculate allocation
        const updatedAllocation = generateAllocationData(updatedAssets);
        setAllocationData(updatedAllocation);
      }
    }
  };

  const handleDeleteAlert = (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      // In a real app, this would be an API call
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
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
          to="/portfolios"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolios</span>
        </Link>
        <h1 className="text-3xl font-bold">{portfolio.name}</h1>
      </div>

      {/* Portfolio summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="crypto-card">
          <h3 className="text-sm text-muted-foreground">Total Value</h3>
          <div className="text-2xl font-bold mt-1">{formatCurrency(portfolio.totalValue)}</div>
        </div>
        
        <div className="crypto-card">
          <h3 className="text-sm text-muted-foreground">Profit/Loss</h3>
          <div className={cn(
            "text-2xl font-bold mt-1",
            portfolio.profitPercentage >= 0 ? "text-crypto-green" : "text-crypto-red"
          )}>
            {formatCurrency(portfolio.totalProfit)}
          </div>
          <div className={cn(
            "text-sm",
            portfolio.profitPercentage >= 0 ? "text-crypto-green" : "text-crypto-red"
          )}>
            {formatPercentage(portfolio.profitPercentage)}
          </div>
        </div>
        
        <div className="crypto-card flex items-center justify-between">
          <div>
            <h3 className="text-sm text-muted-foreground">Assets</h3>
            <div className="text-2xl font-bold mt-1">{assets.length}</div>
          </div>
          
          <Link
            to={`/portfolios/${portfolio.id}/add-asset`}
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} />
            <span>Add Asset</span>
          </Link>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b mb-6">
        <button
          className={cn(
            "px-4 py-2 border-b-2 text-sm font-medium",
            activeTab === 'assets'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
        <button
          className={cn(
            "px-4 py-2 border-b-2 text-sm font-medium",
            activeTab === 'alerts'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts ({alerts.length})
        </button>
        <button
          className={cn(
            "px-4 py-2 border-b-2 text-sm font-medium",
            activeTab === 'analysis'
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'assets' && (
        <div className="crypto-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Assets</h2>
            <Link
              to={`/portfolios/${portfolio.id}/add-asset`}
              className="inline-flex items-center gap-1 text-sm rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>Add Asset</span>
            </Link>
          </div>
          
          <AssetList assets={assets} onRemove={handleRemoveAsset} />
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="crypto-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Price Alerts</h2>
            <Link
              to={`/alerts/new?portfolioId=${portfolio.id}`}
              className="inline-flex items-center gap-1 text-sm rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>Create Alert</span>
            </Link>
          </div>
          
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">No price alerts set</p>
              <Link
                to={`/alerts/new?portfolioId=${portfolio.id}`}
                className="inline-flex items-center gap-1 text-sm rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Bell size={16} />
                <span>Set your first alert</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="pb-3 pl-2">Asset</th>
                    <th className="pb-3">Alert Type</th>
                    <th className="pb-3">Target Price</th>
                    <th className="pb-3">Current Price</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map(alert => (
                    <tr key={alert.id} className="border-b hover:bg-accent/50">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-accent w-8 h-8 flex items-center justify-center rounded-full">
                            <span className="font-semibold text-xs">{alert.coinSymbol}</span>
                          </div>
                          <div>
                            <div className="font-medium">{alert.coinSymbol}</div>
                            <div className="text-xs text-muted-foreground">{alert.coinName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        {alert.type === 'Above' ? (
                          <div className="inline-flex items-center text-crypto-green">
                            <span>Price above</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center text-crypto-red">
                            <span>Price below</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3">{formatCurrency(alert.targetPrice)}</td>
                      <td className="py-3">{formatCurrency(alert.currentPrice)}</td>
                      <td className="py-3">
                        {alert.triggered ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-crypto-green/10 text-crypto-green">
                            Triggered
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-1.5 hover:bg-destructive/10 text-destructive rounded"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 crypto-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Portfolio Allocation</h2>
              <div className="flex items-center gap-1 text-muted-foreground">
                <PieChart size={16} />
                <span className="text-sm">Asset Distribution</span>
              </div>
            </div>
            
            <AllocationChart data={allocationData} />
          </div>
          
          <div className="crypto-card h-min">
            <h2 className="text-xl font-semibold mb-4">Allocation Breakdown</h2>
            
            {allocationData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No assets to analyze</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allocationData.map((allocation) => (
                  <div key={allocation.coinSymbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: allocation.color }}
                      />
                      <span>{allocation.coinName}</span>
                    </div>
                    <span className="font-medium">{formatPercentage(allocation.percentage)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioDetail;
