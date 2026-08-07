# Script para Inicialização do Ambiente de DESENVOLVIMENTO (Windows PowerShell)

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Iniciando Ambiente de Desenvolvimento (DEV) " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

$env:ENV = "desenvolvimento"
$env:PORT = "8080"
$env:DB_PATH = "$PSScriptRoot\app\infra\database.db"

Write-Host "[1/2] Iniciando Backend Go (Porta 8080 | SQLite Dev)..." -ForegroundColor Yellow
Start-Process -FilePath "go" -ArgumentList "run", "main.go" -WorkingDirectory "$PSScriptRoot\app\backend" -NoNewWindow

Write-Host "[2/2] Iniciando Frontend React (Modo Dev)..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\app\frontend"
npm run dev -- --port 3000
