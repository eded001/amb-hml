#!/bin/bash
# Script para Inicialização do Ambiente de Homologação (Linux/macOS)

echo "=========================================="
echo "  Iniciando Ambiente de Homologação (HML) "
echo "=========================================="

export ENV="homologacao"
export PORT="8081"
export DB_PATH="$(pwd)/infra/database.db"

echo "[1/2] iniciando Backend Go (Porta 8081)..."
go run ../app/backend/main.go &

echo "[2/2] Iniciando Frontend React (Modo Homologação)..."
cd ../app/frontend
npm run dev:hml -- --port 3001
