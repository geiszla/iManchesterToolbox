import { createStyleSheet, withStyles } from 'material-ui/styles';

import React from 'react';
import SessionCard from './SessionCard.jsx';
import { filter } from 'graphql-anywhere';
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
    marginBottom: '10px'
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

class Subject extends React.Component {
  render() {
    const subject = this.props.subject;
    const sessionCards = subject.classes.filter(classData => !classData.isFinal).map(classData => (
      <SessionCard
        key={classData._id}
        class={filter(SessionCard.fragments.class, classData)}
      />
    ));

    const classes = this.props.classes;

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

export default withStyles(styleSheet)(Subject);
