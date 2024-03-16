FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["venta.csproj", "venta/"]
RUN dotnet restore "venta/venta.csproj"
COPY . .
WORKDIR "/src/venta"
RUN dotnet build "venta.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build As publish 
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "venta.csproj" -c $BUILD_CONFIGURATION -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "venta.dll" ]