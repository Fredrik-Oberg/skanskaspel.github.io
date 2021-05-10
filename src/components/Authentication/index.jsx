import React from "react";
import "firebase/auth";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

function Authentication(props) {
  const { firebase, isSignedIn, setIsSignedIn } = props;
  const [
    waitingForEmailConfirmation,
    setWaitingForEmailConfirmation,
  ] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(false);

  // Listen to the Firebase Auth state and set the local state.
  React.useEffect(() => {
    const unregisterAuthObserver = firebase.auth.onAuthStateChanged(
      async (user) => {
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
  }, [firebase, setIsSignedIn, setWaitingForEmailConfirmation]);

  return !isSignedIn ? (
    <div>
      <StyledFirebaseAuth
        uiConfig={firebase.uiConfig}
        firebaseAuth={firebase.auth}
      />
      {waitingForEmailConfirmation && (
        <h3>Verifiera din epost {userEmail} och logga sedan in igen</h3>
      )}
    </div>
  ) : null;
}
export default Authentication;
