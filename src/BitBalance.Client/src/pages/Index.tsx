
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, BarChart, Bell, Plus } from 'lucide-react';
import { mockPortfolios, mockAssets, mockAlerts } from '@/lib/mock-data';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { Portfolio, Asset, Alert } from '@/types';
import PortfolioSummaryCard from '@/components/dashboard/portfolio-summary-card';
import StatsCard from '@/components/dashboard/stats-card';
import AssetList from '@/components/portfolio/asset-list';
import { alertApi, portfolioApi } from '../lib/api';
import { usePrices } from '../hooks/use-prices';

const Index = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [totalValue, setTotalValue] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalProfitPercentage, setTotalProfitPercentage] = useState(0);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [featuredAssets, setFeaturedAssets] = useState<Asset[]>([]);
    const [currentPrices, setCurrentPrices] = useState<Record<string, number>>(usePrices());

    const enrichPortfolios = async (
        rawPortfolios: Portfolio[],
        prices: Record<string, number>
    ) => {
        if (!prices) return rawPortfolios;

        const enriched: Portfolio[] = [];

        for (const portfolio of rawPortfolios) {
            let totalValue = 0;
            let totalCost = 0;
            const assets: Asset[] = [];

            for (const asset of portfolio.assets) {
                const currentPrice = prices[asset.coinSymbol] ?? 0;
                const value = asset.quantity * currentPrice;
                const cost = asset.quantity * asset.purchasePrice;
                const profit = value - cost;
                const profitPercentage = cost > 0 ? (profit / cost) * 100 : 0;

                totalValue += value;
                totalCost += cost;

                assets.push({
                    ...asset,
                    currentPrice,
                    value,
                    profit,
                    profitPercentage,
                    allocation: 0,
                    coinName: asset.coinSymbol,
                    portfolioId: portfolio.id,
                });
            }

            assets.forEach(asset => {
                asset.allocation = totalValue > 0 ? (asset.value / totalValue) * 100 : 0;
            });

            enriched.push({
                ...portfolio,
                assets,
                totalValue,
                totalProfit: totalValue - totalCost,
                profitPercentage: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0,
                createdAt: new Date(portfolio.createdAt).toISOString(),
                updatedAt: new Date(portfolio.createdAt).toISOString(),
            });
        }

        return enriched;
    };

    useEffect(() => {
        const enrichAndUpdate = async () => {
            const portfoliosRes = await portfolioApi.getAll();
            const portfolios = portfoliosRes.data;

            const alertsRes = await alertApi.getAllActive();
            setAlerts(alertsRes.data);
            if (!currentPrices || portfolios.length === 0) return;
            
            const enriched = await enrichPortfolios(portfolios, currentPrices);

            let valueSum = 0;
            let profitSum = 0;
            let initialInvestment = 0;

            enriched.forEach((portfolio) => {
                valueSum += portfolio.totalValue;
                profitSum += portfolio.totalProfit;
                initialInvestment += portfolio.totalValue - portfolio.totalProfit;
            });

            const percentage = initialInvestment > 0 ? (profitSum / initialInvestment) * 100 : 0;

            setPortfolios(enriched);
            setTotalValue(valueSum);
            setTotalProfit(profitSum);
            setTotalProfitPercentage(percentage);

            const allAssets = enriched.flatMap((p) => p.assets);
            allAssets.sort((a, b) => b.value - a.value);
            setFeaturedAssets(allAssets.slice(0, 5));
        };

        enrichAndUpdate();
    }, []);

 
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your crypto portfolio tracker</p>
      </div>

      {/* Stats overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Portfolios</h2>
          <Link
            to="/portfolios/new"
            className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-primary/90"
          >
            <Plus size={16} />
            <span>New Portfolio</span>
          </Link>
        </div>

        {portfolios.length === 0 ? (
          <div className="bg-accent/50 rounded-lg py-10 text-center">
            <p className="text-muted-foreground mb-2">You don't have any portfolios yet</p>
            <Link
              to="/portfolios/new"
              className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-primary/90"
            >
              <Plus size={16} />
              <span>Create your first portfolio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map(portfolio => (
              <PortfolioSummaryCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}
      </div>

      {/* Top assets section */}
      {featuredAssets.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Top Assets</h2>
            <Link
              to="/portfolios"
              className="text-primary text-sm hover:underline"
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
