// Initialize Firebase
var config = {
  apiKey: "AIzaSyCIhCclgNyJl_FNUnLT07AM43AZrfLY_s0",
  authDomain: "puppylove-a5a48.firebaseapp.com",
  databaseURL: "https://puppylove-a5a48.firebaseio.com",
  projectId: "puppylove-a5a48",
  storageBucket: "puppylove-a5a48.appspot.com",
  messagingSenderId: "986412996688"
};
firebase.initializeApp(config);

function signOut() {
  firebase.auth().signOut();
}
