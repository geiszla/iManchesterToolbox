import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import DocumentTitle from 'react-document-title';
import Marks from './Marks.jsx';
import Navigation from './Navigation.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import Resources from './Resources.jsx';
import StatusCard from './StatusCard.jsx';
import Timetable from './Timetable.jsx';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = {
  root: {
    minWidth: '430px'
  },
  container: {
    maxWidth: '1500px',
    margin: '25px auto',
    padding: '0 25px',
    '@media (max-width: 500px)': {
      margin: '20px 5px 0 5px',
      padding: 0
    },
    '@media (min-width: 1300px)': {
      maxWidth: '1800px'
    }
  },
  statusCards: {
    display: 'flex',
    '@media (max-width: 500px)': {
      flexDirection: 'column'
    }
  }
};

@observer
class Toolbox extends React.Component {
  static pages = ['/marks', '/timetable', '/resources'];
  static pageNames = ['Marks', 'Timetable', 'Resources'];

  @observable compactViewChecked = false;

  selectedPage = -1;

  handlePageSelect = (index) => {
    if (this.selectedPage !== index) {
      this.props.history.push(Toolbox.pages[index]);
    }
  }

  handleCompactViewCheck = () => {
    this.compactViewChecked = !this.compactViewChecked;
  }

  render() {
    // If page not found redirect to "/marks"
    const pathname = this.props.location.pathname;
    if (pathname === '/' || !Toolbox.pages.includes(pathname)) {
      return <Redirect to="/marks" />;
    }

    // Set selected navigation tab according to the current page
    const pageNumber = Toolbox.pages.indexOf(this.props.location.pathname);
    this.selectedPage = pageNumber !== -1 ? pageNumber : 0;

    // Apply compact view if appropriate
    const classes = this.props.classes;
    const containerMaxWidth = this.compactViewChecked ? '1500px' : '972px';

    return (
      <DocumentTitle title={Toolbox.pageNames[this.selectedPage]}>
        <div className={classes.root}>
          <Navigation
            selectedPage={this.selectedPage}
            handlePageSelect={index => this.handlePageSelect(index)}
          />

          <div className={classes.container} style={{ maxWidth: containerMaxWidth }}>
            <div className={classes.statusCards}>
              <StatusCard />
              <StatusCard />
              <StatusCard />
            </div>

            <Switch>
              <Route
                path="/marks"
                render={props => (
                  <Marks
                    compactViewChecked={this.compactViewChecked}
                    handleCompactViewCheck={() => this.handleCompactViewCheck()}
                    {...props}
                  />
                )}
              />

              <Route path="/timetable" component={Timetable} />
              <Route epath="/resources" component={Resources} />
            </Switch>
          </div>
          <button onClick={() => this.props.handleLogout()} hidden>Login</button>
        </div>
      </DocumentTitle>
    );
  }
}

Toolbox.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    container: PropTypes.string.isRequired,
    statusCards: PropTypes.string.isRequired
  }).isRequired,
  handleLogout: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(withRouter(Toolbox));
