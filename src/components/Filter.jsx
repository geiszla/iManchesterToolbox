import { createStyleSheet, withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FilterListIcon from 'material-ui-icons/FilterList';
import IconButton from 'material-ui/IconButton';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import Select from './Select.jsx';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { observer } from 'mobx-react';

const styleSheet = createStyleSheet('Filter', {
  root: {
    marginTop: '50px'
  },
  flex: {
    marginLeft: '10px',
    flex: 1
  }
});

@observer
class Filter extends React.Component {
  static sessionTypes = ['Laboratory', 'Examples class', 'Test', 'Exam'];
  static weightings = ['10', '20', '30'];

  handleToggle = (event, value) => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  handleSelect = (type, value) => {
    if (type === 'session') {
      const selected = this.props.selectedSessionTypes;
      if (selected.has(value)) {
        this.props.setSessionTypes(selected.delete(value));
      } else {
        this.props.setSessionTypes(selected.add(value));
      }
    } else if (type === 'weighting') {
      const selected = this.props.selectedWeightings;
      if (selected.has(value)) {
        this.props.setWeightings(selected.delete(value));
      } else {
        this.props.setWeightings(selected.add(value));
      }
    }
  }

  render() {
    const classes = this.props.classes;

    return (
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <FilterListIcon />
          <Typography type="title" color="inherit" className={classes.flex}>Filter</Typography>
          <Select
            title={`Session types (${this.props.selectedSessionTypes.size})`}
            optionList={Filter.sessionTypes}
            selected={this.props.selectedSessionTypes}
            handleSelect={value => this.handleSelect('session', value)}
          />
          <Select
            title={`Weightings (${this.props.selectedWeightings.size})`}
            optionList={Filter.weightings}
            selected={this.props.selectedWeightings}
            handleSelect={value => this.handleSelect('weighting', value)}
          />
          <IconButton color="contrast">
            <ExpandMoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

Filter.propTypes = {
  classes: PropTypes.shape({
    flex: PropTypes.string.isRequired
  }).isRequired,
  selectedSessionTypes: ImmutablePropTypes.set.isRequired,
  selectedWeightings: ImmutablePropTypes.set.isRequired,
  setSessionTypes: PropTypes.func.isRequired,
  setWeightings: PropTypes.func.isRequired
};

export default withStyles(styleSheet)(Filter);
