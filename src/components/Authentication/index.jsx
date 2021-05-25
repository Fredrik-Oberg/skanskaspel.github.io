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
  }, [
    firebase,
    setIsSignedIn,
    setWaitingForEmailConfirmation,
    setShowLoader,
    waitingForEmailConfirmation,
  ]);
  console.log(waitingForEmailConfirmation);
  return showLoader ? (
    <Loader />
  ) : !isSignedIn ? (
    <Box>
      <StyledFirebaseAuth
        uiConfig={firebase.uiConfig}
        firebaseAuth={firebase.auth}
      />
      {!waitingForEmailConfirmation ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt="40px"
        >
          <Typography
            fontWeight="fontWeightBold"
            style={{ fontStyle: "italic" }}
          >
            ”Av alla oviktiga ting i världen är fotboll det viktigaste”
          </Typography>
          <Typography variant="body2">- Påven Johannes Paulus II</Typography>
        </Box>
      ) : (
        <Box textAlign="center" mt="40px">
          <Typography variant="h6">Tack för din anmälan!</Typography>
          <Typography variant="h6">
            Du kommer strax att få ett mail med en länk. Klicka på länken för
            att verifiera dina uppgifter och logga in här på nytt.
          </Typography>
          <br />
          <Typography variant="h6">
            Sen är du redo att spela bort dina besparingar.
          </Typography>
        </Box>
      )}
    </Box>
  ) : null;
}
export default Authentication;
