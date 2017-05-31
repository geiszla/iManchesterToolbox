import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { blue, pink, white } from 'material-ui/styles/colors';

import Login from './Login.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbox from './Toolbox.jsx';
import createPalette from 'material-ui/styles/palette';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

// import propType from 'graphql-anywhere';

const theme = createMuiTheme({
  palette: createPalette({
    primary: blue,
    accent: {
      ...pink,
      A200: white
    }
  })
});

const IsLoggedInQuery = gql`
  query IsLoggedInQuery {
    isLoggedIn
  }`;

function App(props) {
  // Redirection
  const isLoggedIn = props.data.isLoggedIn;
  const pathname = props.location.pathname;

  if (!isLoggedIn && pathname !== '/login') {
    return <Redirect to="/login" />;
  }

  if (isLoggedIn === true && pathname === '/login') {
    return <Redirect to="/marks" />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/" component={Toolbox} />
      </Switch>
    </MuiThemeProvider>
  );
}

App.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    isLoggedIn: PropTypes.bool
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default graphql(IsLoggedInQuery)(withRouter(App));
