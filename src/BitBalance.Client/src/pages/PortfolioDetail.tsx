
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Trash, Bell, PieChart } from 'lucide-react';
import { mockPortfolios, mockAssets, mockAlerts, generateAllocationData } from '@/lib/mock-data';
import { Portfolio, Asset, Alert, Allocation } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import AssetList from '@/components/portfolio/asset-list';
import AllocationChart from '@/components/charts/allocation-chart';
import { portfolioApi } from '../lib/api';
import { useToast } from '../hooks/use-toast';

const currentPrices = {
    BTC: 60000,
    ETH: 3000,
    ADA: 0.45,
    SOL: 34.07,
    AVAX: 23.75,
    DOT: 10.3,
    ATOM: 11.4,
    MATIC: 1.59
    // ...
};

const PortfolioDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [allocationData, setAllocationData] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'assets' | 'alerts' | 'analysis'>('assets');

    useEffect(() => {
        // In a real app, these would be API calls
        const loadPortfolio = async () => {
            if (!id) {
                navigate('/portfolios');
                return;
            }
            setLoading(true);

            try {
                // Find portfolio
                const portfolioResponse = await portfolioApi.get(id);
                const portfolioData = portfolioResponse.data;
                const fetchedPortfolio: Portfolio = {
                    id: portfolioData.id,
                    name: portfolioData.name,
                    createdAt: portfolioData.createdAt ? new Date(portfolioData.createdAt).toISOString() : new Date().toISOString(),
                    updatedAt: portfolioData.updatedAt ? new Date(portfolioData.updatedAt).toISOString() : new Date().toISOString(),
                    totalValue: calculateTotalValue(portfolioData.assets),
                    totalProfit: calculateTotalProfit(portfolioData.assets),
                    profitPercentage: calculateProfitPercentage(portfolioData.assets),
                    assets: portfolioData.assets.map((asset: Asset) => {
                        const currentPrice = currentPrices[asset.coinSymbol] || 0; 
                        const value = asset.quantity * currentPrice;
                        const purchaseValue = asset.quantity * asset.purchasePrice;
                        const profit = value - purchaseValue;
                        const profitPercentage = purchaseValue > 0
                            ? ((value - purchaseValue) / purchaseValue) * 100
                            : 0;

                        return {
                            id: asset.id,
                            coinSymbol: asset.coinSymbol,
                            coinName: asset.coinName || asset.coinSymbol, 
                            quantity: asset.quantity,
                            purchasePrice: asset.purchasePrice,
                            currentPrice: currentPrice,
                            purchaseDate: asset.purchaseDate,
                            value: value,
                            allocation: 0,
                            curency: asset.currency,
                            profit: profit,
                            profitPercentage: profitPercentage,
                        };
                    }),
                };

                fetchedPortfolio.assets = fetchedPortfolio.assets.map(asset => ({
                    ...asset,
                    allocation: fetchedPortfolio.totalValue > 0
                        ? (asset.value / fetchedPortfolio.totalValue) * 100
                        : 0,
                }));

                // Load alerts
                //const alertsResponse = await portfolioApi.getAlerts(id); 
                //const portfolioAlerts = alertsResponse.data;

                // Generate allocation data
                const allocation = generateAllocationData(fetchedPortfolio.assets);

                setPortfolio(fetchedPortfolio);
                setAssets(fetchedPortfolio.assets);
                //setAlerts(portfolioAlerts);
                setAllocationData(allocation);

            } catch (error) {
                //console.error('Failed to load portfolio', error);
                let errorMessage = "Failed to load portfolio details.";
                if (error.message.includes("CORS")) {
                    errorMessage = "CORS error: Unable to connect to the server.";
                } else if (error.response?.status === 404) {
                    errorMessage = "Portfolio not found.";
                    navigate('/portfolios');
                }

                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        };

        loadPortfolio();
    }, [id, navigate, toast]);

    const calculateTotalValue = (assets: Asset[]) => {
        return assets.reduce((sum, asset) => sum + asset.quantity * currentPrices[asset.coinSymbol], 0);
    };

    const calculateTotalProfit = (assets: Asset[]) => {
        return assets.reduce(
            (sum, asset) => sum + (currentPrices[asset.coinSymbol] - asset.purchasePrice) * asset.quantity,
            0
        );
    };

    const calculateProfitPercentage = (assets: Asset[]) => {
        const totalValue = calculateTotalValue(assets);
        const totalInvested = assets.reduce(
            (sum, asset) => sum + asset.purchasePrice * asset.quantity,
            0
        );
        return totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
    };


    const generateAllocationData = (assets: Asset[]): Allocation[] => {
        const totalValue = calculateTotalValue(assets);
        return assets.map((asset, index) => ({
            coinSymbol: asset.coinSymbol,
            coinName: asset.coinName,
            percentage: totalValue > 0 ? (asset.quantity * currentPrices[asset.coinSymbol] / totalValue) * 100 : 0,
            color: `hsl(${index * 360 / assets.length}, 70%, 50%)`,
            value: asset.value
        }));
    };

    const handleRemoveAsset = async (assetId: string) => {
        if (window.confirm('Are you sure you want to remove this asset?')) {
            try {
                await portfolioApi.removeAsset(id!, assetId);
                // In a real app, this would be an API call
                const updatedAssets = assets.filter(asset => asset.id !== assetId);
                setAssets(updatedAssets);

                // Update portfolio
                if (portfolio) {
                    const updatedPortfolio = {
                        ...portfolio,
                        assets: updatedAssets,
                        totalValue: calculateTotalValue(updatedAssets),
                        totalProfit: calculateTotalProfit(updatedAssets),
                        profitPercentage: calculateProfitPercentage(updatedAssets),
                    };
                    setPortfolio(updatedPortfolio);

                    // Recalculate allocation
                    const updatedAllocation = generateAllocationData(updatedAssets);
                    setAllocationData(updatedAllocation);

                    toast({
                        title: "Success",
                        description: "Asset removed successfully!",
                    });
                }
            } catch (error) {
                console.error('Failed to remove asset', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to remove asset. Please try again.",
                });
            }
        }
    };

    const handleDeleteAlert = async (alertId: string) => {
        if (window.confirm('Are you sure you want to delete this alert?')) {
            try {
                //await portfolioApi.deleteAlert(id!, alertId);
                // In a real app, this would be an API call
                setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
                toast({
                    title: "Success",
                    description: "Alert deleted successfully!",
                });
            } catch (error) {
                console.error('Failed to delete alert', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete alert. Please try again.",
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <div className="border-primary mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
                    <p className="text-muted-foreground mt-4">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    if (!portfolio) {
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
                    to="/portfolios"
                    className="text-muted-foreground mb-2 inline-flex items-center gap-1 hover:text-foreground"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Portfolios</span>
                </Link>
                <h1 className="text-3xl font-bold">{portfolio.name}</h1>
            </div>

            {/* Portfolio summary */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="crypto-card">
                    <h3 className="text-muted-foreground text-sm">Total Value</h3>
                    <div className="mt-1 text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
                </div>

                <div className="crypto-card">
                    <h3 className="text-muted-foreground text-sm">Profit/Loss</h3>
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
                        <h3 className="text-muted-foreground text-sm">Assets</h3>
                        <div className="mt-1 text-2xl font-bold">{assets.length}</div>
                    </div>

                    <Link
                        to={`/portfolios/${portfolio.id}/add-asset`}
                        className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-primary/90"
                    >
                        <Plus size={16} />
                        <span>Add Asset</span>
                    </Link>
                </div>
            </div>

            {/* Tab navigation */}
            <div className="mb-6 flex border-b">
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
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Assets</h2>
                        <Link
                            to={`/portfolios/${portfolio.id}/add-asset`}
                            className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-primary/90"
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
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Price Alerts</h2>
                        <Link
                            to={`/alerts/new?portfolioId=${portfolio.id}`}
                            className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-primary/90"
                        >
                            <Plus size={16} />
                            <span>Create Alert</span>
                        </Link>
                    </div>

                    {alerts.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-muted-foreground mb-2">No price alerts set</p>
                            <Link
                                to={`/alerts/new?portfolioId=${portfolio.id}`}
                                className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm hover:bg-primary/90"
                            >
                                <Bell size={16} />
                                <span>Set your first alert</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr className="text-muted-foreground text-left text-sm">
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
                                                    <div className="bg-accent flex h-8 w-8 items-center justify-center rounded-full">
                                                        <span className="text-xs font-semibold">{alert.coinSymbol}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{alert.coinSymbol}</div>
                                                        <div className="text-muted-foreground text-xs">{alert.coinName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                {alert.type === 'Above' ? (
                                                    <div className="text-crypto-green inline-flex items-center">
                                                        <span>Price above</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-crypto-red inline-flex items-center">
                                                        <span>Price below</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3">{formatCurrency(alert.targetPrice)}</td>
                                            <td className="py-3">{formatCurrency(alert.currentPrice)}</td>
                                            <td className="py-3">
                                                {alert.triggered ? (
                                                    <span className="bg-crypto-green/10 text-crypto-green inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                                                        Triggered
                                                    </span>
                                                ) : (
                                                    <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="crypto-card lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Portfolio Allocation</h2>
                            <div className="text-muted-foreground flex items-center gap-1">
                                <PieChart size={16} />
                                <span className="text-sm">Asset Distribution</span>
                            </div>
                        </div>

                        <AllocationChart data={allocationData} />
                    </div>

                    <div className="crypto-card h-min">
                        <h2 className="mb-4 text-xl font-semibold">Allocation Breakdown</h2>

                        {allocationData.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-muted-foreground">No assets to analyze</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {allocationData.map((allocation) => (
                                    <div key={allocation.coinSymbol} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
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
