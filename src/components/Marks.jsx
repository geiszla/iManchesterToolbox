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
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    '@media (max-width: 800px)': {
      display: 'block'
    }
  }
});

@observer
class Marks extends React.Component {
  @observable selectedSessionTypes = Immutable.Set(Filter.sessionTypes.map((_, index) => index));
  @observable selectedWeightings = Immutable.Set(Filter.weightings.map((_, index) => index));

  handleSessionSet = (sessionTypes) => {
    this.selectedSessionTypes = sessionTypes;
  }

  handleWeightingSet = (weightings) => {
    this.selectedWeightings = weightings;
  }

  render() {
    if (this.props.data.loading) return (<div />);

    const subjects = this.props.data.getMarks.subjects;
    const subjectElements = subjects.map(subjectData => (
      <Subject
        key={subjectData._id}
        subject={filter(Subject.fragments.subject, subjectData)}
      />
    ));

    return (
      <div>
        <Filter
          selectedSessionTypes={this.selectedSessionTypes}
          selectedWeightings={this.selectedWeightings}
          setSessionTypes={selected => this.handleSessionSet(selected)}
          setWeightings={selected => this.handleWeightingSet(selected)}
        />
        <div className={this.props.classes.subjectsContainer}>
          {subjectElements}
        </div>
      </div>
    );
  }
}

export const MarksQuery = gql`
  query Marks {
    getMarks {
      number
      schoolYear
      subjects {
        ...SubjectPageSubject
      }
    }
  }
  ${Subject.fragments.subject}
`;

Marks.propTypes = {
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

