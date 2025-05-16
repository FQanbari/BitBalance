
import React, { useEffect, useState } from 'react';
import { PieChart } from 'lucide-react';
import { mockPortfolios, mockAssets, generateAllocationData } from '@/lib/mock-data';
import { Portfolio, Allocation } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import AllocationChart from '@/components/charts/allocation-chart';

const Analysis = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
  const [allocationData, setAllocationData] = useState<Allocation[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  
  useEffect(() => {
    // In a real app, these would be API calls
    const loadedPortfolios = [...mockPortfolios];
    loadedPortfolios.forEach(portfolio => {
      portfolio.assets = mockAssets[portfolio.id] || [];
    });
    
    setPortfolios(loadedPortfolios);
    
    // If there are portfolios, select the first one by default
    if (loadedPortfolios.length > 0) {
      setSelectedPortfolio(loadedPortfolios[0].id);
    }
  }, []);
  
  useEffect(() => {
    if (selectedPortfolio) {
      const portfolio = portfolios.find(p => p.id === selectedPortfolio);
      if (portfolio) {
        const allocation = generateAllocationData(portfolio.assets);
        setAllocationData(allocation);
        setTotalValue(portfolio.totalValue);
      }
    } else {
      setAllocationData([]);
      setTotalValue(0);
    }
  }, [selectedPortfolio, portfolios]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Portfolio Analysis</h1>
        <p className="text-muted-foreground">Visualize your portfolio allocation and performance</p>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-16 bg-accent/50 rounded-lg">
          <div className="mb-4">
            <PieChart size={32} className="mx-auto text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">You need to create a portfolio to see analysis</p>
        </div>
      ) : (
        <>
          {/* Portfolio selector */}
          <div className="mb-6">
            <label htmlFor="portfolio-select" className="block text-sm font-medium mb-2">
              Select Portfolio
            </label>
            <select
              id="portfolio-select"
              className="w-full md:w-64 rounded-md border border-input px-3 py-2 bg-background"
              value={selectedPortfolio}
              onChange={(e) => setSelectedPortfolio(e.target.value)}
            >
              {portfolios.map(portfolio => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 crypto-card">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Asset Allocation</h2>
                <div className="mt-2 md:mt-0 text-muted-foreground">
                  Total Value: <span className="font-semibold">{formatCurrency(totalValue)}</span>
                </div>
              </div>
              
              {allocationData.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    No assets in this portfolio to analyze
                  </p>
                </div>
              ) : (
                <AllocationChart data={allocationData} />
              )}
            </div>
            
            {/* Legend */}
            <div className="crypto-card h-min">
              <h2 className="text-xl font-semibold mb-4">Distribution</h2>
              
              {allocationData.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No assets to display</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {allocationData.map((item) => (
                      <div key={item.coinSymbol} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.coinSymbol}</span>
                        </div>
                        <span>{item.percentage.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Assets</span>
                      <span className="font-medium">{allocationData.length}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analysis;
