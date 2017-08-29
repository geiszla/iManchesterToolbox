import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { PropTypes, observer } from 'mobx-react';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import ReactPropTypes from 'prop-types';
import { observable } from 'mobx';

const styleSheet = createStyleSheet('SingleSelect', {
  root: {
    padding: 0,
    fontWeight: 500,
    textTransform: 'uppercase'
  }
});

@observer
class SingleSelect extends React.Component {
  @observable anchorEl = undefined;
  @observable open = false;

  handleClickListItem = (event) => {
    this.open = true;
    this.anchorEl = event.currentTarget;
  };

  handleMenuItemClick = () => {
    this.open = false;
  };

  handleRequestClose = () => {
    this.open = false;
  };

  render() {
    const classes = this.props.classes;
    const options = this.props.options;
    const selectedIndex = this.props.selected;

    return (
      <div>
        <List>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="Select year"
            onClick={this.handleClickListItem}
          >
            <ListItemText
              className={classes.root}
              primary={options[selectedIndex]}
              disableTypography
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={this.anchorEl}
          open={this.open}
          onRequestClose={this.handleRequestClose}
        >
          {options.map((option, index) =>
            (<MenuItem
              key={option}
              selected={index === selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index)}
            >
              {option}
            </MenuItem>)
          )}
        </Menu>
      </div>
    );
  }
}

SingleSelect.propTypes = {
  classes: ReactPropTypes.shape({
    root: ReactPropTypes.string.isRequired
  }).isRequired,
  options: PropTypes.observableArrayOf(ReactPropTypes.string).isRequired,
  selected: ReactPropTypes.number.isRequired
};

export default withStyles(styleSheet)(SingleSelect);
