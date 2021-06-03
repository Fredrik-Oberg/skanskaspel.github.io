import app from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyBAJqLiR_0up73A5ewidTHHg8k8nU1s1BI",
  authDomain: "skanskaspel-7f6dd.firebaseapp.com",
  projectId: "skanskaspel-7f6dd",
  storageBucket: "skanskaspel-7f6dd.appspot.com",
  messagingSenderId: "903124138548",
  appId: "1:903124138548:web:334599b1d92305a86ae861",
  measurementId: "G-8QL506EK08",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.functions = app.app().functions("europe-west3");
    this.storage = app.app().storage();
    this.uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: "popup",
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      signInSuccessUrl: "/",
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        {
          provider: app.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
        },
      ],
    };
    // const ui = new firebaseui.auth.AuthUI(this.auth);

    // // This adds firebaseui to the page
    // // It does everything else on its own
    // this.startFirebaseUI = function (elementId) {
    //   ui.start(elementId, this.uiConfig);
    // };

    if (process.env.NODE_ENV === "development") {
      this.auth.useEmulator("http://localhost:9099");
      this.functions.useEmulator("localhost", 5001);
    }
  }
}

export default Firebase;
