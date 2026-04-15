'use client';

import { useState } from '@react-hook-form/resolvers/zod';
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

const formSchema = z.object({
  machineName: z.string().min(1, 'Selecione a máquina'),
  reason: z.string().min(1, 'Digite o motivo'),
  typeOfOccurrence: z.string().min(1, 'Selecione o tipo'),
  isMachineStopped: z.boolean().default(false),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
});

export function NewIncidentModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineName: '',
      reason: '',
      typeOfOccurrence: '',
      isMachineStopped: false,
      description: '',
    },
  });

  const [createIncident, { loading }] = useMutation(CREATE_INCIDENT, {
    refetchQueries: [{ query: LAST_INCIDENTS, variables: { limit: 5 } }],
    onCompleted: () => {
      toast({
        title: 'Sucesso!',
        description: 'Ordem de serviço criada com sucesso.',
      });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: error.message,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createIncident({
      variables: {
        createIncidentInput: values,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#413129] hover:bg-[#2d221c]">
          + Nova Ordem de Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="machineName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Máquina *</FormLabel>
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
                  <FormItem>
                    <FormLabel>Motivo *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o motivo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="typeOfOccurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                name="isMachineStopped"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Máquina foi parada?</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Serviço *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva detalhadamente o serviço..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#413129] hover:bg-[#2d221c]"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Ordem de Serviço'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
