
import React from 'react';
import { Trash } from 'lucide-react';
import { Asset } from '@/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AssetListProps {
  assets: Asset[];
  onRemove?: (assetId: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, onRemove }) => {
  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No assets in this portfolio</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b">
          <tr className="text-left text-sm text-muted-foreground">
            <th className="pb-3 pl-2">Asset</th>
            <th className="pb-3">Price</th>
            <th className="pb-3">Holdings</th>
            <th className="pb-3">Value</th>
            <th className="pb-3">Allocation</th>
            <th className="pb-3">Profit/Loss</th>
            {onRemove && <th className="pb-3"></th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b hover:bg-accent/50 text-sm">
              <td className="py-3 pl-2">
                <div className="flex items-center gap-2">
                  <div className="bg-accent w-8 h-8 flex items-center justify-center rounded-full">
                    <span className="font-semibold text-xs">{asset.coinSymbol}</span>
                  </div>
                  <div>
                    <div className="font-medium">{asset.coinSymbol}</div>
                    <div className="text-xs text-muted-foreground">{asset.coinName}</div>
                  </div>
                </div>
              </td>
              <td className="py-3">
                {formatCurrency(asset.currentPrice)}
                <div className="text-xs text-muted-foreground">
                  Bought: {formatCurrency(asset.purchasePrice)}
                </div>
              </td>
              <td className="py-3">
                {asset.quantity}
                <div className="text-xs text-muted-foreground">{asset.coinSymbol}</div>
              </td>
              <td className="py-3">{formatCurrency(asset.value)}</td>
              <td className="py-3">{formatPercentage(asset.allocation)}</td>
              <td className="py-3">
                <div className={cn(
                  asset.profit >= 0 ? "text-crypto-green" : "text-crypto-red",
                  "font-medium"
                )}>
                  {formatPercentage(asset.profitPercentage)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(asset.profit)}
                </div>
              </td>
              {onRemove && (
                <td className="py-3 text-right">
                  <button
                    onClick={() => onRemove(asset.id)}
                    className="p-1 hover:bg-destructive/10 text-destructive rounded"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetList;
