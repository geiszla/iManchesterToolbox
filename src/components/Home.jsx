import Button from 'material-ui/Button';
import { MuiThemeProvider } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import gql from 'graphql-tag';
// import propType from 'graphql-anywhere';

export default class Home extends React.Component {
  // static propTypes = {
  //   data: PropTypes.shape({
  //     loading: PropTypes.bool,
  //     error: PropTypes.object,
  //     viewerData: PropTypes.object,
  //   }).isRequired
  // }

  // static fragments = {
  //   user: gql`
  //     fragment HomeUser on User {
  //       username, email
  //     }
  //   `
  // }

  render() {
    // let buttonLabel = '';
    // if (this.props.data.loading) {
    //   buttonLabel = 'Loading...';
    // } else if (this.props.data.error) {
    //   buttonLabel = 'An error has occurred';
    // } else {
    //   buttonLabel = this.props.data.viewerData.username;
    // }

    return (
      <MuiThemeProvider>
        <Button>
          { 'Valami' }
        </Button>
      </MuiThemeProvider>
    );
  }
}
