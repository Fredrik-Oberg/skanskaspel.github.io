// import "./App.css";
import React from "react";

import Header from "./Header";
import Home from "./Home";
import { FirebaseContext } from "./components/Firebase";
import Authentication from "./components/Authentication";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";
import Loader from "./components/Loader";

const createTheme = () => {
  const breakpoints = createBreakpoints({});
  const options = {
    palette: {
      type: "light",
      primary: {
        main: "#D62828",
      },
      secondary: {
        main: "#f7dd16",
        // main: "#FCBF49",
      },
    },
    typography: {
      body1: {
        [breakpoints.down("xs")]: {
          fontSize: "0.7rem",
        },
      },
    },
  };

  return createMuiTheme(options);
};

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(null); // Local signed-in state.
  // TODO show loader until we know if we are signed in or not
  // maybe global context with state signin/out instead
  // https://reactnavigation.org/docs/auth-flow/#implement-the-logic-for-restoring-the-token
  return (
    <FirebaseContext.Consumer>
      {(firebase) => {
        return (
          <ThemeProvider theme={createTheme()}>
            {!isSignedIn ? (
              <>
                <Header />
                <Authentication
                  firebase={firebase}
                  isSignedIn={isSignedIn}
                  setIsSignedIn={setIsSignedIn}
                />
              </>
            ) : (
              <Home firebase={firebase} />
            )}
          </ThemeProvider>
        );
      }}
    </FirebaseContext.Consumer>
  );
}

export default App;
