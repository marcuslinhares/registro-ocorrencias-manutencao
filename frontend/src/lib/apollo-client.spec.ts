import { client } from './apollo-client';
import { ApolloClient } from '@apollo/client';

describe('Apollo Client', () => {
  it('should be an instance of ApolloClient', () => {
    expect(client).toBeInstanceOf(ApolloClient);
  });

  it('should have an InMemoryCache', () => {
    expect(client.cache).toBeDefined();
  });

  it('should have a link configured', () => {
    expect(client.link).toBeDefined();
  });
});
