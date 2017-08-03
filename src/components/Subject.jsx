import { createStyleSheet, withStyles } from 'material-ui/styles';
import { filter, propType } from 'graphql-anywhere';

import Card from 'material-ui/Card';
import PropTypes from 'prop-types';
import React from 'react';
import SessionCard from './SessionCard.jsx';
import { gql } from 'react-apollo';

const styleSheet = createStyleSheet('Subject', {
  subjectContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '15px 0',
    minWidth: '30vw',
    maxWidth: '49%',
    flexGrow: 1,
    '@media (max-width: 500px)': {
      marginTop: '10px',
      marginBottom: 0
    },
    '@media (max-width: 850px)': {
      maxWidth: 'none'
    },
    '@media (min-width: 1500px)': {
      maxWidth: '32%'
    }
  },
  titleContainer: {
    marginBottom: '10px',
    marginLeft: '2px',
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
    overflow: 'auto',
    padding: '2px'
  },
  flex: {
    flex: 1
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

  sessionCards.push(
    <Card className={classes.flex} key="blank" />
  );

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
