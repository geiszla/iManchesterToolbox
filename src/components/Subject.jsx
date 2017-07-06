import { createStyleSheet, withStyles } from 'material-ui/styles';

import React from 'react';
import SessionCard from './SessionCard.jsx';
import { filter } from 'graphql-anywhere';
import { gql } from 'react-apollo';

const styleSheet = createStyleSheet('Subject', {
  subjectContainer: {
    display: 'flex',
    margin: '35px 25px'
  },
  titleContainer: {
    width: '25%'
  },
  title: {
    marginBottom: '10px'
  },
  subtitle: {
    margin: 0,
    fontSize: '13px',
    color: 'rgb(97, 97, 97)'
  },
  sessionContainer: {
    display: 'flex',
    overflow: 'auto',
    width: '75%',
    height: '100%',
    padding: '2px'
  }
});

class Subject extends React.Component {
  render() {
    const subject = this.props.subject;
    const sessionCards = subject.classes.map(classData => (
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
          <p className={classes.title}>{subject.name}</p>
          <p className={classes.subtitle}>COMP{subject._id}</p>
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
