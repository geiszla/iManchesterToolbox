import Card, { CardContent } from 'material-ui/Card';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import React from 'react';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('StatusCard', {
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
});

class StatusCard extends React.Component {
  render() {
    const classes = this.props.classes;

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
}

export default withStyles(styleSheet)(StatusCard);
