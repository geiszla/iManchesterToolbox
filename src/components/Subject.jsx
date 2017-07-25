import { createStyleSheet, withStyles } from 'material-ui/styles';
import { filter, propType } from 'graphql-anywhere';

import PropTypes from 'prop-types';
import React from 'react';
import SessionCard from './SessionCard.jsx';
import { gql } from 'react-apollo';

const styleSheet = createStyleSheet('Subject', {
  subjectContainer: {
    margin: '15px 0',
    '@media (max-width: 500px)': {
      marginTop: '10px',
      marginBottom: 0
    }
  },
  titleContainer: {
    marginBottom: '10px',
    marginLeft: '2px'
  },
  subtitle: {
    display: 'inline',
    marginLeft: '10px',
    fontSize: '13px',
    color: 'rgb(97, 97, 97)'
  },
  sessionContainer: {
    overflow: 'auto',
    height: '100%',
    padding: '2px'
  }
});

function Subject(props) {
  const subject = props.subject;
  const sessionCards = subject.classes.filter(classData => !classData.isFinal).map(classData => (
    <SessionCard
      key={classData._id}
      class={filter(SessionCard.fragments.class, classData)}
    />
  ));

  const classes = props.classes;

  return (
    <div className={classes.subjectContainer}>
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
    titleContainer: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    sessionContainer: PropTypes.string.isRequired
  }).isRequired,
  subject: propType(Subject.fragments.subject).isRequired
};

export default withStyles(styleSheet)(Subject);
