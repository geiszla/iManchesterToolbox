import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/routes.jsx';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://localhost/api'
  }),
});

window.addEventListener('load', () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  );
});
