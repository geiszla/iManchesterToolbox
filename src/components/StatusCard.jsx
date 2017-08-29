import Card, { CardContent } from 'material-ui/Card';

import PropTypes from 'prop-types';
import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = {
  card: {
    display: 'flex',
    flexGrow: 1,
    height: '165px',
    margin: '5px',
    marginBottom: '25px',
    '@media (max-width: 500px)': {
      marginBottom: '10px'
    }
  },
  content: {
    flex: '1 0 auto'
  }
};

function StatusCard(props) {
  const classes = props.classes;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography type="subheading" color="secondary">
          Status Card
        </Typography>
      </CardContent>
    </Card>
  );
}

StatusCard.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styles)(StatusCard);
