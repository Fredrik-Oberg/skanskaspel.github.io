import "./App.css";
import React from "react";
import Button from "@material-ui/core/Button";
import { SvgIcon } from "@material-ui/core";
import { ReactComponent as Skane } from "./skanska_flaggan.svg";

function Header({ firebase, setIsSignedIn }) {
  return (
    <header className="App-header">
      {!firebase.auth.currentUser ? (
        <h3>Logga in</h3>
      ) : (
        <>
          <SvgIcon component={Skane}></SvgIcon>
          <h3>{firebase.auth.currentUser.displayName}</h3>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "10px" }}
            onClick={() =>
              firebase.auth.signOut().then(() => (document.location.href = "/"))
            }
          >
            Logga ut
          </Button>
        </>
      )}
    </header>
  );
}

export default Header;
