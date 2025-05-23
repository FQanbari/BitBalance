# BitBalance - Personal Cryptocurrency Portfolio Tracker

## Overview

BitBalance is a web application designed to help users track and manage their cryptocurrency portfolios. It allows users to manually input their crypto assets, retrieve real-time prices from external APIs, calculate portfolio value, track profit/loss, visualize trends, and receive price alerts. The project is built with a focus on clean, maintainable, and testable code, making it a showcase of modern .NET development practices.

This project is developed as part of a portfolio to demonstrate senior-level skills in .NET development, including Clean Architecture, Domain-Driven Design (DDD) principles, API integration, real-time notifications, and CI/CD pipelines.

## Features (MVP)

* **Asset Management**: Add, update, and delete cryptocurrency assets (e.g., BTC, ETH) with details like quantity, purchase price, and date.
* **Real-Time Portfolio Value**: Fetch live prices from the CoinGecko API to calculate the total value of the portfolio.
* **Profit and Loss (P\&L)**: Track profit or loss for each asset based on purchase price and current market price.
* **Portfolio Trends**: Visualize portfolio value trends over time using interactive charts.
* **Summary Reports**: View aggregated portfolio data, including total value, asset allocation, and percentage distribution.
* **Price Alerts**: Receive real-time notifications when an asset's price crosses a user-defined threshold.

## Architecture

The project follows Clean Architecture principles to ensure a modular, testable, and maintainable codebase. It incorporates tactical DDD patterns (e.g., Entities, Value Objects, and Aggregates) to model the domain effectively. The architecture is divided into four layers:

* **Domain**: Contains core business logic, Entities (e.g., Asset, Portfolio), Value Objects (e.g., Money), and domain-specific interfaces. This layer is independent of any external frameworks.
* **Application**: Implements application logic, including services, Commands, and Queries. It uses the CQRS pattern (via MediatR) to separate read and write operations.
* **Infrastructure**: Handles external dependencies, such as database access (via Entity Framework Core), API integrations (CoinGecko), and real-time notifications (SignalR).
* **Presentation**: Provides the user interface through ASP.NET Core APIs and a Blazor dashboard for interactive visualization.

## Why Clean Architecture?

* Ensures separation of concerns, making the codebase easier to maintain and extend.
* Promotes testability by isolating business logic from infrastructure.
* Aligns with SOLID principles, particularly Dependency Inversion, to decouple layers.

## DDD Elements

* **Entities**: Asset and Portfolio with unique identities and business rules (e.g., validating non-negative quantities).
* **Value Objects**: Money to represent monetary values with currency.
* **Aggregates**: Portfolio as an Aggregate Root managing a collection of Asset entities.
* **Repositories**: Abstracted data access with interfaces in the Domain layer and implementations in Infrastructure.

## Technologies Used

* .NET 8: Core framework for building the application.
* ASP.NET Core: For RESTful APIs and Minimal APIs.
* Entity Framework Core: ORM for database operations (SQLite for development).
* Blazor: For building an interactive dashboard to visualize portfolio data.
* SignalR: For real-time price alerts.
* CoinGecko API: For fetching live cryptocurrency prices.
* MediatR: For implementing CQRS and decoupling application logic.
* xUnit & Moq: For unit and integration testing.
* GitHub Actions: For CI/CD pipeline to automate build and test processes.
* Swagger: For API documentation.
* Serilog: For structured logging.

## Project Structure

```
BitBalance/
├── BitBalance.Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Interfaces/
│   ├── Exceptions/
├── BitBalance.Application/
│   ├── Interfaces/
│   ├── Services/
│   ├── DTOs/
│   ├── Commands/
│   ├── Queries/
├── BitBalance.Infrastructure/
│   ├── Caching/
│   ├── Data/
│   ├── Repositories/
│   ├── Fallback/
│   ├── Services/
│   ├── SignalR/
├── BitBalance.API/
│   ├── Controllers/
│   ├── Pages/
│   ├── wwwroot/
├── BitBalance.Tests/
```

## Setup and Installation

### Prerequisites

* .NET 8 SDK
* SQLite (or any supported database for EF Core)
* Git
* Visual Studio 2022 (or any IDE supporting .NET)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/FQanbari/BitBalance.git
   cd BitBalance
   ```

2. **Restore Dependencies:**

   ```bash
   dotnet restore
   ```

3. **Set Up the Database:**

   * Update the connection string in `appsettings.json` (default uses SQLite).
   * Run migrations to create the database:

     ```bash
     dotnet ef migrations add InitialCreate --project BitBalance.Infrastructure
     dotnet ef database update --project BitBalance.Infrastructure
     ```

4. **Run the Application:**

   ```bash
   dotnet run --project BitBalance.API
   ```

   Access the API at: [https://localhost:5001/swagger](https://localhost:5001/swagger)

5. **Run Tests:**

   ```bash
   dotnet test BitBalance.Tests
   ```

## Future Scalability

To scale the application for larger user bases or additional features, the following approaches could be considered:

* **Microservices**: Split the application into independent services (e.g., Portfolio Service, Price Service, Notification Service) communicating via REST or a message broker like RabbitMQ.
* **Caching**: Use Redis to cache frequently accessed price data from CoinGecko.
* **Authentication**: Add JWT-based authentication to secure APIs.
* **Advanced Analytics**: Integrate machine learning models for price predictions or portfolio optimization.

## Challenges and Learnings

* **API Integration**: Handling rate limits and errors from CoinGecko required implementing retry policies with Polly.
* **Real-Time Notifications**: Configuring SignalR for reliable price alerts was a valuable learning experience in real-time communication.
* **Testing**: Writing comprehensive unit tests for domain logic and integration tests for APIs improved code quality and confidence in refactoring.
* **Clean Architecture**: Adhering to layer boundaries and SOLID principles required careful planning but resulted in a highly maintainable codebase.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. Ensure all tests pass and follow the coding guidelines.

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, feel free to reach out via [LinkedIn](https://www.linkedin.com/in/f-qanbari).

---

✅ **Status**: The project is under active development and is used as a portfolio piece to showcase advanced skills in .NET architecture and software engineering.
