import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IncidentTable, LAST_INCIDENTS } from './IncidentTable';
import { MockedProvider } from '@apollo/client/testing';

// Mock date-fns to avoid locale and timezone issues
jest.mock('date-fns', () => ({
  format: jest.fn(() => '15/01/2025 10:30'),
}));

jest.mock('date-fns/locale', () => ({
  ptBR: {},
}));

const mocks = [
  {
    request: {
      query: LAST_INCIDENTS,
      variables: { limit: 10 },
    },
    result: {
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
        ],
      },
    },
  },
];

describe('IncidentTable', () => {
  it('should show loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IncidentTable />
      </MockedProvider>
    );

    expect(screen.getByText('Carregando ocorrências...')).toBeInTheDocument();
  });

  it('should show error state', async () => {
    const errorMock = [
      {
        request: {
          query: LAST_INCIDENTS,
          variables: { limit: 10 },
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <IncidentTable />
      </MockedProvider>
    );

    expect(await screen.findByText(/Erro ao carregar ocorrências/)).toBeInTheDocument();
  });

  it('should render incidents correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IncidentTable />
      </MockedProvider>
    );

    expect(await screen.findByText('Machine A')).toBeInTheDocument();
    expect(screen.getByText('Corretiva')).toBeInTheDocument();
    expect(screen.getByText('Belt broken')).toBeInTheDocument();
  });

  it('should show empty state when no data', async () => {
    const emptyMock = [
      {
        request: {
          query: LAST_INCIDENTS,
          variables: { limit: 10 },
        },
        result: {
          data: { lastIncidents: [] },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <IncidentTable />
      </MockedProvider>
    );

    expect(await screen.findByText('Nenhuma ocorrência registrada.')).toBeInTheDocument();
  });
});
