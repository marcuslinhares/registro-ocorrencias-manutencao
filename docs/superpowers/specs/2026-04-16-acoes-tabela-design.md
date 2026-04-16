# Spec: Ações na Tabela de Ocorrências (Edição e Exclusão)

## 1. Visão Geral
Adição de uma coluna de "Ações" na listagem de ordens de serviço, permitindo a edição e exclusão de registros, com confirmação de segurança.

## 2. Interface GraphQL (Novas Mutations)
### updateIncident(id: String!, data: UpdateIncidentInput!): Incident!
- Atualiza campos de uma ocorrência existente.
- Retorna o objeto atualizado.

### deleteIncident(id: String!): Incident!
- Remove permanentemente uma ocorrência do MongoDB.
- Retorna o objeto deletado.

## 3. Componentes Frontend
### IncidentTable (Atualização)
- Nova coluna **Ações** no final da tabela.
- **Botões (Ícones Lucide):**
  - `Printer`: Estético (sem lógica ativa).
  - `ExternalLink`: Estético (sem lógica ativa).
  - `Pencil`: Abre o modal de edição preenchido com os dados da linha.
  - `Trash2`: Abre o `AlertDialog` de confirmação de exclusão.

### IncidentModal (Refatoração)
- Transformação do `NewIncidentModal` em um componente genérico.
- **Propriedade `incident?`**: Se presente, o modal entra em modo de edição.
- **Lógica:** Alterna entre `CREATE_INCIDENT` e `UPDATE_INCIDENT` mutations.

### DeleteConfirmation (AlertDialog)
- Componente de confirmação padrão do Shadcn UI.
- Texto: "Tem certeza que deseja excluir esta ocorrência? Esta ação não pode ser desfeita."
- Botão "Excluir" com variante `destructive`.

## 4. Fluxo de Dados
1. Usuário clica em Ação -> Estado local captura o ID do incidente.
2. Modal/Dialog abre.
3. Submissão dispara Mutation -> Apollo refetch da query `lastIncidents`.
4. Toast confirma a operação.
