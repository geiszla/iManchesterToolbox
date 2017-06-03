import { ApolloProvider } from 'react-apollo';
import App from './components/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui/styles';
import React from 'react';
import apolloClient from './apollo_client.js';
import { render } from 'react-dom';
import theme from './theme.js';

const client = apolloClient(false);

window.addEventListener('load', () => {
  client.initialState = window.__APOLLO_STATE__;
  render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
  );
});
