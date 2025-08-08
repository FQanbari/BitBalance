FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY src/BitBalance.API/*.csproj BitBalance.API/
COPY src/BitBalance.Application/*.csproj BitBalance.Application/
COPY src/BitBalance.Domain/*.csproj BitBalance.Domain/
COPY src/BitBalance.Infrastructure/*.csproj BitBalance.Infrastructure/

RUN dotnet restore BitBalance.API/BitBalance.API.csproj

COPY src/BitBalance.API/ BitBalance.API/
COPY src/BitBalance.Application/ BitBalance.Application/
COPY src/BitBalance.Infrastructure/ BitBalance.Infrastructure/
COPY src/BitBalance.Domain/ BitBalance.Domain/

WORKDIR /src/BitBalance.API
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "BitBalance.API.dll"]
