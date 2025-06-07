import { useEffect, useState } from 'react';
import { priceStore } from '../lib/signalr/priceHub';

export function usePrices() {
    const [prices, setPrices] = useState<Record<string, number>>(priceStore.getPrices());

    useEffect(() => {
        priceStore.startConnection();

        const unsubscribe = priceStore.subscribe(setPrices);

        return () => {
            unsubscribe();
  
        };
    }, []);

    return prices;
}
