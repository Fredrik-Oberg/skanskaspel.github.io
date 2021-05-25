import * as React from "react";
import AuthContext from "./context";

// https://reactnavigation.org/docs/auth-flow/#implement-the-logic-for-restoring-the-token
// TODO Use this context instead of Auth so we get rid of the flashing login screen
export default function Auth({ firebase, children }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SIGN_IN":
          return {
            ...prevState,
            isSignedIn: true,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignedIn: false,
          };
      }
    },
    {
      isLoading: true,
      isSignedIn: true,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let signedIn;

      try {
        signedIn =
          firebase.auth.currentUser && firebase.auth.currentUser.emailVerified;
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      const type = signedIn ? "SIGN_IN" : "SIGN_OUT";
      dispatch({ type: type });
    };

    bootstrapAsync();
  }, [firebase]);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      {state.isSignedIn == false ? (
        <Authentication firebase={firebase}></Authentication>
      ) : (
        { children }
      )}
    </AuthContext.Provider>
  );
}
