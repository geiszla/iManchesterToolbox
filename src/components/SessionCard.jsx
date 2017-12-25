import Card, { CardContent } from 'material-ui/Card';

import PropTypes from 'prop-types';
import React from 'react';
import Typography from 'material-ui/Typography';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';
import { red } from 'material-ui/colors';
import { withStyles } from 'material-ui/styles';

const styles = {
  details: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '4px'
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
    margin: '-5px 25px 20px 35px'
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
};

function SessionCard(props) {
  const currClass = props.class;
  const classes = props.classes;

  // Prepare marks
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

    const sessionKey = sessionData.name + sessionData.weighting;

    return (
      <div key={sessionKey} className={classes.session}>
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

  // Render SessionCard with marks
  const sessionType = currClass.type !== null ? currClass.type : currClass._id;
  const completedPercentString = currClass.marked !== null ? ` (${currClass.marked}%)` : '';

  const semesterNumber = currClass.semester;
  const semesterIndicator = currClass.semester !== null ? (
    <div className={classes.semester} title={`Semester ${semesterNumber}`}>
      {`S${semesterNumber}`}
    </div>
  ) : '';

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

SessionCard.propTypes = {
  classes: PropTypes.shape({
    details: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    semester: PropTypes.string.isRequired,
    sessions: PropTypes.string.isRequired,
    session: PropTypes.string.isRequired,
    sessionTitle: PropTypes.string.isRequired,
    sessionBody: PropTypes.string.isRequired,
    mark: PropTypes.string.isRequired,
    expected: PropTypes.string.isRequired,
    late: PropTypes.string.isRequired
  }).isRequired,
  class: propType(SessionCard.fragments.class).isRequired
};

export default withStyles(styles)(SessionCard);
