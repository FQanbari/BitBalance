import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import { store } from "../store";
import { setPrice } from "../priceSlice";


type PriceUpdateCallback = (prices: Record<string, number>) => void;
const fakeCryptoPrices: Record<string, number> = {
    BTC: 68234.15,
    ETH: 3795.23,
    BNB: 615.72,
    SOL: 148.97,
    XRP: 0.531,
    ADA: 0.443,
    DOGE: 0.123,
    DOT: 7.64,
    AVAX: 31.58,
    SHIB: 0.000024,
    MATIC: 0.92,
    LINK: 17.81,
    LTC: 87.45,
    TRX: 0.114,
    UNI: 9.32
};

class PriceStore {
    private connection: HubConnection | null = null;
    private prices: Record<string, number> = {};
    private listeners: PriceUpdateCallback[] = [];

    subscribe(callback: PriceUpdateCallback) {
        this.listeners.push(callback);
        callback({ ...this.prices });

        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notify() {
        const copy = { ...this.prices };
        this.listeners.forEach(cb => cb(copy));
    }

    public startConnection() {
        if (this.connection) return;

        this.connection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/priceHub`)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.connection.on("ReceivePriceAlert", (symbol: string, price: number) => {
            this.prices[symbol] = price;
            this.notify();
            store.dispatch(setPrice({ symbol, price }));
        });

        this.connection.start()
            .then(() => {
                console.log("Connected to price hub.");
            })
            .catch((err) => {
                console.error("Connection failed:", err);
                // اگر دلت خواست، اینجا میتونی داده فیک هم بفرستی

            });

        this.connection.onclose((err) => {
            console.warn("Connection closed.", err);
        });
    }

    public stopConnection() {
        if (!this.connection) return;
        this.connection.stop()
            .then(() => console.log("Disconnected from price hub."))
            .catch((err) => console.error("Error while disconnecting:", err));
        this.connection = null;
    }

    public getPrices() {
        return { ...this.prices };
    }
}

export const priceStore = new PriceStore();
