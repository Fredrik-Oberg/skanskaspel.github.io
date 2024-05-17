import React from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import { createRoot } from 'react-dom/client';

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Firebase, { FirebaseContext } from "./components/Firebase";
import Snack from "./components/Snack";
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <SnackbarProvider SnackbarComponent={Snack}>
        <App />
      </SnackbarProvider>
    </FirebaseContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
