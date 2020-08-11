import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function Header(props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={props.onClickPosts}
        >
          <MenuIcon />
        </IconButton>
        <Button color="inherit" onClick={props.onClick}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
