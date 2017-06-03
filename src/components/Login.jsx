import Card, { CardActions, CardContent } from 'material-ui/Card';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import Button from 'material-ui/Button';
import DocumentTitle from 'react-document-title';
import Input from 'material-ui/Input/Input';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router-dom';

const styleSheet = createStyleSheet('SimpleMediaCard', {
  card: {
    maxWidth: 345,
    margin: 'auto',
    marginTop: 250
  },
  input: {
    margin: '20px 0 0 35px'
  },
  cardActions: {
    float: 'right'
  }
});

class Login extends React.Component {
  render() {
    const classes = this.props.classes;

    return (
      <DocumentTitle title={'iManchester Toolbox'}>
        <Card className={classes.card}>
          <CardContent>
            <Typography type="headline" component="h2">
              Login
            </Typography>
            <Input placeholder="Username" className={classes.input} />
            <Input placeholder="Password" className={classes.input} />
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button primary onClick={() => this.props.handleLogin()}>Login</Button>
          </CardActions>
        </Card>
      </DocumentTitle>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    cardActions: PropTypes.string.isRequired
  }).isRequired,
  handleLogin: PropTypes.func.isRequired
};

export default withRouter(withStyles(styleSheet)(Login));