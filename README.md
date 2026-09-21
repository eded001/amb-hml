# Amb-HML

Aplicação full stack criada para demonstrar **separação real de ambientes DEV, HML e PROD**, com frontend React, backend Go e persistência SQLite isolada por ambiente.

## Stack

- React 19
- Vite
- Tailwind CSS
- Go
- SQLite
- GitHub Actions
- Node.js para orquestração dos ambientes

## Ambientes

| Ambiente | Frontend | Backend | Banco |
|---|---:|---:|---|
| DEV | 3000 | 8080 | `./app/infra/database.db` |
| HML | 3001 | 8081 | `./hml/infra/database.db` |
| PROD | 3002 | 8082 | `./prod/infra/database.db` |

Cada ambiente utiliza seu próprio arquivo SQLite, evitando compartilhamento acidental de dados entre desenvolvimento, homologação e produção.

## Executando

Na raiz do projeto:

```bash
npm install
npm run dev
```

Homologação:

```bash
npm run hml
```

Produção:

```bash
npm run prod
```

Também existem scripts PowerShell/Shell para inicialização dos ambientes.

## Arquitetura

```text
.
├── app/
│   ├── backend/
│   ├── frontend/
│   └── infra/
├── hml/
├── prod/
├── docs/
└── .github/workflows/
```

O backend expõe endpoints REST como `/health`, `/api/info` e `/api/items`, enquanto o frontend identifica visualmente o ambiente ativo.

## CI/CD

O projeto inclui workflow do GitHub Actions voltado à validação da branch de homologação.

## Documentação

Consulte [`docs/manual.md`](./docs/manual.md) para detalhes adicionais.
