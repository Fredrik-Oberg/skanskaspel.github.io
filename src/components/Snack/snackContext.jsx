import React, { createContext, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

const Context = createContext();

function RenderSnack({ id, message, open, handleClose }) {
  const messageId = `message-${id}`;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      ContentProps={{
        "aria-describedby": messageId,
      }}
      message={<span id={messageId}>{message}</span>}
      action={[
        <Button key="undo" color="secondary" size="small" onClick={handleClose}>
          UNDO
        </Button>,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={handleClose}
        >
          X
        </IconButton>,
      ]}
    />
  );
}

let uniqueId = 2;

export const SnackProvider = ({ children }) => {
  const [{ current, queue }, setState] = useState({ current: null, queue: [] });
  debugger;
  function createSnack(message, options) {
    const id = uniqueId++;
    const snack = { id, message, open: true, options };

    if (current) {
      setState({ current, queue: queue.concat(snack) });
    } else {
      setState({ queue, current: snack });
    }

    return id;
  }

  function handleClose() {
    setState((currentState) => ({
      ...currentState,
      current: { ...currentState.current, open: false },
    }));
    // time to snack close animation
    setTimeout(openNext, 1000);
  }

  function openNext() {
    if (queue.length) {
      setState({ current: queue[0], queue: queue.slice(1) });
    } else {
      setState({ current: null, queue: [] });
    }
  }

  return (
    <Context.Provider value={{ createSnack }}>
      {current && (
        <RenderSnack key={current.id} {...current} handleClose={handleClose} />
      )}
      {children}
    </Context.Provider>
  );
};

export default Context;
