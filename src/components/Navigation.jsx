import Tabs, { Tab } from 'material-ui/Tabs';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';

const styleSheet = createStyleSheet('Home', theme => ({
  root: {
    width: '400px',
    margin: '30px auto',
  },
  appBar: {
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.getContrastText(theme.palette.primary[500]),
  },
}));

class Navigation extends React.Component {

  handleTabChange = (_, index) => {
    this.props.selectedPage = index;
  }

  render() {
    const classes = this.props.classes;

    return (
      <Paper className={classes.root}>
        <div className={classes.appBar}>
          <Tabs
            index={this.props.selectedPage}
            onChange={(_, index) => this.props.handlePageSelect(index)}
            fullWidth
          >
            <Tab label="Marks" />
            <Tab label="Timetable" />
            <Tab label="Resources" />
          </Tabs>
        </div>
      </Paper>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedPage: PropTypes.number.isRequired,
  handlePageSelect: PropTypes.func.isRequired
};

export default withStyles(styleSheet)(Navigation);
