# 📘 Manual Unificado do Sistema Amb-HML

Este documento centraliza todas as informações do sistema de forma objetiva.

---

## 🛠️ Pilha Tecnológica

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide Icons.
- **Backend**: Go 1.26, `modernc.org/sqlite` (Go puro).
- **Banco de Dados**: SQLite (`database.db`).

---

## 🔀 Tabela de Ambientes

| Ambiente | Comando Unificado | Porta Frontend | Porta Backend | Banco SQLite |
| :--- | :--- | :--- | :--- | :--- |
| **DEV** (Desenvolvimento) | `npm run dev` | `:3000` | `:8080` | `./app/infra/database.db` |
| **HML** (Homologação) | `npm run hml` | `:3001` | `:8081` | `./hml/infra/database.db` |
| **PROD** (Produção) | `npm run prod` | `:3002` | `:8082` | `./prod/infra/database.db` |

---

## 📍 Endpoints da API HTTP

- `GET /health`: Checagem de saúde e status do banco.
- `GET /api/info`: Informações de ambiente, porta e caminho absoluto do SQLite.
- `GET /api/items`: Lista todos os itens do banco SQLite do ambiente ativo.
- `POST /api/items`: Insere novo item no banco SQLite do ambiente ativo.
- `DELETE /api/items?id=X`: Remove item do banco pelo ID.
