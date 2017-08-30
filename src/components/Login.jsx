import Card, { CardActions, CardContent } from 'material-ui/Card';
import { compose, gql, graphql } from 'react-apollo';

import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { red } from 'material-ui/colors';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  error: {
    position: 'relative',
    top: '20%',
    textAlign: 'center',
    color: red[500]
  },
  card: {
    maxWidth: 345,
    margin: 'auto',
    position: 'relative',
    top: '30%'
  },
  input: {
    margin: '15px 0 0 35px'
  },
  cardActions: {
    marginLeft: '230px'
  },
  loadingContainer: {
    textAlign: 'center',
    position: 'relative',
    top: '30%'
  },
  progress: {
    marginBottom: `${theme.spacing.unit * 6}px`
  }
});

// background-image: url(https://www.pcb.com.au/includes/public/assets/images/backgrounds/shapes-mediumblue.svg);
// background-repeat: no-repeat;
// background-size: cover;
// background-position: 0, 20px;

function Login(props) {
  const classes = props.classes;
  const data = props.data;

  if (data.loading) {
    return <div />;
  } else if (data.getFetchStatus > 0) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress
          size={100}
          className={classes.progress}
          value={data.getFetchStatus}
        />
        <Typography type="headline" component="h2" >
          Fetching marks ({data.getFetchStatus}%)
        </Typography>
        <Typography type="body1" component="h2" >
          Please refresh this page in a few minutes.
        </Typography>
      </div>
    );
  }

  const error = (
    <Typography
      type="headline"
      component="h2"
      className={classes.error}
    >
      Fetching marks failed. Try again.
    </Typography>
  );

  return (
    <DocumentTitle title={'iManchester Toolbox'}>
      <div style={{ height: '100%' }}>
        {data.getFetchStatus < 0 ? error : null}
        <Card className={classes.card}>
          <CardContent>
            <Typography type="headline" component="h2" >
                  Login
            </Typography>
            <TextField
              id="username"
              label="Username"
              autoComplete="username"
              className={classes.input}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              className={classes.input}
            />
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button onClick={() => props.handleLogin()}>Login</Button>
          </CardActions>
        </Card>
      </div>
    </DocumentTitle>
  );
}

export const FetchStatusQuery = gql`
  query FetchStatusQuery {
    getFetchStatus
  }
`;

Login.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    input: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired
  }).isRequired,
  handleLogin: PropTypes.func.isRequired
};

export default compose(
  graphql(FetchStatusQuery),
  withStyles(styles),
  withRouter
)(Login);
