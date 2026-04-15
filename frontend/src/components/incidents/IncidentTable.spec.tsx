import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IncidentTable } from './IncidentTable';

const mockUseQuery = jest.fn();

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  gql: jest.fn((strings: TemplateStringsArray) => strings[0]),
}));

jest.mock('date-fns', () => ({
  format: jest.fn((date: Date, _fmt: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }),
}));

jest.mock('date-fns/locale', () => ({
  ptBR: {},
}));

describe('IncidentTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Carregando ocorrências...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: { message: 'Network error' },
    });

    render(<IncidentTable />);

    expect(screen.getByText('Erro ao carregar ocorrências: Network error')).toBeInTheDocument();
  });

  it('should show empty state', () => {
    mockUseQuery.mockReturnValue({
      data: { lastIncidents: [] },
      loading: false,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Nenhuma ocorrência registrada.')).toBeInTheDocument();
  });

  it('should show empty state when data is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Nenhuma ocorrência registrada.')).toBeInTheDocument();
  });

  it('should render incidents correctly', () => {
    mockUseQuery.mockReturnValue({
      data: {
        lastIncidents: [
          {
            id: '1',
            machineName: 'Machine A',
            typeOfOccurrence: 'Corretiva',
            status: 'Em Aberto',
            reason: 'Belt broken',
            createdAt: '2025-01-15T10:30:00Z',
          },
          {
            id: '2',
            machineName: 'Machine B',
            typeOfOccurrence: 'Preventiva',
            status: 'Em Aberto',
            reason: 'Regular maintenance',
            createdAt: '2025-01-14T08:00:00Z',
          },
        ],
      },
      loading: false,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Machine A')).toBeInTheDocument();
    expect(screen.getByText('Machine B')).toBeInTheDocument();
    expect(screen.getByText('Corretiva')).toBeInTheDocument();
    expect(screen.getByText('Preventiva')).toBeInTheDocument();
    expect(screen.getByText('Belt broken')).toBeInTheDocument();
    expect(screen.getByText('Regular maintenance')).toBeInTheDocument();
  });

  it('should render Planejada badge', () => {
    mockUseQuery.mockReturnValue({
      data: {
        lastIncidents: [
          {
            id: '3',
            machineName: 'Machine C',
            typeOfOccurrence: 'Planejada',
            status: 'Em Aberto',
            reason: 'Planned upgrade',
            createdAt: '2025-01-13T12:00:00Z',
          },
        ],
      },
      loading: false,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Planejada')).toBeInTheDocument();
  });

  it('should render unknown type with default badge', () => {
    mockUseQuery.mockReturnValue({
      data: {
        lastIncidents: [
          {
            id: '4',
            machineName: 'Machine D',
            typeOfOccurrence: 'Other',
            status: 'Em Aberto',
            reason: 'Unknown type',
            createdAt: '2025-01-12T09:00:00Z',
          },
        ],
      },
      loading: false,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('should render table headers', () => {
    mockUseQuery.mockReturnValue({
      data: { lastIncidents: [] },
      loading: false,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(screen.getByText('Equipamento')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Motivo')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('should call useQuery with correct variables', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    });

    render(<IncidentTable />);

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        variables: { limit: 10 },
        fetchPolicy: 'cache-and-network',
      }),
    );
  });
});
