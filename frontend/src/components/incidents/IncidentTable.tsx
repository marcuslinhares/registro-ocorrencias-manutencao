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
import { Printer, ExternalLink, Pencil, Trash2 } from 'lucide-react';
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
  query LastIncidents($limit: Int, $typeOfOccurrence: String, $search: String) {
    lastIncidents(limit: $limit, typeOfOccurrence: $typeOfOccurrence, search: $search) {
      id
      machineName
      typeOfOccurrence
      status
      reason
      description
      severity
      isMachineStopped
      createdAt
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
}

interface IncidentTableProps {
  typeOfOccurrence?: string;
  search?: string;
}

export function IncidentTable({ typeOfOccurrence, search }: IncidentTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, loading, error } = useQuery(LAST_INCIDENTS, {
    variables: { 
      limit: 10,
      typeOfOccurrence: typeOfOccurrence || undefined,
      search: search || undefined
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteIncident] = useMutation(DELETE_INCIDENT, {
    refetchQueries: [{ query: LAST_INCIDENTS, variables: { limit: 10 } }],
    onCompleted: () => {
      toast({ title: 'Sucesso!', description: 'Ocorrência excluída com sucesso.' });
      setIsDeleting(false);
    },
    onError: (error) => {
      toast({ title: 'Erro!', description: error.message });
      setIsDeleting(false);
    },
  });

  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando ocorrências...</p>;
  if (error) return <p className="text-sm text-red-500 p-4">Erro ao carregar ocorrências: {error.message}</p>;

  const incidents: Incident[] = data?.lastIncidents || [];

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

  const handleDelete = (id: string) => {
    setIsDeleting(true);
    deleteIncident({ variables: { id } });
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-semibold text-gray-900">Equipamento</TableHead>
            <TableHead className="font-semibold text-gray-900">Tipo</TableHead>
            <TableHead className="font-semibold text-gray-900">Status</TableHead>
            <TableHead className="font-semibold text-gray-900">Motivo</TableHead>
            <TableHead className="font-semibold text-gray-900">Data</TableHead>
            <TableHead className="font-semibold text-gray-900 text-right text-black font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                Nenhuma ocorrência encontrada.
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((incident) => (
              <TableRow key={incident.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">
                  <div className="flex flex-col">
                    <span>{incident.machineName}</span>
                    <span className="text-xs text-gray-400 font-normal">29</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-none ${getTypeBadgeColor(incident.typeOfOccurrence)}`}>
                    {incident.typeOfOccurrence.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-[#1F2937] text-white border-none hover:bg-[#111827]">
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {incident.reason}
                </TableCell>
                <TableCell className="text-gray-500">
                  {format(new Date(incident.createdAt), 'dd/MM/yyyy. HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                      <Printer className="h-4 w-4" />
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-blue-600 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    
                    <IncidentModal incident={incident}>
                      <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-orange-500 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                    </IncidentModal>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Excluir Ocorrência</DialogTitle>
                          <DialogDescription>
                            Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => (document.querySelector('[data-state="open"]') as any)?.click()}>
                            Cancelar
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDelete(incident.id)}
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
  );
}
