import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import Marks from './Marks.jsx';
import Navigation from './Navigation.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Resources from './Resources.jsx';
import Timetable from './Timetable.jsx';

class Toolbox extends React.Component {
  static pages = ['/marks', '/timetable', '/resources'];
  static pageNames = ['Marks', 'Timetable', 'Resources'];

  selectedPage = -1;

  handlePageSelect = (index) => {
    if (this.selectedPage !== index) {
      this.props.history.push(Toolbox.pages[index]);
    }
  }

  render() {
    const pathname = this.props.location.pathname;
    if (pathname === '/' || !Toolbox.pages.includes(pathname)) {
      return <Redirect to="/marks" />;
    }

    // Set selected navigation tab according to the current page
    const pageNumber = Toolbox.pages.indexOf(this.props.location.pathname);
    this.selectedPage = pageNumber !== -1 ? pageNumber : 0;

    return (
      <div>
        <DocumentTitle title={`${Toolbox.pageNames[this.selectedPage]} | iManchester Toolbox`}>
          <div>
            <Navigation selectedPage={this.selectedPage} handlePageSelect={this.handlePageSelect} />

            <Switch>
              <Route path="/marks" component={Marks} />
              <Route path="/timetable" component={Timetable} />
              <Route epath="/resources" component={Resources} />
            </Switch>
          </div>
        </DocumentTitle>
      </div>
    );
  }
}

Toolbox.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Toolbox);
