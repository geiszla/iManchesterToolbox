import Menu, { MenuItem } from 'material-ui/Menu';

import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class Select extends React.Component {
  @observable isOpen = false;
  @observable anchorEl = undefined;

  button = undefined;

  handleClick = (event) => {
    this.isOpen = true;
    this.anchorEl = event.currentTarget;
  }

  handleRequestClose = () => {
    this.isOpen = false;
  };

  render() {
    const options = this.props.optionList.map((value, index) => (
      <MenuItem key={index} onClick={() => this.props.handleSelect(index)}>
        <Checkbox
          checked={this.props.selected.has(index)}
          tabIndex="-1"
          disableRipple
        />
        {value}
      </MenuItem>
    ));

    return (
      <div>
        <Button
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
          {options}
        </Menu>
      </div>
    );
  }
}

Select.propTypes = {
  title: PropTypes.string.isRequired,
  optionList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: ImmutablePropTypes.set.isRequired,
  handleSelect: PropTypes.func.isRequired
};

export default Select;
