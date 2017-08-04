import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { createStyleSheet, withStyles } from 'material-ui/styles';

import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const styleSheet = createStyleSheet(theme => ({
  root: {
    padding: 0,
    fontWeight: 500
  }
}));

const options = [
  '2016',
  '2017',
  '2018'
];

@observer
class SingleSelect extends React.Component {
  @observable anchorEl = undefined;
  @observable open = false;
  @observable selectedIndex = 1;

  button = undefined;

  handleClickListItem = (event) => {
    this.open = true;
    this.anchorEl = event.currentTarget;
  };

  handleMenuItemClick = (event, index) => {
    this.selectedIndex = index;
    this.open = false;
  };

  handleRequestClose = () => {
    this.open = false;
  };

  render() {
    const classes = this.props.classes;

    return (
      <div>
        <List>
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="When device is locked"
            onClick={this.handleClickListItem}
          >
            <ListItemText
              className={classes.root}
              primary={options[this.selectedIndex]}
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
              selected={index === this.selectedIndex}
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
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired
  }).isRequired
};

export default withStyles(styleSheet)(SingleSelect);
