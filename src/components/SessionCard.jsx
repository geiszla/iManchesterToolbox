import Card, { CardContent } from 'material-ui/Card';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import React from 'react';
import Typography from 'material-ui/Typography';
import { gql } from 'react-apollo';
import { red } from 'material-ui/colors';

const styleSheet = createStyleSheet('SessionCard', {
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  semester: {
    display: 'inline',
    marginLeft: '10px',
    padding: '0 5px',
    borderRadius: '25px',
    fontSize: '13px',
    backgroundColor: 'gray',
    color: 'white'
  },
  sessions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    margin: '-5px 25px 20px 25px'
  },
  session: {
    width: '53px',
    margin: '15px 15px'
  },
  sessionTitle: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: 500
  },
  sessionBody: {
    marginLeft: '-100%',
    marginRight: '-100%',
    textAlign: 'center',
    fontSize: '16px'
  },
  mark: {
    padding: '0 5px'
  },
  expected: {
    color: 'lightgray'
  },
  late: {
    borderRadius: '25px',
    backgroundColor: red[500],
    color: 'white'
  }
});

function SessionCard(props) {
  const currClass = props.class;
  const classes = props.classes;
  const sessionType = currClass.type !== null ? currClass.type : currClass._id;
  const completedPercentString = currClass.marked !== null ? ` (${currClass.marked}%)` : '';

  const semesterNumber = currClass.semester;
  const semesterIndicator = currClass.semester !== null ? (
    <div className={classes.semester} title={`Semester ${semesterNumber}`}>
      {`S${semesterNumber}`}
    </div>
  ) : '';

  const marks = currClass.sessions.map((sessionData) => {
    const classNames = [classes.mark];
    const title = [];

    if (sessionData.isExpected) {
      classNames.push(classes.expected);
      title.push('Expected');
    }

    if (sessionData.isLate) {
      classNames.push(classes.late);
      title.push('Late');
    }

    return (
      <div key={sessionData.name} className={classes.session}>
        <div className={classes.sessionTitle}>
          {sessionData.name}
        </div>
        <div className={classes.sessionBody} title={title.join(', ')}>
          <span className={classNames.join(' ')}>
            {sessionData.value !== null
              ? `${sessionData.value}/${sessionData.denominator}`
              : '-'}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <Card>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography type="subheading" color="secondary">
              {sessionType}{completedPercentString}{semesterIndicator}
            </Typography>
          </CardContent>
          <div className={classes.sessions}>
            {marks}
          </div>
        </div>
      </Card>
    </div>
  );
}

SessionCard.fragments = {
  class: gql`
    fragment SessionCardClass on Class {
      _id
      semester
      type
      isFinal
      weight
      total
      isInProgress
      marked
      sessions {
        name
        weighting
        denominator
        value
        isEstimated
        isExpected
        isLate
      }
    }
  `
};

export default withStyles(styleSheet)(SessionCard);
