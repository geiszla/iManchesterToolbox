import { PropTypes, observer } from 'mobx-react';

import AppBar from 'material-ui/AppBar';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import FilterListIcon from 'material-ui-icons/FilterList';
import { FormControlLabel } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import ReactPropTypes from 'prop-types';
import Select from './Select.jsx';
import SingleSelect from './SingleSelect.jsx';
import Switch from 'material-ui/Switch';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { grey } from 'material-ui/colors';
import { observable } from 'mobx';
import { withStyles } from 'material-ui/styles';

const styles = {
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
  },
  label: {
    color: 'white',
    fontSize: '15px'
  }
};

@observer
class Filter extends React.Component {
  // static sessionTypes = ['Laboratory', 'Examples class', 'Test', 'Exam'];
  // static weightings = ['10', '20', '30'];

  componentDidMount = () => {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  @observable isMobile = true;

  updateWindowWidth = () => {
    this.isMobile = window.innerWidth < 650;
  }

  handleSelect = (type, value) => {
    if (type === 'semester') {
      const selected = this.props.selectedSemesters;

      if (selected.has(value)) {
        this.props.handleSemesterChange(selected.delete(value));
      } else {
        this.props.handleSemesterChange(selected.add(value));
      }
    }
    // else if (type === 'session') {
    //   const selected = this.props.selectedSessionTypes;
    //   if (selected.has(value)) {
    //     this.props.setSessionTypes(selected.delete(value));
    //   } else {
    //     this.props.setSessionTypes(selected.add(value));
    //   }
    // } else if (type === 'weighting') {
    //   const selected = this.props.selectedWeightings;
    //   if (selected.has(value)) {
    //     this.props.setWeightings(selected.delete(value));
    //   } else {
    //     this.props.setWeightings(selected.add(value));
    //   }
    // }
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
        classes={{
          label: classes.label
        }}
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
            <Typography type="title" color="inherit">Marks</Typography>
            {!this.isMobile ? compactViewToggle : null}
          </div>
          <SingleSelect
            options={this.props.years}
            selected={this.props.selectedYear}
            onChange={selectedYear => this.props.handleYearChange(selectedYear)}
          />
          <Select
            title={selectedSemestersString}
            optionList={this.props.semesters.map(semester => `Semester ${semester}`)}
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
  classes: ReactPropTypes.shape({
    root: ReactPropTypes.string.isRequired,
    flex: ReactPropTypes.string.isRequired,
    compactRoot: ReactPropTypes.string.isRequired,
    bar: ReactPropTypes.string.isRequired,
    checked: ReactPropTypes.string.isRequired
  }).isRequired,
  compactViewChecked: ReactPropTypes.bool.isRequired,
  handleCompactViewCheck: ReactPropTypes.func.isRequired,
  years: PropTypes.observableArrayOf(ReactPropTypes.string).isRequired,
  selectedYear: ReactPropTypes.number.isRequired,
  handleYearChange: ReactPropTypes.func.isRequired,
  semesters: ImmutablePropTypes.list.isRequired,
  selectedSemesters: ImmutablePropTypes.set.isRequired,
  handleSemesterChange: ReactPropTypes.func.isRequired
};

export default withStyles(styles)(Filter);
