import { IncidentTable } from '@/components/incidents/IncidentTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Registro de Ocorrências</h1>
            <p className="text-muted-foreground mt-1">Gerencie e monitore as manutenções industriais.</p>
          </div>
          {/* O botão de "Nova Ocorrência" será adicionado na Task 4 (Modal) */}
        </header>

        <main>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Últimas Ocorrências</h2>
            <IncidentTable />
          </div>
        </main>
      </div>
    </div>
  );
}
