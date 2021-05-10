import React from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from "material-ui-snackbar-provider";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Firebase, { FirebaseContext } from "./components/Firebase";
import Snack from "./components/Snack";

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <SnackbarProvider SnackbarComponent={Snack}>
        <App />
      </SnackbarProvider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
