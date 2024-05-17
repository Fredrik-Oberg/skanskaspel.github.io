import React from 'react';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

const classes = {
  wrapForm: {
    display: 'flex',
    justifyContent: 'center',
    width: '95%',
    margin: `${theme.spacing(0)} auto`,
  },
  wrapText: {
    width: '100%',
  },
  button: {
    margin: theme.spacing(1),
  },
};

export const TextInput = ({ onSubmit }) => {
  const [value, setValue] = React.useState('');
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === '') return;
    onSubmit(value);
    setValue('');
  };

  return (
    <>
      <form className={classes.wrapForm} noValidate autoComplete="off" onSubmit={handleOnSubmit}>
        <TextField
          id="standard-text"
          label="Thrash away"
          sx={{
            wrapText: classes.wrapText,
          }}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          //margin="normal"
        />
        <Button variant="contained" color="primary" className={classes.button} onClick={handleOnSubmit}>
          <SendIcon />
        </Button>
      </form>
    </>
  );
};
