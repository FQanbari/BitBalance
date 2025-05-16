
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, BarChart, Bell, Plus } from 'lucide-react';
import { mockPortfolios, mockAssets, mockAlerts } from '@/lib/mock-data';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Portfolio, Asset, Alert } from '@/types';
import PortfolioSummaryCard from '@/components/dashboard/portfolio-summary-card';
import StatsCard from '@/components/dashboard/stats-card';
import AssetList from '@/components/portfolio/asset-list';

const Index = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalProfitPercentage, setTotalProfitPercentage] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // In a real app, this would be API calls
    // Load portfolios with assets
    const loadedPortfolios = [...mockPortfolios];
    
    // Calculate totals
    let valueSum = 0;
    let profitSum = 0;
    let initialInvestment = 0;
    
    loadedPortfolios.forEach(portfolio => {
      portfolio.assets = mockAssets[portfolio.id] || [];
      valueSum += portfolio.totalValue;
      profitSum += portfolio.totalProfit;
      initialInvestment += portfolio.totalValue - portfolio.totalProfit;
    });
    
    // Calculate aggregate portfolio profit percentage
    const percentage = initialInvestment > 0 
      ? (profitSum / initialInvestment) * 100 
      : 0;
    
    setPortfolios(loadedPortfolios);
    setTotalValue(valueSum);
    setTotalProfit(profitSum);
    setTotalProfitPercentage(percentage);
    
    // Load alerts
    setAlerts(mockAlerts);
    
    // Get top performing assets across all portfolios
    const allAssets = loadedPortfolios.flatMap(p => p.assets);
    allAssets.sort((a, b) => b.value - a.value);
    setFeaturedAssets(allAssets.slice(0, 5));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your crypto portfolio tracker</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          title="Total Portfolio Value"
          value={formatCurrency(totalValue)}
          icon={<Wallet className="text-primary" size={20} />}
          trend={{
            value: formatPercentage(totalProfitPercentage),
            positive: totalProfitPercentage >= 0,
          }}
          description="All-time"
        />
        <StatsCard
          title="Profit / Loss"
          value={formatCurrency(totalProfit)}
          icon={<BarChart className="text-primary" size={20} />}
          trend={{
            value: formatPercentage(totalProfitPercentage),
            positive: totalProfitPercentage >= 0,
          }}
        />
        <StatsCard
          title="Active Alerts"
          value={alerts.length.toString()}
          icon={<Bell className="text-primary" size={20} />}
          description="Price notifications"
        />
      </div>

      {/* Portfolios section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Portfolios</h2>
          <Link
            to="/portfolios/new"
            className="inline-flex items-center gap-1 text-sm rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} />
            <span>New Portfolio</span>
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-10 bg-accent/50 rounded-lg">
            <p className="text-muted-foreground mb-2">You don't have any portfolios yet</p>
            <Link
              to="/portfolios/new"
              className="inline-flex items-center gap-1 text-sm rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>Create your first portfolio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map(portfolio => (
              <PortfolioSummaryCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}
      </div>

      {/* Top assets section */}
      {featuredAssets.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Assets</h2>
            <Link
              to="/portfolios"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="crypto-card">
            <AssetList assets={featuredAssets} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
