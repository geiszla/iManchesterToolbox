import { filter, propType } from 'graphql-anywhere';

import Card from 'material-ui/Card';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import SessionCard from './SessionCard.jsx';
import gql from 'graphql-tag';
import { withStyles } from 'material-ui/styles';

const styles = {
  subjectContainer: {
    margin: '15px 0',
    '@media (max-width: 500px)': {
      marginTop: '10px',
      marginBottom: 0
    }
  },
  compactSubjectContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '20%',
    maxWidth: '49%',
    flexGrow: 1,
    '@media (max-width: 730px)': {
      maxWidth: 'none'
    },
    '@media (min-width: 1500px)': {
      maxWidth: '33%'
    }
  },
  titleContainer: {
    marginBottom: '10px',
    marginLeft: '5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  subtitle: {
    display: 'inline',
    marginLeft: '10px',
    fontSize: '13px',
    color: 'rgb(97, 97, 97)'
  },
  sessionContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '2px'
  },
  flex: {
    flex: 1
  }
};

function Subject(props) {
  const subject = props.subject;

  // Prepare session cards
  const sessionCards = subject.classes
    .filter(classData => !classData.isFinal
      && (classData.semester === null || props.selectedSemesters.has(classData.semester)))
    .map(classData => (
      <SessionCard
        key={classData._id}
        class={filter(SessionCard.fragments.class, classData)}
      />
    ));

  // Apply compact view if appropriate
  const compactViewChecked = props.compactViewChecked;
  const classes = props.classes;

  let subjectContainerClass = classes.subjectContainer;
  if (compactViewChecked) subjectContainerClass += ` ${classes.compactSubjectContainer}`;

  if (compactViewChecked) {
    sessionCards.push(
      <Card className={classes.flex} key="blank" />
    );
  }

  return (
    <div className={subjectContainerClass}>
      <br />
      <div className={classes.titleContainer}>
        {subject.name}
        <div className={classes.subtitle}>COMP{subject._id}</div>
      </div>
      <div className={classes.sessionContainer}>
        {sessionCards}
      </div>
    </div>
  );
}

Subject.fragments = {
  subject: gql`
    fragment SubjectPageSubject on Subject {
      _id
      name
      classes {
        ...SessionCardClass
      }
    }
    ${SessionCard.fragments.class}
  `
};

Subject.propTypes = {
  classes: PropTypes.shape({
    subjectContainer: PropTypes.string.isRequired,
    compactSubjectContainer: PropTypes.string.isRequired,
    titleContainer: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    sessionContainer: PropTypes.string.isRequired,
    flex: PropTypes.string.isRequired
  }).isRequired,
  subject: propType(Subject.fragments.subject).isRequired,
  compactViewChecked: PropTypes.bool.isRequired,
  selectedSemesters: ImmutablePropTypes.set.isRequired
};

export default withStyles(styles)(Subject);
