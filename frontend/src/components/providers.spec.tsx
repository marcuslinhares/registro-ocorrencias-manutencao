import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Providers } from './providers';

jest.mock('@apollo/client', () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-provider">{children}</div>
  ),
}));

jest.mock('@/lib/apollo-client', () => ({
  client: {},
}));

describe('Providers', () => {
  it('should render children inside ApolloProvider', () => {
    const { getByTestId, getByText } = render(
      <Providers>
        <span>Test Child</span>
      </Providers>,
    );

    expect(getByTestId('apollo-provider')).toBeInTheDocument();
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
