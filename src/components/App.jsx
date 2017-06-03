import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { compose, gql, graphql } from 'react-apollo';

import Login from './Login.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbox from './Toolbox.jsx';

const IsLoggedInQuery = gql`
  query IsLoggedInQuery {
    isLoggedIn
  }
`;

const LoginUserMutation = gql`
  mutation LoginUserMutation {
    loginUser
  }
`;

const LogoutUserMutation = gql`
  mutation LogoutUserMutation {
    logoutUser
  }
`;

class App extends React.Component {
  componentDidMount = () => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleLogin = () => {
    this.props.loginMutate();
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

const loginMutationOptions = {
  refetchQueries: ['IsLoggedInQuery']
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
