// import "./App.css";
import React from "react";

import Header from "./Header";
import Home from "./Home";
import { FirebaseContext } from "./components/Firebase";
import Authentication from "./components/Authentication";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

let theme = createMuiTheme();
theme.typography.body1 = {
  [theme.breakpoints.down("xs")]: {
    fontSize: "0.7rem",
  },
};

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false); // Local signed-in state.

  return (
    <FirebaseContext.Consumer>
      {(firebase) => {
        return (
          <ThemeProvider theme={theme}>
            <Header
              firebase={firebase}
              userName={"userName"}
              isSignedIn={isSignedIn}
              setIsSignedIn={setIsSignedIn}
            />
            {isSignedIn ? (
              <Home firebase={firebase} />
            ) : (
              <Authentication
                firebase={firebase}
                setIsSignedIn={setIsSignedIn}
              />
            )}
          </ThemeProvider>
        );
      }}
    </FirebaseContext.Consumer>
  );
}

export default App;
