'use client';

import { useQuery, gql } from '@apollo/client';
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

const LAST_INCIDENTS = gql`
  query LastIncidents($limit: Int) {
    lastIncidents(limit: $limit) {
      id
      machineName
      typeOfOccurrence
      status
      reason
      createdAt
    }
  }
`;

interface Incident {
  id: string;
  machineName: string;
  typeOfOccurrence: string;
  status: string;
  reason: string;
  createdAt: string;
}

export function IncidentTable() {
  const { data, loading, error } = useQuery(LAST_INCIDENTS, {
    variables: { limit: 10 },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) return <p className="text-sm text-muted-foreground p-4">Carregando ocorrências...</p>;
  if (error) return <p className="text-sm text-red-500 p-4">Erro ao carregar ocorrências: {error.message}</p>;

  const incidents: Incident[] = data?.lastIncidents || [];

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Preventiva':
        return 'bg-[#4B5563] text-white hover:bg-[#374151]'; // Dark Grey
      case 'Corretiva':
        return 'bg-[#EF4444] text-white hover:bg-[#DC2626]'; // Red
      case 'Planejada':
        return 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'; // Blue
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                Nenhuma ocorrência registrada.
              </TableCell>
            </TableRow>
          ) : (
            incidents.map((incident) => (
              <TableRow key={incident.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{incident.machineName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-none ${getTypeBadgeColor(incident.typeOfOccurrence)}`}>
                    {incident.typeOfOccurrence}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-[#1F2937] text-white border-none hover:bg-[#111827]">
                    {incident.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 max-w-[200px] truncate">
                  {incident.reason}
                </TableCell>
                <TableCell className="text-gray-500">
                  {format(new Date(incident.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
