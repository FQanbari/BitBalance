// store/slices/priceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PricesState {
    prices: Record<string, number>;
}

const initialState: PricesState = {
    prices: {},
};

const priceSlice = createSlice({
    name: 'prices',
    initialState,
    reducers: {
        setPrice: (state, action: PayloadAction<{ symbol: string; price: number }>) => {
            const { symbol, price } = action.payload;
            state.prices[symbol] = price;
        },
        setPrices: (state, action: PayloadAction<Record<string, number>>) => {
            state.prices = action.payload;
        },
    },
});

export const { setPrice, setPrices } = priceSlice.actions;
export default priceSlice.reducer;
