import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Snack = ({ message, customParameters, SnackbarProps }) => {
  return (
    <Snackbar autoHideDuration={5000} message={message} {...SnackbarProps}>
      <Alert variant={'filled'} severity={customParameters?.type || 'success'}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default Snack;
