'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil, Trash2 } from 'lucide-react';
import { IncidentModal } from './IncidentModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const LAST_INCIDENTS = gql`
  query LastIncidents($limit: Int, $typeOfOccurrence: String, $search: String, $status: String) {
    lastIncidents(limit: $limit, typeOfOccurrence: $typeOfOccurrence, search: $search, status: $status) {
      items {
        id
        machineName
        typeOfOccurrence
        status
        reason
        description
        severity
        isMachineStopped
        createdAt
        finishedAt
      }
      totalCount
    }
  }
`;

const DELETE_INCIDENT = gql`
  mutation DeleteIncident($id: String!) {
    deleteIncident(id: $id) {
      id
    }
  }
`;

interface Incident {
  id: string;
  machineName: string;
  typeOfOccurrence: string;
  status: string;
  reason: string;
  description: string;
  severity: string;
  isMachineStopped: boolean;
  createdAt: string;
  finishedAt?: string;
}

interface IncidentTableProps {
  typeOfOccurrence?: string;
  search?: string;
  status?: string;
}

export function IncidentTable({ typeOfOccurrence, search, status }: IncidentTableProps) {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(LAST_INCIDENTS, {
    variables: { 
      limit: 5, // Limit to only last 5 incidents as requested
      typeOfOccurrence: typeOfOccurrence || undefined,
      search: search || undefined,
      status: status || undefined
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteIncident, { loading: isDeleting }] = useMutation(DELETE_INCIDENT, {
    refetchQueries: ['LastIncidents'],
    onCompleted: () => {
      toast({ title: 'Sucesso!', description: 'Ocorrência excluída com sucesso.' });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({ title: 'Erro!', description: error.message });
      setDeleteId(null);
    },
  });

  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando ocorrências...</p>;
  if (error) return <p className="text-sm text-red-500 p-4">Erro ao carregar ocorrências: {error.message}</p>;

  const incidents: Incident[] = data?.lastIncidents?.items || [];
  const totalCount = data?.lastIncidents?.totalCount || 0;

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Preventiva':
        return 'bg-[#4B5563] text-white hover:bg-[#374151]';
      case 'Corretiva':
        return 'bg-[#EF4444] text-white hover:bg-[#DC2626]';
      case 'Planejada':
        return 'bg-[#3B82F6] text-white border-[#3B82F6] hover:bg-[#2563EB]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Concluido':
        return 'bg-[#10B981] text-white hover:bg-[#059669]';
      default:
        return 'bg-[#1F2937] text-white hover:bg-[#111827]';
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteIncident({ variables: { id: deleteId } });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 px-1">
        Lista de Ordens de Serviço ({totalCount})
      </h2>
      
      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-gray-900">Equipamento</TableHead>
              <TableHead className="font-semibold text-gray-900">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Motivo</TableHead>
              <TableHead className="font-semibold text-gray-900">Início da Ocorrência</TableHead>
              <TableHead className="font-semibold text-gray-900">Fim da Ocorrência</TableHead>
              <TableHead className="font-semibold text-gray-900 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhuma ocorrência encontrada.
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow key={incident.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex flex-col">
                      <span>{incident.machineName}</span>
                      <span className="text-xs text-gray-400 font-normal">29</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-none lowercase ${getTypeBadgeColor(incident.typeOfOccurrence)}`}>
                      {incident.typeOfOccurrence}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-none hover:opacity-90 ${getStatusBadgeColor(incident.status)}`}>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 max-w-[200px] truncate">
                    {incident.reason}
                  </TableCell>
                  <TableCell className="text-gray-500 whitespace-nowrap">
                    {format(new Date(incident.createdAt), 'dd/MM/yyyy. HH:mm', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-gray-500 whitespace-nowrap">
                    {incident.finishedAt 
                      ? format(new Date(incident.finishedAt), 'dd/MM/yyyy. HH:mm', { locale: ptBR })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <IncidentModal incident={incident}>
                        <button className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-orange-500 transition-colors cursor-pointer">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </IncidentModal>
                      <Dialog open={deleteId === incident.id} onOpenChange={(open) => setDeleteId(open ? incident.id : null)}>
                        <DialogTrigger>
                          <div className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-red-500 transition-colors cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" />
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Excluir Ocorrência</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="gap-2 pt-4">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>
                              Cancelar
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleDelete}
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
