import ApolloClient, { createNetworkInterface } from 'apollo-client';

export default (ssrMode, headers) => {
  const opts = {
    credentials: 'same-origin'
  };
  if (headers) opts.headers = headers;

  return new ApolloClient({
    ssrMode,
    networkInterface: createNetworkInterface({
      uri: API_URL,
      opts
    })
  });
};
