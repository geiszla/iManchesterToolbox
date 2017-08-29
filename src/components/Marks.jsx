import { createStyleSheet, withStyles } from 'material-ui/styles';
import { filter, propType } from 'graphql-anywhere';
import { gql, graphql } from 'react-apollo';

import Filter from './Filter.jsx';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import Subject from './Subject.jsx';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const styleSheet = createStyleSheet('Marks', {
  subjectsContainer: {
    margin: '0 5px'
  },
  compactSubjectsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '@media (max-width: 730px)': {
      display: 'block'
    }
  }
});

@observer
class Marks extends React.Component {
  constructor(props) {
    super();
    this.getYearsAndSemesters(props);
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.data.loading) this.getYearsAndSemesters(nextProps);
  }

  getYearsAndSemesters = (props) => {
    if (!props.data.loading) {
      this.years = props.data.getMarks.years.map(year =>
        `20${year.schoolYear[0]}/${year.schoolYear[1]}`
      );

      const semesters = new Set();
      props.data.getMarks.years[this.selectedYear].subjects.forEach((subject) => {
        subject.classes.forEach((currClass) => {
          if (currClass.semester !== null) this.semesters = semesters.add(currClass.semester);
        });
      });

      this.semesters = Immutable.List(semesters);
      this.selectedSemesters = Immutable.Set([semesters.size - 1]);
    }
  }

  @observable years = [];
  @observable selectedYear = 0;
  @observable semesters = Immutable.List();
  @observable selectedSemesters = Immutable.Set();

  // @observable selectedWeightings = Immutable.Set(Filter.weightings.map((_, index) => index));

  handleYearChange = (selectedYear) => {
    this.selectedYear = selectedYear;
  }

  handleSemesterChange = (semesters) => {
    this.selectedSemesters = semesters;
  }

  // handleSessionSet = (sessionTypes) => {
  //   this.selectedSessionTypes = sessionTypes;
  // }

  // handleWeightingSet = (weightings) => {
  //   this.selectedWeightings = weightings;
  // }

  render() {
    if (this.props.data.loading) return (<div />);

    const compactViewChecked = this.props.compactViewChecked;

    // Apply compact view if appropriate
    const classes = this.props.classes;
    let subjectsContainerClass = classes.subjectsContainer;
    if (compactViewChecked) subjectsContainerClass += ` ${classes.compactSubjectsContainer}`;

    const subjects = this.props.data.getMarks.years[this.selectedYear].subjects;
    return (
      <div>
        <Filter
          compactViewChecked={compactViewChecked}
          handleCompactViewCheck={() => this.props.handleCompactViewCheck()}

          years={this.years}
          selectedYear={this.selectedYear}
          handleYearChange={selectedYear => this.handleYearChange(selectedYear)}

          semesters={this.semesters}
          selectedSemesters={this.selectedSemesters}
          handleSemesterChange={selected => this.handleSemesterChange(selected)}

          // selectedSessionTypes={this.selectedSessionTypes}
          // selectedWeightings={this.selectedWeightings}
          // setSessionTypes={selected => this.handleSessionSet(selected)}
          // setWeightings={selected => this.handleWeightingSet(selected)}
        />
        <div className={subjectsContainerClass}>
          {subjects.map(subjectData => (
            <Subject
              key={subjectData._id}
              subject={filter(Subject.fragments.subject, subjectData)}
              selectedSemesters={this.selectedSemesters
                .map(semesterNumber => this.semesters.get(semesterNumber))}
              compactViewChecked={compactViewChecked}
            />
          ))}
        </div>
      </div>
    );
  }
}

export const MarksQuery = gql`
  query Marks {
    getMarks {
      years {
        number
        schoolYear
        subjects {
          ...SubjectPageSubject
        }
      }
    }
  }
  ${Subject.fragments.subject}
`;

Marks.propTypes = {
  classes: PropTypes.shape({
    subjectsContainer: PropTypes.string.isRequired,
    compactSubjectsContainer: PropTypes.string.isRequired
  }).isRequired,
  compactViewChecked: PropTypes.bool.isRequired,
  handleCompactViewCheck: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    getMarks(props) {
      if (!props.loading) {
        return propType(MarksQuery)(props.getMarks);
      }
    }
  }).isRequired
};

export default graphql(MarksQuery)(withStyles(styleSheet)(Marks));

