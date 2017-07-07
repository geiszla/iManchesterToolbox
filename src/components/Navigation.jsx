import Tabs, { Tab } from 'material-ui/Tabs';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('Navigation', theme => ({
  flex: {
    flex: 1
  },
  appBar: {
    backgroundColor: theme.palette.primary[500],
    color: theme.palette.getContrastText(theme.palette.primary[500])
  }
}));

class Navigation extends React.Component {
  handleTabChange = (_, index) => {
    this.props.selectedPage = index;
  }

  render() {
    const classes = this.props.classes;

    return (
      <Paper className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              iManchester Toolbox
            </Typography>
            <Tabs
              index={this.props.selectedPage}
              onChange={(_, index) => this.props.handlePageSelect(index)}
              indicatorColor="primary"
              centered
            >
              <Tab label="Marks" />
              <Tab label="Timetable" />
              <Tab label="Resources" />
            </Tabs>
          </Toolbar>
        </AppBar>
      </Paper>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired
  }).isRequired,
  handlePageSelect: PropTypes.func.isRequired,
  selectedPage: PropTypes.number.isRequired
};

export default withStyles(styleSheet)(Navigation);
