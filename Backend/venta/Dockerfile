# Build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app
COPY *.csproj .
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Run
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .
ENV ASPNETCORE_URLS=http://*:80
ENTRYPOINT ["dotnet", "venta.dll"]