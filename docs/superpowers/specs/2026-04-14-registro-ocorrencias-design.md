# Spec: Registro de Ocorrências de Manutenção (Fidelidade Visual e Arquitetural)

## 1. Visão Geral
Sistema de registro de ocorrências para manutenção industrial, seguindo o padrão visual de "Ordens de Serviço" com listagem em tabela e criação via Modal.

## 2. Tecnologias
- **Frontend:** Next.js (App Router), Apollo Client, Tailwind CSS, Shadcn UI.
- **Backend:** NestJS (Modular), GraphQL (@nestjs/graphql), Prisma ORM, MongoDB Atlas.
- **Docker:** Orquestração de `frontend` e `backend`.

## 3. Arquitetura Backend (Padrão NestJS das imagens)
- Estrutura modular: `src/incidents/`
  - `dto/`: `create-incident.input.ts`, `update-incident.input.ts`.
  - `entities/`: `incident.entity.ts`.
  - `incidents.module.ts`, `incidents.resolver.ts`, `incidents.service.ts`.

## 4. Modelo de Dados (Prisma)
### Incident
- `id`: String (ObjectID).
- `machineName`: String (obrigatório).
- `reason`: String (curta descrição/motivo).
- `description`: String (descrição detalhada).
- `severity`: String (Baixa, Média, Alta).
- `typeOfOccurrence`: String (Preventiva, Corretiva, Planejada).
- `isMachineStopped`: Boolean (default: false).
- `status`: String (default: "Em Aberto").
- `createdAt`: DateTime (default: now()).

## 5. Interface Frontend (Padrão das imagens)
- **Página Principal:**
  - Título "Ordens de Serviço".
  - Botão "+ Nova Ordem de Serviço" que abre um **Dialog (Modal)**.
  - Filtros (Busca, botões de Tipo, Dropdown de Status).
  - **Tabela de Dados:** Colunas para Equipamento, Tipo, Status, Motivo, Data e Ações.
- **Modal de Criação:**
  - `Combobox` para Máquina.
  - `Input` para Motivo.
  - `Select` para Tipo de Serviço.
  - `Checkbox` para "Máquina foi parada?".
  - `Textarea` para Descrição do Serviço.

## 6. Estrutura de Pastas
- `/frontend/src`: `app/`, `components/`, `lib/`, `hooks/`, `contexts/`.
- `/backend/src`: `incidents/`, `prisma/`, `app.module.ts`.
