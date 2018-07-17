// Display user info when logged in

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("user").innerText =
      "Welcome to Puppy Love " + user.displayName + ".";
    // console.log(user);
    getUser();
  } else {
    console.log("No one is signed in...");
  }
});

function signOut() {
  firebase.auth().signOut();
}

function accountExists() {
  var userInfo = firebase
    .database()
    .ref()
    .child("user-infos")
    .orderByChild("user_id")
    .equalTo(firebase.auth().currentUser.uid);
  userInfo.on("value", function(snapshot) {
    console.log(snapshot.val());
  });
}

function addUser() {
  //testing to see if I can add to a part of the database
  // console.log("Function is firing");

  // must define what is basically the params
  var userData = {
    user_id: "UiZRsi5XOzNjsHxwb7ONMGymQy33",
    name: "Matthew",
    email: "matthew@gmail.com"
  };

  // now we get a key/id for the new user
  var newUserKey = firebase
    .database()
    .ref()
    .child("user-infos")
    .push().key;

  console.log(newUserKey);

  // update the new, empty user that has just been created
  var updates = {};
  updates["user-infos/" + newUserKey] = userData;

  return firebase
    .database()
    .ref()
    .update(updates);
}

function getUser() {
  // this is used to retrieve user info from the database
  var ul = document.getElementById("profiles");
  var profiles = firebase.database().ref("/profiles/");

  profiles.on("value", snap => {
    snap.forEach(function(child) {
      var li = document.createElement("li");
      li.setAttribute("class", "profile");
      ul.appendChild(li);
      li.innerText = JSON.stringify(child.val(), null, 3);

      console.log(child.val());
    });
  });
}
