import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { blue, pink, white } from 'material-ui/styles/colors';

import Marks from './Marks.jsx';
import Navigation from './Navigation.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Resources from './Resources.jsx';
import Timetable from './Timetable.jsx';
import createPalette from 'material-ui/styles/palette';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

// import gql from 'graphql-tag';
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

@observer
class App extends React.Component {
  static pages = ['/marks', '/timetable', '/resources'];

  @observable selectedPage = -1;

  handlePageSelect = (index) => {
    const previousPage = this.selectedPage;
    this.selectedPage = index;

    if (previousPage !== this.selectedPage) {
      this.props.history.push(App.pages[this.selectedPage]);
    }
  }

  // static propTypes = {
  //   data: PropTypes.shape({
  //     loading: PropTypes.bool,
  //     error: PropTypes.object,
  //     viewerData: PropTypes.object,
  //   }).isRequired
  // }

  // static fragments = {
  //   user: gql`
  //     fragment HomeUser on User {
  //       username, email
  //     }
  //   `
  // }

  render() {
    // let buttonLabel = '';
    // if (this.props.data.loading) {
    //   buttonLabel = 'Loading...';
    // } else if (this.props.data.error) {
    //   buttonLabel = 'An error has occurred';
    // } else {
    //   buttonLabel = this.props.data.viewerData.username;
    // }

    const pathname = this.props.location.pathname;
    if (pathname === '/' || !App.pages.includes(pathname)) {
      return <Redirect to="/marks" />;
    }

    const pageNumber = App.pages.indexOf(this.props.location.pathname);
    const currPage = pageNumber !== -1 ? pageNumber : 0;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Navigation selectedPage={currPage} handlePageSelect={this.handlePageSelect} />

          <Switch>
            <Route path="/marks" component={Marks} />
            <Route path="/timetable" component={Timetable} />
            <Route path="/resources" component={Resources} />
            <Route path="/" component={Marks} />
          </Switch>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(App);
