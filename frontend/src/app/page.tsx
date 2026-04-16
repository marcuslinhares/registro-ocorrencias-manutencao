'use client';

import { useState, useEffect } from 'react';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { IncidentModal } from '@/components/incidents/IncidentModal';
import { Toaster } from '@/components/ui/toaster';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Debounce search input to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleTypeFilter = (type: string) => {
    setTypeFilter(typeFilter === type ? undefined : type);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
          <IncidentModal />
        </div>
        
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por equipamento, código ou motivo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            <div className="flex gap-2 items-center">
              <button
                onClick={() => toggleTypeFilter('Preventiva')}
                className={`px-4 h-[42px] border rounded-md transition-colors ${
                  typeFilter === 'Preventiva'
                    ? 'bg-[#4B5563] text-white border-[#4B5563]'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Preventiva
              </button>
              <button
                onClick={() => toggleTypeFilter('Corretiva')}
                className={`px-4 h-[42px] border rounded-md transition-colors ${
                  typeFilter === 'Corretiva'
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Corretiva
              </button>
              <button
                onClick={() => toggleTypeFilter('Planejada')}
                className={`px-4 h-[42px] border rounded-md transition-colors ${
                  typeFilter === 'Planejada'
                    ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                    : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                Planejada
              </button>

              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || '')}>
                <SelectTrigger className="w-[140px] h-[42px] bg-white border-gray-300 text-gray-700 rounded-md shadow-none focus:ring-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Status</SelectItem>
                  <SelectItem value="Em Aberto">Em Aberto</SelectItem>
                  <SelectItem value="Concluido">Concluido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <IncidentTable 
            typeOfOccurrence={typeFilter} 
            search={debouncedSearch} 
            status={statusFilter === '' ? undefined : statusFilter}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
