import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";

let connection: HubConnection | null = null;

export const connectToPriceHub = (
    onReceivePrices: (prices: Record<string, number>) => void
) => {
    connection = new HubConnectionBuilder()
        .withUrl("https://localhost:5001/hubs/priceHub")
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    connection.on("ReceivePrices", (prices) => {
        onReceivePrices(prices);
    });

    connection.start()
        .catch(err => console.error("Connection failed:", err));
};

export const disconnectFromPriceHub = () => {
    connection?.stop();
};
