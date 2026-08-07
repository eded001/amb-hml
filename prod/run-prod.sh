#!/bin/bash
# Script para Inicialização do Ambiente de PRODUÇÃO (Linux/macOS)

echo "=========================================="
echo "  Iniciando Ambiente de Produção (PROD)   "
echo "=========================================="

export ENV="producao"
export PORT="8082"
export DB_PATH="$(pwd)/infra/database.db"

echo "[1/2] Iniciando Backend Go (Porta 8082 | SQLite Prod)..."
go run ../app/backend/main.go &

echo "[2/2] Iniciando Frontend React (Modo Produção)..."
cd ../app/frontend
export VITE_APP_ENV="producao"
export VITE_API_URL="http://localhost:8082"
npm run build
npm run preview -- --port 3002
