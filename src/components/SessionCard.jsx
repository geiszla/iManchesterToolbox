import Card, { CardContent } from 'material-ui/Card';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import React from 'react';
import Typography from 'material-ui/Typography';
import { gql } from 'react-apollo';

const styleSheet = createStyleSheet('SessionCard', {
  card: {
    display: 'flex',
    margin: '0 10px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  marks: {
    display: 'flex',
    alignItems: 'center',
    margin: '25px',
    marginTop: '0px'
  },
  mark: {
    margin: '5px 8px',
    padding: '5px'
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

      return (<div key={sessionData.name} className={classNames}>
        {sessionData.value !== null
          ? `${sessionData.value}/${sessionData.denominator}`
          : '-'}
      </div>);
    });
    const completedPercentString = currClass.marked !== null ? ` (${currClass.marked}%)` : '';

    return (
      <div>
        <Card className={classes.card}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography type="subheading" color="secondary">
                {sessionType}{completedPercentString}
              </Typography>
            </CardContent>
            <div className={classes.marks}>
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
