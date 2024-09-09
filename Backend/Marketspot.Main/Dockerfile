# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-jammy-chiseled AS base
USER app
WORKDIR /app
EXPOSE 7149
EXPOSE 5066


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0-jammy AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Marketspot.Main/Backend.csproj", "Marketspot.Main/"]
COPY ["Marketspot.DataAccess/Marketspot.DataAccess.csproj", "Marketspot.DataAccess/"]
COPY ["Marketspot.Model/Marketspot.Model.csproj", "Marketspot.Model/"]
COPY ["Marketspot.EmailSender/Marketspot.EmailSender.csproj", "Marketspot.EmailSender/"]
COPY ["Marketspot.Validator/Marketspot.Validator.csproj", "Marketspot.Validator/"]
RUN dotnet restore "./Marketspot.Main/Backend.csproj"
COPY . .
WORKDIR "/src/Marketspot.Main"
RUN dotnet build "./Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Backend.dll"]