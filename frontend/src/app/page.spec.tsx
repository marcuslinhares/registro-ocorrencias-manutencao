import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

jest.mock('@/components/incidents/IncidentTable', () => ({
  IncidentTable: () => <div data-testid="incident-table">Mock Table</div>,
}));

describe('Home Page', () => {
  it('should render the page title', () => {
    render(<Home />);

    expect(screen.getByText('Registro de Ocorrências')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<Home />);

    expect(screen.getByText('Gerencie e monitore as manutenções industriais.')).toBeInTheDocument();
  });

  it('should render the section heading', () => {
    render(<Home />);

    expect(screen.getByText('Últimas Ocorrências')).toBeInTheDocument();
  });

  it('should render the IncidentTable component', () => {
    render(<Home />);

    expect(screen.getByTestId('incident-table')).toBeInTheDocument();
  });
});
