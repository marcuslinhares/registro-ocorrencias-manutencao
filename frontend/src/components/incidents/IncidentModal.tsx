'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, gql } from '@apollo/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MachineCombobox } from './MachineCombobox';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';

const CREATE_INCIDENT = gql`
  mutation CreateIncident($createIncidentInput: CreateIncidentInput!) {
    createIncident(createIncidentInput: $createIncidentInput) {
      id
      machineName
    }
  }
`;

const UPDATE_INCIDENT = gql`
  mutation UpdateIncident($id: String!, $updateIncidentInput: UpdateIncidentInput!) {
    updateIncident(id: $id, updateIncidentInput: $updateIncidentInput) {
      id
      machineName
    }
  }
`;

const LAST_INCIDENTS = gql`
  query LastIncidents($limit: Int, $typeOfOccurrence: String, $search: String, $status: String) {
    lastIncidents(limit: $limit, typeOfOccurrence: $typeOfOccurrence, search: $search, status: $status) {
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
  }
`;

const formSchema = z.object({
  machineName: z.string().min(1, 'Selecione a máquina'),
  reason: z.string().min(1, 'Digite o motivo'),
  typeOfOccurrence: z.string().min(1, 'Selecione o tipo'),
  severity: z.string().min(1, 'Selecione a gravidade'),
  isMachineStopped: z.boolean(),
  status: z.string().optional(),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
});

export function IncidentModal({ incident, children }: { incident?: any, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineName: '',
      reason: '',
      typeOfOccurrence: '',
      severity: '',
      isMachineStopped: false,
      status: 'Em Aberto',
      description: '',
    },
  });

  // Pre-fill form when incident changes
  useEffect(() => {
    if (incident) {
      form.reset({
        machineName: incident.machineName,
        reason: incident.reason,
        typeOfOccurrence: incident.typeOfOccurrence,
        severity: incident.severity || 'Média',
        isMachineStopped: incident.isMachineStopped || false,
        status: incident.status || 'Em Aberto',
        description: incident.description || '',
      });
    } else {
      form.reset({
        machineName: '',
        reason: '',
        typeOfOccurrence: '',
        severity: '',
        isMachineStopped: false,
        status: 'Em Aberto',
        description: '',
      });
    }
  }, [incident, form, open]);

  const [createIncident, { loading: creating }] = useMutation(CREATE_INCIDENT, {
    refetchQueries: [{ query: LAST_INCIDENTS, variables: { limit: 10 } }],
    onCompleted: () => {
      toast({ title: 'Sucesso!', description: 'Ordem de serviço criada com sucesso.' });
      setOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Erro!', description: error.message });
    },
  });

  const [updateIncident, { loading: updating }] = useMutation(UPDATE_INCIDENT, {
    refetchQueries: [{ query: LAST_INCIDENTS, variables: { limit: 10 } }],
    onCompleted: () => {
      toast({ title: 'Sucesso!', description: 'Ordem de serviço atualizada com sucesso.' });
      setOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Erro!', description: error.message });
    },
  });

  const loading = creating || updating;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { status, ...rest } = values;
    if (incident) {
      updateIncident({
        variables: {
          id: incident.id,
          updateIncidentInput: { ...rest, status },
        },
      });
    } else {
      createIncident({
        variables: {
          createIncidentInput: rest,
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children || (
          <div className="bg-[#413129] hover:bg-[#2d221c] inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white shadow h-9 px-4 py-2 cursor-pointer">
            + Nova Ordem de Serviço
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{incident ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="machineName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700 font-semibold">Máquina *</FormLabel>
                    <MachineCombobox
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="text-gray-700 font-semibold">Motivo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o motivo..." {...field} className="focus:ring-[#413129] w-full break-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="typeOfOccurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Tipo de Serviço *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-[#413129]">
                          <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Preventiva">Preventiva</SelectItem>
                        <SelectItem value="Corretiva">Corretiva</SelectItem>
                        <SelectItem value="Planejada">Planejada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">Gravidade *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-[#413129]">
                          <SelectValue placeholder="Selecione a gravidade..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {incident && (
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-semibold">Status da Ocorrência *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-[#413129]">
                            <SelectValue placeholder="Selecione o status..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Em Aberto">Em Aberto</SelectItem>
                          <SelectItem value="Concluido">Concluido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 min-w-0">
              <FormField
                control={form.control}
                name="isMachineStopped"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#413129] data-[state=checked]:border-[#413129] flex-shrink-0"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none min-w-0">
                      <FormLabel className="text-sm font-medium text-gray-900 cursor-pointer break-words">
                        A máquina precisou ser parada para este serviço?
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="text-gray-700 font-semibold">Descrição Detalhada *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva detalhadamente o problema e o serviço que será realizado..."
                      className="resize-none h-32 focus:ring-[#413129] w-full break-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4 border-t gap-3 flex items-center justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-md border-gray-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#413129] hover:bg-[#2d221c] rounded-md px-6"
                disabled={loading}
              >
                {loading ? 'Salvando...' : (incident ? 'Salvar Alterações' : 'Criar Ordem de Serviço')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
