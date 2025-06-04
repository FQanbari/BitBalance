dotnet tool install --global dotnet-ef
 
dotnet ef migrations add InitialCreate --project ../BitBalance.Infrastructure --startup-project .
dotnet ef database update

#update
dotnet ef migrations add AddAppSettingsTable --project ../BitBalance.Infrastructure --startup-project .

dotnet ef database update --project ../BitBalance.Infrastructure --startup-project .







dotnet ef database update --project ../BitBalance.Infrastructure --startup-project .
