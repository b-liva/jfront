import {createProvider, onLogin, onLogout} from "./vue-apollo";
import {typeDefs, resolvers, initialState} from "./local";
import {ACCESS_TOKEN} from "./services/auth/session";
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

export const apolloProvider = createProvider({
  tokenName: ACCESS_TOKEN,
  cache,
  typeDefs,
  resolvers,
  onCacheInit: cache => {
    cache.writeData({ data: initialState })
  },
})

export const apolloClient = apolloProvider.defaultClient

export const apolloOnLogin = token => onLogin(apolloClient, token)
export const apolloOnLogout = () => onLogout(apolloClient)
