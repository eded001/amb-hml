# Script para Inicialização do Ambiente de PRODUÇÃO (Windows PowerShell)

Write-Host "==========================================" -ForegroundColor Red
Write-Host "  Iniciando Ambiente de Produção (PROD)   " -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red

$env:ENV = "producao"
$env:PORT = "8082"
$env:DB_PATH = "$PSScriptRoot\infra\database.db"

Write-Host "[1/2] Iniciando Backend Go (Porta 8082 | SQLite Prod)..." -ForegroundColor Yellow
Start-Process -FilePath "go" -ArgumentList "run", "main.go" -WorkingDirectory "$PSScriptRoot\..\app\backend" -NoNewWindow

Write-Host "[2/2] Iniciando Frontend React (Modo Produção)..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\app\frontend"
$env:VITE_APP_ENV = "producao"
$env:VITE_API_URL = "http://localhost:8082"
npm run build
npm run preview -- --port 3002
