import App from './App.jsx';
import React from 'react';
import { Route } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const ViewerQuery = gql`
  query ViewerQuery($username: String!, $email: String!, $password: String!) {
    viewerData(username: $username, email: $email, password: $password) {
      username
    }
}`;

const AppWithData = graphql(ViewerQuery, {
  options: {
    variables: {
      username: '__NAME__',
      email: '__EMAIL__',
      password: '__PASSWORD__',
    }
  }
})(App);

export default () => (
  <App />
);
