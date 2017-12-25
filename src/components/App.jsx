import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Login from './Login.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbox from './Toolbox.jsx';

class App extends React.Component {
  componentDidMount = () => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleLogin = () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    this.props.loginMutate({
      variables: { username, password }
    });
  }

  handleLogout = () => {
    this.props.logoutMutate();
  }

  render() {
    const isLoggedIn = this.props.data.isLoggedIn;
    const pathname = this.props.location.pathname;

    if (!isLoggedIn && pathname !== '/login') {
      return <Redirect to="/login" />;
    }

    if (isLoggedIn === true && pathname === '/login') {
      return <Redirect to="/marks" />;
    }

    return (
      <Switch>
        <Route
          path="/login"
          render={defaultProps => (<Login
            handleLogin={() => this.handleLogin()}
            {...defaultProps}
          />)}
        />
        <Route
          path="/"
          render={defaultProps => (<Toolbox
            handleLogout={() => this.handleLogout()}
            {...defaultProps}
          />)}
        />
        <Route path="/" component={Toolbox} />
      </Switch>
    );
  }
}

const IsLoggedInQuery = gql`
query IsLoggedInQuery {
  isLoggedIn
}
`;

const LoginUserMutation = gql`
mutation LoginUserMutation($username: String!, $password: String!) {
  loginUser(username: $username, password: $password)
}
`;

const LogoutUserMutation = gql`
mutation LogoutUserMutation {
  logoutUser
}
`;

const loginMutationOptions = {
  refetchQueries: ['IsLoggedInQuery', 'FetchStatusQuery']
};

App.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    isLoggedIn: PropTypes.bool
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  loginMutate: PropTypes.func.isRequired,
  logoutMutate: PropTypes.func.isRequired
};

export default compose(
  graphql(IsLoggedInQuery),
  graphql(LoginUserMutation, {
    name: 'loginMutate',
    options: loginMutationOptions
  }),
  graphql(LogoutUserMutation, {
    name: 'logoutMutate',
    options: loginMutationOptions
  }),
  withRouter
)(App);
