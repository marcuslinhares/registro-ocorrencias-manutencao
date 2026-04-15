# Registro de Ocorrências de Manutenção

Aplicação full stack para registro e acompanhamento de ocorrências de manutenção industrial.

## Visão geral

O projeto é composto por:

- **Frontend**: Next.js + Apollo Client + Tailwind CSS
- **Backend**: NestJS + GraphQL + Prisma
- **Banco de dados**: MongoDB (via `DATABASE_URL`)
- **Orquestração local**: Docker Compose

## Estrutura do repositório

```text
.
├── backend/        # API GraphQL (NestJS + Prisma)
├── frontend/       # Interface web (Next.js)
├── docker-compose.yml
└── docs/
```

## Funcionalidades atuais

- Cadastro de ocorrência via mutation GraphQL (`createIncident`)
- Listagem das últimas ocorrências via query GraphQL (`lastIncidents`)
- Exibição em tabela no frontend com:
  - equipamento
  - tipo da ocorrência
  - status
  - motivo
  - data

## Pré-requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose (opcional)
- MongoDB Atlas/local

## Configuração de ambiente

No backend, configure o arquivo:

- `backend/.env`

Exemplo:

```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/database"
```

## Como executar localmente (sem Docker)

### 1) Backend

```bash
cd backend
npm install
npm run start:dev
```

API GraphQL disponível em: `http://localhost:4000/graphql`

### 2) Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: `http://localhost:3000`

## Como executar com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

Serviços:

- Frontend: `http://localhost:3000`
- Backend (GraphQL): `http://localhost:4000/graphql`

## Scripts úteis

### Backend (`/backend`)

- `npm run start:dev` — inicia em modo desenvolvimento
- `npm run build` — build de produção
- `npm run start:prod` — executa build de produção
- `npm run lint` — lint com ESLint
- `npm run test` — testes com Jest

### Frontend (`/frontend`)

- `npm run dev` — inicia em modo desenvolvimento
- `npm run build` — build de produção
- `npm run start` — executa build de produção
- `npm run lint` — lint com ESLint

## Stack técnica

- **Frontend**: Next.js (App Router), React, Apollo Client, Tailwind CSS
- **Backend**: NestJS, Apollo GraphQL, Prisma ORM
- **Banco**: MongoDB
- **Containerização**: Docker + Docker Compose
