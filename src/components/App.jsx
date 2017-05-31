import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { blue, pink, white } from 'material-ui/styles/colors';

import DocumentTitle from 'react-document-title';
import Marks from './Marks.jsx';
import Navigation from './Navigation.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Resources from './Resources.jsx';
import Timetable from './Timetable.jsx';
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

class App extends React.Component {
  static pages = ['/marks', '/timetable', '/resources'];
  static pageNames = ['Marks', 'Timetable', 'Resources'];

  selectedPage = -1;

  handlePageSelect = (index) => {
    if (this.selectedPage !== index) {
      this.props.history.push(App.pages[index]);
    }
  }

  render() {
    // Check if current page exists and redirect if not
    const pathname = this.props.location.pathname;
    if (pathname === '/' || !App.pages.includes(pathname)) {
      return <Redirect to="/marks" />;
    }

    // Set selected navigation tab according to the current page
    const pageNumber = App.pages.indexOf(this.props.location.pathname);
    this.selectedPage = pageNumber !== -1 ? pageNumber : 0;

    return (
      <MuiThemeProvider theme={theme}>
        <DocumentTitle title={`${App.pageNames[this.selectedPage]} | iManchester Toolbox`}>
          <div>
            <Navigation selectedPage={this.selectedPage} handlePageSelect={this.handlePageSelect} />

            <Switch>
              <Route path="/marks" component={Marks} />
              <Route path="/timetable" component={Timetable} />
              <Route epath="/resources" component={Resources} />
            </Switch>
          </div>
        </DocumentTitle>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    isLoggedIn: PropTypes.bool
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default graphql(IsLoggedInQuery)(withRouter(App));
