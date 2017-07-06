import { gql, graphql } from 'react-apollo';

import Filter from './Filter.jsx';
import Immutable from 'immutable';
import React from 'react';
import Subject from './Subject.jsx';
import { filter } from 'graphql-anywhere';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

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
        {subjectElements}
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

export default graphql(MarksQuery)(Marks);
