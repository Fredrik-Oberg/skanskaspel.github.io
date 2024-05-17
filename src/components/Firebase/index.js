import FirebaseContext from "./context";
import Firebase from "./firebase";

export default Firebase;

export { FirebaseContext };

const oldFetch = window.fetch;
window.fetch = function () {
  // arguments[1].mode = "no-cors";
  return oldFetch.apply(window, arguments);
};
