# Ações na Tabela (CRUD Completo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar as funcionalidades de Editar e Deletar incidentes, com suporte no backend (GraphQL) e interface rica no frontend (Shadcn UI).

**Architecture:** Adição de mutations no NestJS. No Frontend, refatoração de componentes para reuso e adição de diálogos de confirmação.

**Tech Stack:** NestJS, GraphQL, Prisma, Apollo Client, Shadcn UI (AlertDialog, Dialog).

---

### Task 1: Backend - Novas Mutations GraphQL

**Files:**
- Create: `backend/src/incidents/dto/update-incident.input.ts`
- Modify: `backend/src/incidents/incidents.service.ts`
- Modify: `backend/src/incidents/incidents.resolver.ts`

- [ ] **Step 1: Criar `UpdateIncidentInput` (Partial de Create)**
- [ ] **Step 2: Adicionar `update` e `remove` no `IncidentsService`**
- [ ] **Step 3: Adicionar mutations no `IncidentsResolver`**
- [ ] **Step 4: Validar mutations no Playground**
- [ ] **Step 5: Commit**

---

### Task 2: Frontend - Refatoração do Modal (Editar)

**Files:**
- Rename: `frontend/src/components/incidents/NewIncidentModal.tsx` -> `frontend/src/components/incidents/IncidentModal.tsx`
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Renomear arquivo e atualizar referências**
- [ ] **Step 2: Adicionar prop `incident?` e lógica condicional (Título, Botão)**
- [ ] **Step 3: Implementar mutation `UPDATE_INCIDENT` no componente**
- [ ] **Step 4: Commit**

---

### Task 3: Frontend - Coluna de Ações e Exclusão

**Files:**
- Modify: `frontend/src/components/incidents/IncidentTable.tsx`
- Create: `frontend/src/components/ui/alert-dialog.tsx` (se faltar)

- [ ] **Step 1: Adicionar coluna "Ações" na tabela com ícones conforme imagem**
- [ ] **Step 2: Integrar o `IncidentModal` (modo edição) na linha da tabela**
- [ ] **Step 3: Implementar o `AlertDialog` de confirmação para exclusão**
- [ ] **Step 4: Conectar exclusão à mutation `deleteIncident` e atualizar tabela**
- [ ] **Step 5: Commit**

---

### Task 4: Verificação Final e CI/CD

- [ ] **Step 1: Testar fluxo: Criar -> Editar -> Excluir**
- [ ] **Step 2: Validar se o pipeline de CI/CD passa com as novas mudanças**
- [ ] **Step 3: Commit Final**
