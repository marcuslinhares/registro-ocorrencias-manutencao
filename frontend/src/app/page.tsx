'use client';

import { IncidentTable } from '@/components/incidents/IncidentTable';
import { NewIncidentModal } from '@/components/incidents/NewIncidentModal';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
          <NewIncidentModal />
        </div>
        
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por equipamento, código ou motivo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#413129]"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Preventiva</button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Corretiva</button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Planejada</button>
            </div>
          </div>
          
          <IncidentTable />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
