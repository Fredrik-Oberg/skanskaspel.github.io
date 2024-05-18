import './App.css';
import React from 'react';
import { SvgIcon, Typography } from '@mui/material';
import { ReactComponent as Skane } from './skanska_flaggan.svg';

function Header() {
  return (
    <header className="App-header">
      <Typography variant="h3" align="center">
        <SvgIcon component={Skane} />
        {'Skånska Spel'}
        <SvgIcon component={Skane} />
      </Typography>
    </header>
  );
}

export default Header;
