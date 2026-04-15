import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';
import { MockedProvider } from '@apollo/client/testing';

// Mock components that use Apollo internally if we want to avoid deep mocking
jest.mock('@/components/incidents/IncidentTable', () => ({
  IncidentTable: () => <div data-testid="incident-table">Mock Table</div>,
}));

// Mock NewIncidentModal to avoid Apollo hooks issues in simple page tests
jest.mock('@/components/incidents/NewIncidentModal', () => ({
  NewIncidentModal: () => <button data-testid="new-incident-modal">+ Nova Ordem de Serviço</button>,
}));

// Mock Toaster and toast
jest.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Mock Toaster</div>,
}));

describe('Home Page', () => {
  it('should render the page title', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByText('Ordens de Serviço')).toBeInTheDocument();
  });

  it('should render the search input', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByPlaceholderText('Buscar por equipamento, código ou motivo...')).toBeInTheDocument();
  });

  it('should render the type filter buttons', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByText('Preventiva')).toBeInTheDocument();
    expect(screen.getByText('Corretiva')).toBeInTheDocument();
    expect(screen.getByText('Planejada')).toBeInTheDocument();
  });

  it('should render the IncidentTable component', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByTestId('incident-table')).toBeInTheDocument();
  });

  it('should render the NewIncidentModal component', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Home />
      </MockedProvider>
    );

    expect(screen.getByTestId('new-incident-modal')).toBeInTheDocument();
  });
});
