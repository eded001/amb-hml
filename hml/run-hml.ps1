# Script para Inicialização do Ambiente de Homologação (Windows PowerShell)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Ambiente de Homologação (HML) " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$env:ENV = "homologacao"
$env:PORT = "8081"
$env:DB_PATH = "$PSScriptRoot\infra\database.db"

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "[1/2] Iniciando Backend Go (Porta 8081 | SQLite HML)..." -ForegroundColor Yellow
Start-Process -FilePath "go" -ArgumentList "run", "main.go" -WorkingDirectory "$PSScriptRoot\..\app\backend" -NoNewWindow

Write-Host "[2/2] Iniciando Frontend React (Modo Homologação)..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\app\frontend"
npm run dev:hml -- --port 3001
