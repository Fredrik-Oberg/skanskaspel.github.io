import React from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapForm: {
      display: "flex",
      justifyContent: "center",
      width: "95%",
      margin: `${theme.spacing(0)} auto`,
    },
    wrapText: {
      width: "100%",
    },
    button: {
      margin: theme.spacing(1),
    },
  })
);

export const TextInput = ({ onSubmit }) => {
  const [value, setValue] = React.useState("");
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === "") return;
    onSubmit(value);
    setValue("");
  };

  const classes = useStyles();
  return (
    <>
      <form
        className={classes.wrapForm}
        noValidate
        autoComplete="off"
        onSubmit={handleOnSubmit}
      >
        <TextField
          id="standard-text"
          label="Thrash away"
          className={classes.wrapText}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          //margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={handleOnSubmit}
        >
          <SendIcon />
        </Button>
      </form>
    </>
  );
};
