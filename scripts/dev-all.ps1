<#
PowerShell helper to run the ML scaffold and backend with recommended defaults.
Usage: run from repository root: .\scripts\dev-all.ps1

This script sets reasonable environment variables for local development and
then runs `npm run dev:all` which uses concurrently to start both services.
#>

param(
    [string]$Port = "3001",
    [string]$ModelPath = "",
    [string]$MLApiKey = ""
)

Write-Host "Starting dev environment (ML scaffold + backend)"

if ($ModelPath -ne "") {
    Write-Host "Using MODEL_PATH: $ModelPath"
    $env:MODEL_PATH = $ModelPath
}

if ($MLApiKey -ne "") {
    Write-Host "Using ML_API_KEY: (hidden)"
    $env:ML_API_KEY = $MLApiKey
}

Write-Host "Backend will run on port $Port"
$env:PORT = $Port

Write-Host "Running: npm run dev:all"
npm run dev:all
