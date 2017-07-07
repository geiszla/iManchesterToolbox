import Card, { CardContent } from 'material-ui/Card';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import React from 'react';
import Typography from 'material-ui/Typography';
import { gql } from 'react-apollo';

const styleSheet = createStyleSheet('SessionCard', {
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
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
    backgroundColor: 'red',
    color: 'white'
  }
});

class SessionCard extends React.Component {
  render() {
    const currClass = this.props.class;
    const classes = this.props.classes;
    const sessionType = currClass.type !== null ? currClass.type : currClass._id;

    const marks = currClass.sessions.map((sessionData) => {
      let classNames = classes.mark;
      if (sessionData.isExpected) classNames += ` ${classes.expected}`;
      if (sessionData.isLate) classNames += ` ${classes.late}`;

      return (
        <div key={sessionData.name} className={classes.session}>
          <div className={classes.sessionTitle}>
            {sessionData.name}
          </div>
          <div className={classes.sessionBody}>
            <span className={classNames}>
              {sessionData.value !== null
              ? `${sessionData.value}/${sessionData.denominator}`
              : '-'}
            </span>
          </div>
        </div>
      );
    });
    const completedPercentString = currClass.marked !== null ? ` (${currClass.marked}%)` : '';

    return (
      <div>
        <Card>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography type="subheading" color="secondary">
                {sessionType}{completedPercentString}
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
