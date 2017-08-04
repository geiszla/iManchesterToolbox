import { createStyleSheet, withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FilterListIcon from 'material-ui-icons/FilterList';
import { FormControlLabel } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import Select from './Select.jsx';
import SingleSelect from './SingleSelect.jsx';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { grey } from 'material-ui/colors';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const styleSheet = createStyleSheet('Filter', {
  root: {
    marginTop: '30px'
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '10px',
    flex: 1
  },
  compactRoot: {
    marginLeft: '25px',
    marginTop: '5px'
  },
  bar: {},
  checked: {
    color: grey[50],
    '& + $bar': {
      backgroundColor: grey[50]
    }
  }
});

@observer
class Filter extends React.Component {
  static sessionTypes = ['Laboratory', 'Examples class', 'Test', 'Exam'];
  static weightings = ['10', '20', '30'];
  static semesters = ['Semester 1', 'Semester 2'];

  componentDidMount = () => {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  @observable isMobile = true;

  updateWindowWidth = () => {
    this.isMobile = window.innerWidth < 850;
  }

  handleSelect = (type, value) => {
    if (type === 'semester') {
      const selected = this.props.selectedSemesters;
      if (selected.has(value)) {
        this.props.setSemesters(selected.delete(value));
      } else {
        this.props.setSemesters(selected.add(value));
      }
    } else if (type === 'session') {
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

    // Prepare compact view toggle
    const compactViewToggle = (
      <FormControlLabel
        className={classes.compactRoot}
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
    );

    // Prepare selected semester label
    const selectedSemesters = this.props.selectedSemesters;
    const selectedSemestersString = selectedSemesters.size
      ? `Semester ${selectedSemesters.map(index => index + 1).sort().join(', ')}`
      : 'Select semester';

    return (
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <FilterListIcon />
          <div className={classes.flex}>
            <Typography type="title" color="inherit" >Marks</Typography>
            {!this.isMobile ? compactViewToggle : null}
          </div>
          <SingleSelect />
          <Select
            title={selectedSemestersString}
            optionList={Filter.semesters}
            selected={this.props.selectedSemesters}
            handleSelect={value => this.handleSelect('semester', value)}
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
    root: PropTypes.string.isRequired,
    flex: PropTypes.string.isRequired,
    compactRoot: PropTypes.string.isRequired,
    bar: PropTypes.string.isRequired,
    checked: PropTypes.string.isRequired
  }).isRequired,
  compactViewChecked: PropTypes.bool.isRequired,
  handleCompactViewCheck: PropTypes.func.isRequired,
  selectedSemesters: ImmutablePropTypes.set.isRequired,
  selectedSessionTypes: ImmutablePropTypes.set.isRequired,
  selectedWeightings: ImmutablePropTypes.set.isRequired,
  setSemesters: PropTypes.func.isRequired,
  setSessionTypes: PropTypes.func.isRequired,
  setWeightings: PropTypes.func.isRequired
};

export default withStyles(styleSheet)(Filter);
