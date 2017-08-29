import Menu, { MenuItem } from 'material-ui/Menu';

import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = {
  label: {
    fontSize: '15px'
  }
};

@observer
class Select extends React.Component {
  @observable isOpen = false;
  @observable anchorEl = undefined;

  handleClick = (event) => {
    this.isOpen = true;
    this.anchorEl = event.currentTarget;
  }

  handleRequestClose = () => {
    this.isOpen = false;
  };

  render() {
    return (
      <div>
        <Button
          classes={{ label: this.props.classes.label }}
          color="contrast"
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {this.props.title}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.anchorEl}
          open={this.isOpen}
          onRequestClose={this.handleRequestClose}
        >
          {this.props.optionList.map((value, index) => (
            <MenuItem key={value} onClick={() => this.props.handleSelect(index)}>
              <Checkbox
                checked={this.props.selected.has(index)}
                tabIndex="-1"
                disableRipple
              />
              {value}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

Select.propTypes = {
  classes: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired,
  title: PropTypes.string.isRequired,
  optionList: ImmutablePropTypes.list.isRequired,
  selected: ImmutablePropTypes.set.isRequired,
  handleSelect: PropTypes.func.isRequired
};

export default withStyles(styles)(Select);
