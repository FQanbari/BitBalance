
import React, { useEffect, useState } from 'react';
import { PieChart } from 'lucide-react';
import { mockPortfolios, mockAssets, generateAllocationData } from '@/lib/mock-data';
import { Portfolio, Allocation } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import AllocationChart from '@/components/charts/allocation-chart';
import { analysisApi, portfolioApi } from '../lib/api';
import { useToast } from '../hooks/use-toast';

const Analysis = () => {
    const { toast } = useToast();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolio, setSelectedPortfolio] = useState<string>('');
    const [allocationData, setAllocationData] = useState<Allocation[]>([]);
    const [totalValue, setTotalValue] = useState<number>(0);

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const response = await portfolioApi.getAll();
                const portfolios = response.data;
                setPortfolios(portfolios);
                if (portfolios.length > 0) {
                    setSelectedPortfolio(portfolios[0].id);
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

    useEffect(() => {
        const fetchAllocation = async () => {
            if (!selectedPortfolio) {
                setAllocationData([]);
                setTotalValue(0);
                return;
            }

            try {
                const response = await analysisApi.getPortfolioAllocation(selectedPortfolio);
                const allocationRaw = response.data; // نوع: AssetAllocationDto[]

                const mappedAllocation: Allocation[] = allocationRaw.map((item: Allocation) => ({
                    coinSymbol: item.coinSymbol,
                    coinName: item.coinSymbol,
                    value: item.currentValue,
                    percentage: item.percentage,
                    color: getColorForSymbol(item.coinSymbol),
                }));

                setAllocationData(mappedAllocation);

                const total = mappedAllocation.reduce((sum, item) => sum + item.value, 0);
                setTotalValue(total);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load allocation data. Please try again.",
                });
            }
        };

        fetchAllocation();
    }, [selectedPortfolio]);

    const getColorForSymbol = (symbol: string): string => {
        const colors: Record<string, string> = {
            BTC: "#f7931a",
            ETH: "#3c3c3d",
            USDT: "#26a17b",
            BNB: "#f3ba2f",
            // add more known colors
        };

        return colors[symbol] || "#" + Math.floor(Math.random() * 16777215).toString(16);
    };


    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Portfolio Analysis</h1>
                <p className="text-muted-foreground">Visualize your portfolio allocation and performance</p>
            </div>

            {portfolios.length === 0 ? (
                <div className="bg-accent/50 rounded-lg py-16 text-center">
                    <div className="mb-4">
                        <PieChart size={32} className="text-muted-foreground mx-auto" />
                    </div>
                    <p className="text-muted-foreground">You need to create a portfolio to see analysis</p>
                </div>
            ) : (
                <>
                    {/* Portfolio selector */}
                    <div className="mb-6">
                        <label htmlFor="portfolio-select" className="mb-2 block text-sm font-medium">
                            Select Portfolio
                        </label>
                        <select
                            id="portfolio-select"
                            className="border-input bg-background w-full rounded-md border px-3 py-2 md:w-64"
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

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Chart */}
                        <div className="crypto-card lg:col-span-2">
                            <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
                                <h2 className="text-xl font-semibold">Asset Allocation</h2>
                                <div className="text-muted-foreground mt-2 md:mt-0">
                                    Total Value: <span className="font-semibold">{formatCurrency(totalValue)}</span>
                                </div>
                            </div>

                            {allocationData.length === 0 ? (
                                <div className="py-16 text-center">
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
                            <h2 className="mb-4 text-xl font-semibold">Distribution</h2>

                            {allocationData.length === 0 ? (
                                <div className="py-8 text-center">
                                    <p className="text-muted-foreground">No assets to display</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 space-y-3">
                                        {allocationData.map((item) => (
                                            <div key={item.coinSymbol} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div
                                                        className="mr-2 h-3 w-3 rounded-full"
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
                                            <span className="text-muted-foreground text-sm">Total Assets</span>
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
