import React from "react";
import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const Snack = ({ message, customParameters, SnackbarProps }) => {
  return (
    <Snackbar autoHideDuration={5000} message={message} {...SnackbarProps}>
      <Alert variant={"filled"} severity={customParameters?.type || "success"}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default Snack;
