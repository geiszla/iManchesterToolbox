import Filter from './Filter.jsx';
import Immutable from 'immutable';
import React from 'react';
import Subject from './Subject.jsx';
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
    return (
      <div>
        <Filter
          selectedSessionTypes={this.selectedSessionTypes}
          selectedWeightings={this.selectedWeightings}
          setSessionTypes={selected => this.handleSessionSet(selected)}
          setWeightings={selected => this.handleWeightingSet(selected)}
        />
        <Subject />
      </div>
    );
  }
}

export default Marks;
