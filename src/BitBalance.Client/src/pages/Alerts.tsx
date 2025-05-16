
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, Trash } from 'lucide-react';
import { mockAlerts, mockPortfolios } from '@/lib/mock-data';
import { Alert } from '@/types';
import { formatCurrency } from '@/lib/utils';

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [portfolioMap, setPortfolioMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // In a real app, these would be API calls
    setAlerts(mockAlerts);

    // Create portfolio id to name mapping
    const mapping: Record<string, string> = {};
    mockPortfolios.forEach(portfolio => {
      mapping[portfolio.id] = portfolio.name;
    });
    setPortfolioMap(mapping);
  }, []);

  const handleDeleteAlert = (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      // In a real app, this would be an API call
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Price Alerts</h1>
          <p className="text-muted-foreground">Get notified when prices hit your targets</p>
        </div>

        <Link
          to="/alerts/new"
          className="inline-flex items-center gap-1 rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          <span>New Alert</span>
        </Link>
      </div>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="text-center py-16 bg-accent/50 rounded-lg">
          <div className="flex justify-center mb-4">
            <Bell size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">You don't have any price alerts yet</p>
          <Link
            to="/alerts/new"
            className="inline-flex items-center gap-1 rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={16} />
            <span>Create your first alert</span>
          </Link>
        </div>
      ) : (
        <div className="crypto-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-3 pl-2">Asset</th>
                <th className="pb-3">Portfolio</th>
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
                    <Link 
                      to={`/portfolios/${alert.portfolioId}`}
                      className="hover:text-primary"
                    >
                      {portfolioMap[alert.portfolioId] || 'Unknown'}
                    </Link>
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
  );
};

export default Alerts;
