#!/bin/bash
# Script para Inicialização do Ambiente de DESENVOLVIMENTO (Linux/macOS)

echo "=============================================="
echo "  Iniciando Ambiente de Desenvolvimento (DEV) "
echo "=============================================="

export ENV="desenvolvimento"
export PORT="8080"
export DB_PATH="$(pwd)/app/infra/database.db"

echo "[1/2] Iniciando Backend Go (Porta 8080 | SQLite Dev)..."
go run app/backend/main.go &

echo "[2/2] Iniciando Frontend React (Modo Dev)..."
cd app/frontend
npm run dev -- --port 3000
