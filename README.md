# 🚀 Amb-HML - Visão Geral do Sistema

Aplicação simplificada com suporte a múltiplos ambientes (**DEV**, **HML** e **PROD**), interface moderna em **React + Tailwind CSS + Lucide Icons**, servidor em **Go** e persistência **SQLite** isolada.

---

## ⚡ Como Executar

Escolha o ambiente e rode o comando na raíz do projeto (inicia Backend e Frontend juntos):

- **Desenvolvimento (DEV)**: `npm run dev` _(Frontend: http://localhost:3000 | Backend: http://localhost:8080)_
- **Homologação (HML)**: `npm run hml` _(Frontend: http://localhost:3001 | Backend: http://localhost:8081)_
- **Produção (PROD)**: `npm run prod` _(Frontend: http://localhost:3002 | Backend: http://localhost:8082)_

_(Também é possível executar via PowerShell com `.\run-dev.ps1`, `.\hml\run-hml.ps1` ou `.\prod\run-prod.ps1`)_

---

## 📌 Resumo por Frente de Desenvolvimento

### 🎨 1. Frontend (`/app/frontend`)

- **Tecnologias**: React 19 + Vite + Tailwind CSS + Lucide Icons.
- **Função**: Interface gráfica interativa para criar, listar e remover itens.
- **Destaque**: Exibe um **Banner de Ambiente** (DEV = Azul, HML = Laranja, PROD = Verde) e mostra em tempo real qual arquivo SQLite está sendo manipulado.

### ⚙️ 2. Backend (`/app/backend`)

- **Tecnologias**: Go (Golang) com driver `modernc.org/sqlite` (Go puro).
- **Função**: API HTTP REST (`/health`, `/api/info`, `/api/items`).
- **Destaque**: Conecta dinamicamente ao arquivo SQLite do ambiente ativo, gerando tabelas e dados iniciais automaticamente.

### 🗄️ 3. Infraestrutura & Banco de Dados (`/infra`)

- **Tecnologia**: SQLite (`database.db`).
- **Função**: Persistência física em arquivos `.db` 100% isolados por ambiente:
  - `DEV`: `./app/infra/database.db`
  - `HML`: `./hml/infra/database.db`
  - `PROD`: `./prod/infra/database.db`

### 🧪 4. Ambiente de Homologação (`/hml`)

- **Função**: Espaço isolado para testes e validação de QA em staging.
- **Portas**: Frontend `3001` | Backend `8081`.

### 🚀 5. Ambiente de Produção (`/prod`)

- **Função**: Configuração do ambiente estável final.
- **Portas**: Frontend `3002` | Backend `8082`.

### 🔄 6. CI/CD (`/.github/workflows`)

- **Automação**: Workflow `hml-pipeline.yml` no GitHub Actions para testar compilações em commits da branch `hml`.

---

## 📚 Documentação Completa

Manual unificado e direto disponível em [`/docs/manual.md`](file:///c:/Users/Ed/Documents/GitHub/Amb-HML/docs/manual.md).
