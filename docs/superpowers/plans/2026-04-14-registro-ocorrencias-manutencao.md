# Registro de Ocorrências (Alta Fidelidade) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um sistema de registro de manutenção industrial com fidelidade visual (Shadcn UI Table/Modal) e arquitetural (NestJS Modular).

**Architecture:** Frontend e Backend em containers separados. Backend modular com DTOs, Services e Resolvers. Frontend Next.js organizado por pastas de responsabilidade.

**Tech Stack:** Next.js, NestJS, Apollo, Prisma, MongoDB Atlas, Tailwind, Shadcn.

---

### Task 1: Scaffolding Modular

**Files:**
- Create: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`

- [ ] **Step 1: Criar `docker-compose.yml` raiz**
- [ ] **Step 2: Gerar aplicação NestJS em `backend`**
- [ ] **Step 3: Instalar dependências iniciais e configurar Dockerfiles**
- [ ] **Step 4: Commit**

---

### Task 2: Backend - Módulo de Incidentes (NestJS Modular)

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/src/incidents/dto/create-incident.input.ts`
- Create: `backend/src/incidents/incidents.service.ts`
- Create: `backend/src/incidents/incidents.resolver.ts`
- Create: `backend/src/incidents/incidents.module.ts`

- [ ] **Step 1: Definir o modelo `Incident` no Prisma (incluindo `isMachineStopped`)**
- [ ] **Step 2: Implementar DTOs e Resolvers no padrão das imagens (Domain-driven)**
- [ ] **Step 3: Testar Mutation e Query no GraphQL Playground**
- [ ] **Step 4: Commit**

---

### Task 3: Frontend - Layout e Apollo

**Files:**
- Create: `frontend/src/lib/apollo-client.ts`
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Configurar Apollo Client**
- [ ] **Step 2: Instalar Shadcn UI (Table, Dialog, Form, Input, Checkbox, Badge)**
- [ ] **Step 3: Commit**

---

### Task 4: Frontend - Tabela de Ocorrências (Listagem)

**Files:**
- Create: `frontend/src/components/incidents/IncidentTable.tsx`
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Implementar a tabela de listagem conforme imagem 1 (Equipamento, Tipo, Status, Motivo, Data)**
- [ ] **Step 2: Estilizar badges de Tipo (Preventiva, Corretiva, Planejada) e Status**
- [ ] **Step 3: Commit**

---

### Task 4: Frontend - Modal de Nova Ocorrência

**Files:**
- Create: `frontend/src/components/incidents/NewIncidentModal.tsx`
- Create: `frontend/src/components/incidents/MachineCombobox.tsx`

- [ ] **Step 1: Criar o Modal (Dialog) conforme imagem 2**
- [ ] **Step 2: Implementar o Combobox para Máquinas**
- [ ] **Step 3: Implementar o formulário com `isMachineStopped` (Checkbox)**
- [ ] **Step 4: Conectar à Mutation e refetch da tabela**
- [ ] **Step 5: Commit**

---

### Task 5: Finalização e Docker Compose

- [ ] **Step 1: Orquestrar tudo via `docker-compose up`**
- [ ] **Step 2: Testar fluxo completo: Abrir Modal -> Cadastrar -> Ver na Tabela**
- [ ] **Step 3: Commit Final**
