import { createStyleSheet, withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FilterListIcon from 'material-ui-icons/FilterList';
import { FormControlLabel } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
// import Select from './Select.jsx';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { grey } from 'material-ui/colors';

const styleSheet = createStyleSheet('Filter', {
  root: {
    marginTop: '30px'
  },
  flex: {
    marginLeft: '10px',
    flex: 1
  },
  bar: {},
  checked: {
    color: grey[50],
    '& + $bar': {
      backgroundColor: grey[50]
    }
  }
});

class Filter extends React.Component {
  static sessionTypes = ['Laboratory', 'Examples class', 'Test', 'Exam'];
  static weightings = ['10', '20', '30'];

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
          <FormControlLabel
            control={
              <Switch
                classes={{
                  checked: classes.checked,
                  bar: classes.bar
                }}
                checked={this.props.compactViewChecked}
                onChange={() => this.props.handleCompactViewCheck()}
                aria-label="compactViewChecked"
              />
            }
            label="Compact View"
          />
          <IconButton color="contrast">
            <ExpandMoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

// <Select
//   title={`Weightings (${this.props.selectedWeightings.size})`}
//   optionList={Filter.weightings}
//   selected={this.props.selectedWeightings}
//   handleSelect={value => this.handleSelect('weighting', value)}
// />

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
