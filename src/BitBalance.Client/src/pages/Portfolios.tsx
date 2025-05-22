
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash } from 'lucide-react';
import { mockPortfolios, mockAssets } from '@/lib/mock-data';
import { Portfolio, Asset } from '@/types';
import { portfolioApi } from '@/lib/api';
import { formatCurrency, formatDate, formatPercentage } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
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
const Portfolios = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const enrichPortfolios = async (rawPortfolios: Portfolio[]) => {
        const enriched: Portfolio[] = [];

        for (const portfolio of rawPortfolios) {
            let totalValue = 0;
            let totalCost = 0;
            const assets: Asset[] = [];

            for (const asset of portfolio.assets) {
                const currentPrice = currentPrices[asset.coinSymbol]; //await getPrice(asset.coinSymbol); // یا از currentPrices[asset.coinSymbol]
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
        const loadPortfolios = async () => {
            const response = await portfolioApi.getAll();
            const loadedPortfolios = response.data;
            const portfoliosWithCalculatedData = await enrichPortfolios(loadedPortfolios);
            setPortfolios(portfoliosWithCalculatedData);
        };

        loadPortfolios();
    }, []);

    const filteredPortfolios = portfolios.filter(portfolio =>
        portfolio.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeletePortfolio = async (id: string) => {

        if (window.confirm('Are you sure you want to delete this portfolio?')) {
            try {
                const response = await portfolioApi.delete(id);
                toast({
                    title: "Success",
                    description: "Portfolio remove successfully!",
                });
                setPortfolios((prevPortfolios) =>
                    prevPortfolios.filter((portfolio) => portfolio.id !== id)
                );
            } catch (err) {
                setError('Failed to delete portfolio. Please try again.');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete portfolio. Please try again.",
                });
            }
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Portfolios</h1>
                    <p className="text-muted-foreground">Manage and track your crypto investments</p>
                </div>

                <Link
                    to="/portfolios/new"
                    className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-primary/90"
                >
                    <Plus size={16} />
                    <span>New Portfolio</span>
                </Link>
            </div>

            {/* Search bar */}
            <div className="relative mb-6">
                <Search className="-translate-y-1/2 text-muted-foreground absolute left-3 top-1/2 transform" size={18} />
                <input
                    type="text"
                    placeholder="Search portfolios..."
                    className="border-input bg-background w-full rounded-md border py-2 pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Portfolio list */}
            {filteredPortfolios.length === 0 ? (
                <div className="bg-accent/50 rounded-lg py-16 text-center">
                    <p className="text-muted-foreground mb-4">
                        {searchQuery ? 'No portfolios match your search' : 'You don\'t have any portfolios yet'}
                    </p>
                    {!searchQuery && (
                        <Link
                            to="/portfolios/new"
                            className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-primary/90"
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
                                            className="text-xl font-semibold transition-colors hover:text-primary"
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

                                    <div className="text-muted-foreground mt-1 text-sm">
                                        Created {formatDate(portfolio.createdAt)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
                                <div>
                                    <div className="text-muted-foreground text-sm">Total Value</div>
                                    <div className="mt-1 text-2xl font-bold">
                                        {formatCurrency(portfolio.totalValue)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground text-sm">Profit/Loss</div>
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
                                    <div className="text-muted-foreground text-sm">Assets</div>
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
                                                            className="bg-accent border-background flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold"
                                                        >
                                                            {asset.coinSymbol.substring(0, 2)}
                                                        </div>
                                                    ))}
                                                    {portfolio.assets.length > 3 && (
                                                        <div className="bg-muted border-background flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold">
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
                                        className="bg-secondary text-foreground inline-block rounded-md px-4 py-1.5 hover:bg-secondary/80"
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
