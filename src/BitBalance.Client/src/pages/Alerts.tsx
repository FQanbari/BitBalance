
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, Trash } from 'lucide-react';
import { mockAlerts, mockPortfolios } from '@/lib/mock-data';
import { Alert } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { alertApi } from '../lib/api';

const currentPrices = {
    BTC: 60000,
    ETH: 3000,
    ADA: 0.45,
    // ...
};
const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: alertsData } = await alertApi.getAllActive();
                const enrichedAlerts = alertsData.map((a: Alert) => ({
                    ...a,
                    coinName: a.coinSymbol,
                    portfolioId: '',
                    currentPrice: currentPrices[a.coinSymbol],
                    triggered: false
                })); 
                setAlerts(enrichedAlerts as Alert[]);

            } catch (error) {
                console.error('Error fetching alerts or portfolios:', error);
            }
        };

        fetchData();
    }, []);


  const handleDeleteAlert = (alertId: string) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      // In a real app, this would be an API call
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Price Alerts</h1>
          <p className="text-muted-foreground">Get notified when prices hit your targets</p>
        </div>

        <Link
          to="/alerts/new"
          className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-primary/90"
        >
          <Plus size={16} />
          <span>New Alert</span>
        </Link>
      </div>

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="bg-accent/50 rounded-lg py-16 text-center">
          <div className="mb-4 flex justify-center">
            <Bell size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">You don't have any price alerts yet</p>
          <Link
            to="/alerts/new"
            className="bg-primary text-primary-foreground inline-flex items-center gap-1 rounded-md px-3 py-2 hover:bg-primary/90"
          >
            <Plus size={16} />
            <span>Create your first alert</span>
          </Link>
        </div>
      ) : (
        <div className="crypto-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-muted-foreground text-left text-sm">
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
                    <Link 
                      to={`/portfolios/${alert.portfolioId}`}
                      className="hover:text-primary"
                    >
                              {alert.portfolioName ?? 'Unknown'}
                    </Link>
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
  );
};

export default Alerts;
