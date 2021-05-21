import React from "react";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Box, Grid, Typography } from "@material-ui/core";
import Loader from "../Loader";

function Authentication(props) {
  const { firebase, isSignedIn, setIsSignedIn } = props;
  const [waitingForEmailConfirmation, setWaitingForEmailConfirmation] =
    React.useState(false);
  const [userEmail, setUserEmail] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(!isSignedIn);

  // Listen to the Firebase Auth state and set the local state.
  React.useEffect(() => {
    const unregisterAuthObserver = firebase.auth.onAuthStateChanged(
      async (user) => {
        setShowLoader(false);
        console.log(user);
        if (!user) {
          return false;
        }
        if (user.emailVerified) {
          setIsSignedIn(!!user);
          setWaitingForEmailConfirmation(false);
          return;
        }
        await firebase.auth.currentUser.sendEmailVerification();
        setUserEmail(user.email);
        setWaitingForEmailConfirmation(true);
      }
    );
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [firebase, setIsSignedIn, setWaitingForEmailConfirmation, setShowLoader]);

  return showLoader ? (
    <Loader />
  ) : !isSignedIn ? (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Box width={480}>
          <StyledFirebaseAuth
            uiConfig={firebase.uiConfig}
            firebaseAuth={firebase.auth}
          />
          {waitingForEmailConfirmation && (
            <Typography variant="h5" style={{ marginTop: "20px" }}>
              Verifiera din epost {userEmail} och logga sedan in igen.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  ) : null;
}
export default Authentication;
